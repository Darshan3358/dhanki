// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Mock USDT Contract for testing
contract MockUSDT {
    string public name = "Mock USDT";
    string public symbol = "mUSDT";
    uint8 public decimals = 18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        balanceOf[msg.sender] = 1000000 * 10**18; // 1 Million mock USDT
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    // Mint function for testing
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}

// Main Dhanik Token Contract
contract DhanikToken {
    
    string public name = "Dhanik Token";
    string public symbol = "DHANIK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 200000000 * 10**18; // 20 Crore tokens
    
    address public admin;
    MockUSDT public usdtToken;
    
    uint256 public currentPrice = 1e16; // 0.01 USDT (in wei equivalent)
    
    
    // MLM Levels percentages (in basis points - 100 = 1%)
    uint256 public constant LEVEL1_PERCENT = 500; // 5%
    uint256 public constant LEVEL2_PERCENT = 200; // 2%  
    uint256 public constant LEVEL3_PERCENT = 100; // 1%
    
    // Phase pricing structure
    struct Phase {
        uint256 phaseNumber;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Phase) public phases;
    uint256 public currentPhase;
    
    // User balances
    mapping(address => uint256) public balanceOf;
    
    
    
    // Referral structure
    mapping(address => address) public referrer;
    mapping(address => address[]) public referrals;
    
    // Purchase history
    struct Purchase {
        uint256 timestamp;
        string currency; // "INR" or "USDT"
        uint256 amount;
        uint256 tokensReceived;
        uint256 price;
    }
    
    mapping(address => Purchase[]) public purchaseHistory;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event BuyToken(address indexed user, address indexed referrer, uint256 amount, uint256 tokens, string currency);
    event SellToken(address indexed user, uint256 tokenAmount, uint256 usdtAmount);
    event CommissionDistributed(address indexed user, uint256 level, uint256 amount, string currency);
    event PriceUpdated(uint256 phase, uint256 newPrice);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);

    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    constructor(address _usdtToken) {
        admin = msg.sender;
        usdtToken = MockUSDT(_usdtToken);
        balanceOf[admin] = totalSupply;
        
        // Initialize phases
        phases[1] = Phase(1, 1e16, true);  // Phase 1: 0.01 USDT
        phases[2] = Phase(2, 2e16, true);  // Phase 2: 0.02 USDT
        phases[3] = Phase(3, 5e16, true);  // Phase 3: 0.05 USDT
        
        currentPhase = 1;
        currentPrice = phases[1].price;
        
        emit Transfer(address(0), admin, totalSupply);
    }
    
    // 1. Buy Token with USDT
    function buyWithUSDT(address _referrer, uint256 _usdtAmount) external {
        require(_usdtAmount > 0, "Amount must be greater than 0");
        
        // Transfer USDT from user to contract
        require(usdtToken.transferFrom(msg.sender, address(this), _usdtAmount), "USDT transfer failed");
        
        // Calculate tokens to mint
        uint256 tokensToMint = (_usdtAmount * 10**18) / currentPrice;
        require(balanceOf[admin] >= tokensToMint, "Insufficient tokens in admin wallet");
        
        // Process purchase with referral
        processPurchase(msg.sender, _referrer, _usdtAmount, tokensToMint, "USDT");
        
        // Record purchase
        purchaseHistory[msg.sender].push(Purchase({
            timestamp: block.timestamp,
            currency: "USDT",
            amount: _usdtAmount,
            tokensReceived: tokensToMint,
            price: currentPrice
        }));
    }
    

    
    // Internal function to process purchase and distribute commissions
    function processPurchase(address _user, address _referrer, uint256 _usdtValue, uint256 _tokens, string memory _currency) internal {
        // Set referrer if not set
        if (referrer[_user] == address(0) && _referrer != address(0) && _referrer != _user) {
            referrer[_user] = _referrer;
            referrals[_referrer].push(_user);
        }
        
        // Transfer tokens from admin to user
        balanceOf[admin] -= _tokens;
        balanceOf[_user] += _tokens;
        
        // Distribute MLM commissions
        distributeCommission(_user, _usdtValue, _currency);
        
        emit BuyToken(_user, _referrer, _usdtValue, _tokens, _currency);
        emit Transfer(admin, _user, _tokens);
    }
    
    // Distribute commission through referral levels
    function distributeCommission(address _user, uint256 _amount, string memory _currency) internal {
        address currentReferrer = referrer[_user];
        
        // Level 1 (5%)
        if (currentReferrer != address(0)) {
            uint256 level1Amount = (_amount * LEVEL1_PERCENT) / 10000;
            emit CommissionDistributed(currentReferrer, 1, level1Amount, _currency);
            
            // Level 2 (2%)
            address level2Referrer = referrer[currentReferrer];
            if (level2Referrer != address(0)) {
                uint256 level2Amount = (_amount * LEVEL2_PERCENT) / 10000;
                emit CommissionDistributed(level2Referrer, 2, level2Amount, _currency);
                
                // Level 3 (1%)
                address level3Referrer = referrer[level2Referrer];
                if (level3Referrer != address(0)) {
                    uint256 level3Amount = (_amount * LEVEL3_PERCENT) / 10000;
                    emit CommissionDistributed(level3Referrer, 3, level3Amount, _currency);
                }
            }
        }
    }
    
    // Transfer ownership
    function transferOwnership(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New admin cannot be zero address");
        require(newAdmin != admin, "New admin must be different");
        
        address oldAdmin = admin;
        admin = newAdmin;
        
        emit AdminTransferred(oldAdmin, newAdmin);
    }
    
    // Admin transfer between users
    function transferFrom(address from, address to, uint256 amount) external onlyAdmin {
        require(from != address(0), "Invalid sender");
        require(to != address(0), "Invalid recipient");
        require(balanceOf[from] >= amount, "Insufficient balance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(from, to, amount);
        emit TokensTransferred(from, to, amount);
    }
    
    // User to user transfer
    function transferTo(address to, uint256 amount) external {
        require(to != address(0), "Invalid recipient");
        require(to != msg.sender, "Cannot send to self");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        emit TokensTransferred(msg.sender, to, amount);
    }
    
    // Update price by phase
    function priceUpdate(uint256 phase, uint256 newPrice) external onlyAdmin {
        require(phase >= 1 && phase <= 3, "Invalid phase");
        require(newPrice > 0, "Price must be greater than 0");
        
        phases[phase].price = newPrice;
        phases[phase].active = true;
        
        if (phase == currentPhase) {
            currentPrice = newPrice;
        }
        
        emit PriceUpdated(phase, newPrice);
    }
    
    // Switch to different phase
    function switchPhase(uint256 phase) external onlyAdmin {
        require(phase >= 1 && phase <= 3, "Invalid phase");
        require(phases[phase].active, "Phase not active");
        
        currentPhase = phase;
        currentPrice = phases[phase].price;
        
        emit PriceUpdated(phase, currentPrice);
    }
    
    // Sell tokens back to admin
    function sellToken(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be greater than 0");
        require(balanceOf[msg.sender] >= tokenAmount, "Insufficient token balance");
        
        // Calculate USDT value
        uint256 usdtValue = (tokenAmount * currentPrice) / 10**18;
        
        // Transfer tokens from user to admin
        balanceOf[msg.sender] -= tokenAmount;
        balanceOf[admin] += tokenAmount;
        
        // Transfer USDT from contract to user
        require(usdtToken.transfer(msg.sender, usdtValue), "USDT transfer failed");
        
        emit SellToken(msg.sender, tokenAmount, usdtValue);
        emit Transfer(msg.sender, admin, tokenAmount);
    }
    
    
    
    // Admin withdraw collected USDT
    function withdrawUSDT(uint256 amount) external onlyAdmin {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken.balanceOf(address(this)) >= amount, "Insufficient USDT balance");
        require(usdtToken.transfer(admin, amount), "USDT transfer failed");
    }
    
    // Get user purchase history
    function getPurchaseHistory(address user) external view returns (Purchase[] memory) {
        return purchaseHistory[user];
    }
    
    // Get user balance
    function getBalance(address user) external view returns (uint256) {
        return balanceOf[user];
    }
    
    // Get referrals
    function getReferrals(address user) external view returns (address[] memory) {
        return referrals[user];
    }
    
    // Get referrer
    function getReferrer(address user) external view returns (address) {
        return referrer[user];
    }
    
    // Get current price
    function getCurrentPrice() external view returns (uint256) {
        return currentPrice;
    }
    
    // Get contract USDT balance
    function getContractUSDTBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }
}

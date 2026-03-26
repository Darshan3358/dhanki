// Contract Addresses Configuration — BSC Mainnet & Testnet only
const NETWORK_CONFIG = {
    56: { // BSC Mainnet
        DHANIK: "0x388b6B6cf1E2AE7Df7494f0569137fe6C1A5247E",
        USDT: "0x55d398326f99059fF775485246999027B3197955"
    },
    97: { // BSC Testnet
        DHANIK: "0x388b6B6cf1E2AE7Df7494f0569137fe6C1A5247E",
        USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
    }
};

// Default values — BSC Mainnet
export const DHANIK_ADDRESS = NETWORK_CONFIG[56].DHANIK;
export const USDT_ADDRESS = NETWORK_CONFIG[56].USDT;

// BSC chain params for wallet_addEthereumChain
export const BSC_CHAIN_PARAMS = {
    chainId: '0x38',
    chainName: 'BNB Smart Chain Mainnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/']
};

// Helper to get addresses based on current chain
export const getAddresses = (chainId) => {
    const id = parseInt(chainId);
    return NETWORK_CONFIG[id] || NETWORK_CONFIG[56];
};

// Check if the connected chain is BSC (mainnet or testnet)
export const isBSC = (chainId) => [56, 97].includes(parseInt(chainId));

// Switch MetaMask / Trust Wallet to BNB Smart Chain
export const switchToBSC = async () => {
    if (!window.ethereum) return;
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }]
        });
    } catch (err) {
        if (err.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [BSC_CHAIN_PARAMS]
            });
        } else {
            throw err;
        }
    }
};

// Full ABI matching the deployed DhanikToken contract on BSC Mainnet
// BscScan: https://bscscan.com/address/0x388b6B6cf1E2AE7Df7494f0569137fe6C1A5247E#code
export const DHANIK_ABI = [
    { "inputs": [{ "internalType": "address", "name": "_usdtToken", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldAdmin", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newAdmin", "type": "address" }], "name": "AdminTransferred", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "address", "name": "referrer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokens", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "currency", "type": "string" }], "name": "BuyToken", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "level", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "currency", "type": "string" }], "name": "CommissionDistributed", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "phase", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "PriceUpdated", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "usdtAmount", "type": "uint256" }], "name": "SellToken", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokensTransferred", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" },
    { "inputs": [], "name": "LEVEL1_PERCENT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "LEVEL2_PERCENT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "LEVEL3_PERCENT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_referrer", "type": "address" }, { "internalType": "uint256", "name": "_usdtAmount", "type": "uint256" }], "name": "buyWithUSDT", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "currentPhase", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "currentPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getContractUSDTBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getCurrentPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getPurchaseHistory", "outputs": [{ "components": [{ "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "string", "name": "currency", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "tokensReceived", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "internalType": "struct DhanikToken.Purchase[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getReferrals", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getReferrer", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "phases", "outputs": [{ "internalType": "uint256", "name": "phaseNumber", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "phase", "type": "uint256" }, { "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "priceUpdate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "purchaseHistory", "outputs": [{ "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "string", "name": "currency", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "tokensReceived", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "referrals", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "referrer", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }], "name": "sellToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "phase", "type": "uint256" }], "name": "switchPhase", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "newAdmin", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferTo", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "usdtToken", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdrawUSDT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];


// BSC USDT (BEP-20) ABI — standard ERC-20 + transfer
export const USDT_ABI = [
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
];

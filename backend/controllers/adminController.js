const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');
const SupportMessage = require('../models/SupportMessage');

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user status (Enable/Disable/Ban)
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.status = req.body.status || user.status;
        await user.save();
        res.json({ message: 'User status updated', status: user.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/admin/transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate('user', 'name email referralId walletAddress referredBy')
            .populate('fromUser', 'name email referralId walletAddress referredBy')
            .sort({ createdAt: -1 })
            .lean();

        // Map txHash to transactionId for frontend compatibility
        const mapped = transactions.map(tx => ({
            ...tx,
            transactionId: tx.transactionId || tx.txHash
        }));

        console.log(`✅ Admin fetched ${mapped.length} transactions`);
        res.json(mapped);
    } catch (error) {
        console.error('getAllTransactions error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update transaction status (Approve/Reject)
// @route   PUT /api/admin/transactions/:id
const updateTransactionStatus = async (req, res) => {
    const { status, txHash } = req.body;

    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        // Save blockchain hash if provided
        if (txHash) transaction.txHash = txHash;

        // If approving a token purchase that was pending
        if (status === 'completed' && transaction.status === 'pending') {
            if (transaction.type === 'purchase') {
                const user = await User.findById(transaction.user);
                if (user) {
                    const tokensToCredit = transaction.tokens || 0;
                    const usdtValue = tokensToCredit * 0.01;

                    user.wallet.dhanki += tokensToCredit;
                    user.totalInvestment += usdtValue;
                    await user.save();

                    // MLM Logic... (remains same)
                    const distributeCommission = async (beneficiaryReferralId, percentage, level) => {
                        if (!beneficiaryReferralId) return null;
                        const sponsor = await User.findOne({
                            $or: [{ referralId: beneficiaryReferralId }, { walletAddress: beneficiaryReferralId.toLowerCase() }]
                        });
                        if (!sponsor) return null;
                        const commissionAmount = (tokensToCredit * percentage) / 100;
                        sponsor.wallet.dhanki += commissionAmount;
                        const incomeField = `level${level}`;
                        if (sponsor.income) {
                            sponsor.income[incomeField] += commissionAmount;
                            sponsor.income.total += commissionAmount;
                        }
                        await sponsor.save();
                        await Transaction.create({
                            user: sponsor._id,
                            fromUser: user._id,
                            type: 'level_income',
                            amount: commissionAmount,
                            tokens: commissionAmount,
                            currency: 'DHANKI',
                            level,
                            status: 'completed'
                        });
                        return sponsor.referredBy;
                    };

                    const sponsorL1Id = await distributeCommission(user.referredBy, 5, 1);
                    if (sponsorL1Id) {
                        const sponsorL2Id = await distributeCommission(sponsorL1Id, 2, 2);
                        if (sponsorL2Id) {
                            await distributeCommission(sponsorL2Id, 1, 3);
                        }
                    }
                }
            } else if (transaction.type === 'withdrawal') {
                const user = await User.findById(transaction.user);
                if (user) {
                    const amountToDeduct = transaction.tokens || transaction.amount || 0;
                    user.wallet.dhanki = Math.max(0, user.wallet.dhanki - amountToDeduct);
                    await user.save();
                }
            }
        }

        transaction.status = status;
        await transaction.save();

        res.json({ success: true, message: `Transaction ${status}`, transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Platform Stats
// @route   GET /api/admin/stats
const getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});

        // Sum of all completed purchases (Revenue)
        // Convert USDT to INR (assuming 1 USDT = 90 INR as per tokenController) for uniform reporting
        const totalRevenueResult = await Transaction.aggregate([
            { $match: { type: 'purchase', status: 'completed' } },
            { $group: { 
                _id: null, 
                total: { 
                    $sum: {
                        $cond: [
                            { $eq: ["$currency", "USDT"] },
                            { $multiply: ["$amount", 90] },
                            "$amount"
                        ]
                    }
                } 
            } }
        ]);

        // Sum of all DHANKI tokens sold
        const totalTokensResult = await Transaction.aggregate([
            { $match: { type: 'purchase', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$tokens' } } }
        ]);

        // Real active nodes: users who have actually made an investment > 0
        const activeNodes = await User.countDocuments({ totalInvestment: { $gt: 0 } });

        res.json({
            totalUsers,
            revenue: totalRevenueResult[0]?.total || 0,
            tokenSold: totalTokensResult[0]?.total || 0,
            activeNodes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Admin Settings
// @route   GET /api/admin/settings
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Create default if doesn't exist
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Admin Settings
// @route   PUT /api/admin/settings
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            settings.dhankiPrice = req.body.dhankiPrice ?? settings.dhankiPrice;
            // Removed networkFee as per user request
            settings.minWithdrawal = req.body.minWithdrawal ?? settings.minWithdrawal;
            settings.usdtToInr = req.body.usdtToInr ?? settings.usdtToInr;
            settings.maintenanceMode = req.body.maintenanceMode ?? settings.maintenanceMode;
            settings.supportEmail = req.body.supportEmail ?? settings.supportEmail;
            settings.supportLiveChat = req.body.supportLiveChat ?? settings.supportLiveChat;
            settings.supportWebsite = req.body.supportWebsite ?? settings.supportWebsite;
            settings.updatedAt = Date.now();
        }
        await settings.save();
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all support messages (Admin)
// @route   GET /api/admin/support-messages
const getSupportMessages = async (req, res) => {
    try {
        const messages = await SupportMessage.find({})
            .populate('user', 'name email referralId')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user wallet balance (Admin manual adjustment)
// @route   PUT /api/admin/users/:id/wallet
const updateUserWallet = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { dhanki } = req.body;
        if (dhanki !== undefined) {
            user.wallet.dhanki = parseFloat(dhanki);
        }
        await user.save();
        res.json({ message: 'Wallet updated', wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Full user data edit by Admin
// @route   PUT /api/admin/users/:id/edit
const updateUserData = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, phone, walletAddress, status, dhanki, totalInvestment } = req.body;

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (walletAddress !== undefined) user.walletAddress = walletAddress;
        if (status !== undefined) user.status = status;
        if (dhanki !== undefined) user.wallet.dhanki = parseFloat(dhanki);
        if (totalInvestment !== undefined) user.totalInvestment = parseFloat(totalInvestment);

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    updateUserStatus,
    updateUserWallet,
    updateUserData,
    getAllTransactions,
    updateTransactionStatus,
    getPlatformStats,
    getSettings,
    updateSettings,
    getSupportMessages
};

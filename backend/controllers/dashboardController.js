const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Update to match current User schema
        const stats = {
            dhanikBalance: user.wallet.dhanik,
            tokenPrice: 0.01,
            totalEarnings: user.income.total,
            walletBalance: user.wallet.balance,
            levelIncome: {
                l1: user.income.level1,
                l2: user.income.level2,
                l3: user.income.level3
            },
            referralCount: (user.referrals.level1?.length || 0) + (user.referrals.level2?.length || 0) + (user.referrals.level3?.length || 0)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };

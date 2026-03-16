const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // In a real app, these would come from database aggregations
        const stats = {
            dhankiBalance: user.balances.dhanki,
            tokenPrice: 0.01,
            totalEarnings: user.incomeEarned.total,
            walletBalance: user.balances.usdt + (user.balances.inr / 90),
            levelIncome: {
                l1: user.incomeEarned.level1,
                l2: user.incomeEarned.level2,
                l3: user.incomeEarned.level3
            },
            referralCount: user.referrals.level1.length + user.referrals.level2.length + user.referrals.level3.length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };

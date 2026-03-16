const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get referral network tree (3 levels) with business stats
// @route   GET /api/referral/network
const getReferralNetwork = async (req, res) => {
    // ... existing getReferralNetwork logic ...
    // (keeping it the same as before)
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'referrals.level1',
                select: 'name email referralId status createdAt wallet totalInvestment income'
            })
            .populate({
                path: 'referrals.level2',
                select: 'name email referralId status createdAt wallet totalInvestment income'
            })
            .populate({
                path: 'referrals.level3',
                select: 'name email referralId status createdAt wallet totalInvestment income'
            });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const calculateLevelStats = (members) => {
            return members.reduce((acc, member) => {
                acc.business += (member.totalInvestment || 0);
                acc.income += (member.income?.total || 0);
                return acc;
            }, { business: 0, income: 0 });
        };

        const l1Stats = calculateLevelStats(user.referrals.level1);
        const l2Stats = calculateLevelStats(user.referrals.level2);
        const l3Stats = calculateLevelStats(user.referrals.level3);

        const network = {
            level1: user.referrals.level1 || [],
            level2: user.referrals.level2 || [],
            level3: user.referrals.level3 || [],
            summary: {
                l1Count: user.referrals.level1?.length || 0,
                l2Count: user.referrals.level2?.length || 0,
                l3Count: user.referrals.level3?.length || 0,
                totalTeam: (user.referrals.level1?.length || 0) + (user.referrals.level2?.length || 0) + (user.referrals.level3?.length || 0),
                totalBusiness: l1Stats.business + l2Stats.business + l3Stats.business,
                totalLevelIncome: user.income?.total || 0
            },
            levelStats: {
                l1: { business: l1Stats.business, income: user.income?.level1 || 0, percentage: 5 },
                l2: { business: l2Stats.business, income: user.income?.level2 || 0, percentage: 2 },
                l3: { business: l3Stats.business, income: user.income?.level3 || 0, percentage: 1 }
            }
        };

        res.json(network);
    } catch (error) {
        console.error('Referral Fetch Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get level income history
// @route   GET /api/referral/income-history
const getLevelIncomeHistory = async (req, res) => {
    try {
        const history = await Transaction.find({
            user: req.user._id,
            type: 'level_income'
        })
            .populate('fromUser', 'name email referralId')
            .sort({ createdAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReferralNetwork, getLevelIncomeHistory };

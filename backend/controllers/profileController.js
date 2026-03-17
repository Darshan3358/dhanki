const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').lean();
        if (user) {
            // Aggregate all completed purchase tokens
            const purchaseResult = await Transaction.aggregate([
                { $match: { user: user._id, type: 'purchase', status: 'completed' } },
                { $group: { _id: null, totalTokens: { $sum: '$tokens' }, totalInvestment: { $sum: '$amount' } } }
            ]);

            // Aggregate all completed level income tokens
            const incomeResult = await Transaction.aggregate([
                { $match: { user: user._id, type: 'level_income', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$tokens' } } }
            ]);

            // Aggregate all completed withdrawals
            const withdrawalResult = await Transaction.aggregate([
                { $match: { user: user._id, type: 'withdrawal', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$tokens' } } }
            ]);

            const approvedPurchases = purchaseResult[0]?.totalTokens || 0;
            const approvedIncome = incomeResult[0]?.total || 0;
            const approvedWithdrawals = withdrawalResult[0]?.total || 0;

            // Update user object with calculated values for frontend display
            user.wallet.dhanik = approvedPurchases + approvedIncome - approvedWithdrawals;

            // For total investment, ensure we correspond to what was actually approved
            // If amount was in USDT, use that, if INR was converted, use the recorded amount.
            user.totalInvestment = purchaseResult[0]?.totalInvestment || 0;

            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Personal Info
            user.name = req.body.name || user.name;
            user.walletAddress = req.body.walletAddress || user.walletAddress;

            // Password Update
            if (req.body.password && req.body.currentPassword) {
                const isMatch = await user.matchPassword(req.body.currentPassword);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Current password is incorrect' });
                }
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // Return updated user data (matching storage format)
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                referralId: updatedUser.referralId,
                referredBy: updatedUser.referredBy,
                walletAddress: updatedUser.walletAddress,
                wallet: updatedUser.wallet,
                referrals: updatedUser.referrals,
                income: updatedUser.income,
                status: updatedUser.status,
                kycStatus: updatedUser.kycStatus,
                createdAt: updatedUser.createdAt
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const bindWallet = async (req, res) => {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ message: 'Wallet address is required' });

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If user already has a DIFFERENT wallet bound
        if (user.walletAddress && user.walletAddress !== '' && user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ message: 'Error: Not the correct wallet for this account' });
        }

        // Check if this wallet is bound to ANY other user
        const walletExists = await User.findOne({
            walletAddress: walletAddress.toLowerCase(),
            _id: { $ne: user._id }
        });

        if (walletExists) {
            return res.status(400).json({ message: 'This wallet is already bound to another user portal' });
        }

        user.walletAddress = walletAddress.toLowerCase();
        // Update referralId to wallet address as per user request
        user.referralId = walletAddress.toLowerCase();
        await user.save();

        res.json({
            success: true,
            message: 'Wallet successfully linked to your portal',
            walletAddress: user.walletAddress
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSponsorWallet = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.referredBy) {
            return res.json({ sponsorWallet: "0x0000000000000000000000000000000000000000" });
        }

        const sponsor = await User.findOne({ referralId: user.referredBy.trim() });
        if (sponsor && sponsor.walletAddress) {
            return res.json({ sponsorWallet: sponsor.walletAddress });
        }

        res.json({ sponsorWallet: "0x0000000000000000000000000000000000000000" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, bindWallet, getSponsorWallet };

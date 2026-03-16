const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Buy = require('../models/Buy');

// @desc    Purchase tokens and distribute multi-level commission
// @route   POST /api/token/purchase
const purchaseTokens = async (req, res) => {
    const { amount, method, txHash, status } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // PREVENTION: Check if this transaction hash already exists to avoid double commission
        if (txHash && txHash !== '') {
            const existingTx = await Transaction.findOne({ txHash });
            if (existingTx) {
                return res.status(400).json({ message: 'Error: This transaction has already been processed.' });
            }
        }

        // If transaction already completed in wallet (Crypto), we just record and sync
        const isContractPurchase = status === 'Completed' && method === 'USDT';

        // Standard Configuration
        const TOKEN_PRICE = 0.01; // USDT
        const INR_RATE = 90; // 1 USDT = 90 INR

        // Calculate investment value in USDT
        const usdtValue = method === 'INR' ? (amount / INR_RATE) : Number(amount);
        const tokensToCredit = usdtValue / TOKEN_PRICE;

        // Screenshot filename (uploaded via multer)
        const screenshotFile = req.file ? req.file.filename : null;

        // 1. Create Buy Record
        const buyRecord = await Buy.create({
            user: userId,
            amount: Number(amount),
            method,
            tokens: tokensToCredit,
            txId: txHash || `TEMP_${Date.now()}`,
            status: isContractPurchase ? 'Completed' : 'Pending'
        });

        // 2. Create Purchase Transaction for History
        const purchaseTx = await Transaction.create({
            user: userId,
            type: 'purchase',
            amount: Number(amount),
            tokens: tokensToCredit,
            currency: method,
            txHash: txHash || `INTERNAL_${Date.now()}`,
            transactionId: txHash || null,
            paymentScreenshot: screenshotFile,
            status: isContractPurchase ? 'completed' : 'pending'
        });

        // 3. Update User's Dhanki balance and total investment
        // ONLY if it's a completed contract purchase. 
        // For INR/Pending, this happens in admin approval.
        if (isContractPurchase) {
            user.wallet.dhanki += tokensToCredit;
            user.totalInvestment += usdtValue;
            await user.save();
        }

        // 4. MLM Logic: Distribute Commission
        // Only if IT IS a completed contract purchase.
        // For INR/Pending, this happens in admin approval.
        if (isContractPurchase) {
            const distributeCommission = async (beneficiaryReferralId, percentage, level) => {
                if (!beneficiaryReferralId) return null;

                const sponsor = await User.findOne({ referralId: beneficiaryReferralId });
                if (!sponsor) return null;

                const commissionAmount = (tokensToCredit * percentage) / 100;
                sponsor.wallet.dhanki += commissionAmount;

                const incomeField = `level${level}`;
                sponsor.income[incomeField] += commissionAmount;
                sponsor.income.total += commissionAmount;

                await sponsor.save();

                await Transaction.create({
                    user: sponsor._id,
                    fromUser: userId,
                    type: 'level_income',
                    amount: commissionAmount,
                    tokens: commissionAmount,
                    currency: 'DHANKI',
                    txHash: txHash || `INTERNAL_${Date.now()}`,
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

        res.status(201).json({
            success: true,
            message: `${tokensToCredit.toLocaleString()} DHANKI tokens credited successfully.`,
            transaction: purchaseTx
        });

    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get income summary for the authenticated user
// @route   GET /api/token/stats
const getIncomeStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            data: {
                wallet: user.wallet,
                totalInvestment: user.totalInvestment,
                incomeBreakdown: user.income
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPurchaseHistory = async (req, res) => {
    try {
        const history = await Transaction.find({
            user: req.user._id,
            type: 'purchase'
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const requestWithdrawal = async (req, res) => {
    const { amount, source, method, details } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create Withdrawal Transaction
        const withdrawalTx = await Transaction.create({
            user: userId,
            type: 'withdrawal',
            amount: Number(amount),
            currency: 'DHANKI',
            source: source, // 'Level Income' or 'Total Income'
            method: method, // 'Bank Transfer' or 'MetaMask'
            paymentDetails: details,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Withdrawal request submitted successfully',
            transaction: withdrawalTx
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { purchaseTokens, getIncomeStats, getPurchaseHistory, requestWithdrawal };

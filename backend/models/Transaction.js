const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['purchase', 'level_income', 'withdrawal'],
        required: true
    },
    amount: { type: Number, required: true }, // Amount in fiat or crypto
    tokens: { type: Number }, // Amount of DHANKI tokens
    currency: { type: String, default: 'USDT' }, // USDT, INR, DHANKI

    // For level income
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who generated the income
    level: { type: Number }, // 1, 2, or 3

    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'rejected'],
        default: 'pending'
    },
    txHash: { type: String }, // Transaction hash or ID
    transactionId: { type: String }, // User-provided transaction ID
    paymentScreenshot: { type: String }, // Path to screenshot

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);

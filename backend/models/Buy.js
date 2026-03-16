const mongoose = require('mongoose');

const buySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['USDT', 'INR'], required: true },
    tokens: { type: Number, required: true },
    txId: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Rejected'], default: 'Pending' },
    paymentScreenshot: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Buy', buySchema);

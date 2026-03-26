const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    referralId: {
        type: String,
        required: true,
        unique: true
    },
    referredBy: {
        type: String,
        default: null
    },
    walletAddress: {
        type: String,
        default: ''
    },
    referrals: {
        level1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        level2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        level3: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    wallet: {
        balance: { type: Number, default: 0 }, // USDT Balance (Level Income etc)
        dhanik: { type: Number, default: 0 }, // DHANIK Token Balance
        staked: { type: Number, default: 0 }  // Staked tokens
    },
    totalInvestment: { type: Number, default: 0 }, // Total USDT value invested
    income: {
        level1: { type: Number, default: 0 },
        level2: { type: Number, default: 0 },
        level3: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected', 'None', 'Active', 'Inactive', 'Banned'],
        default: 'Active'
    },
    kycStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected', 'None'],
        default: 'None'
    },
    isAdmin: {
        type: Number,
        default: 0 // 0 for User, 1 for Admin
    },
    twoFactorOtp: { type: String },
    twoFactorExpires: { type: Date }
}, {
    timestamps: true
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;

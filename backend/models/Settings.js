const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    dhankiPrice: { type: Number, default: 0.015 },
    minWithdrawal: { type: Number, default: 10 },
    usdtToInr: { type: Number, default: 90 },
    maintenanceMode: { type: Boolean, default: false },
    supportEmail: { type: String, default: 'support@dhanik.io' },
    supportLiveChat: { type: String, default: '#' },
    supportWebsite: { type: String, default: 'https://dhanik.io' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);

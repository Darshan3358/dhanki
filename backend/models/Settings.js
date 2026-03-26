const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    dhanikPrice: { type: Number, default: 0.015 },
    minWithdrawal: { type: Number, default: 10 },
    usdtToInr: { type: Number, default: 90 },
    maintenanceMode: { type: Boolean, default: false },
    supportEmail: { type: String, default: 'support@dhanik.in' },
    supportLiveChat: { type: String, default: '+91 91 87094 178' },
    supportWebsite: { type: String, default: 'https://www.dhanik.in/' },
    supportFacebook: { type: String, default: 'https://www.facebook.com/profile.php?id=61587832813071' },
    supportInstagram: { type: String, default: 'https://www.instagram.com/dhanikcrypto' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);

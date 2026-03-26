const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const Settings = require('./backend/models/Settings');

const updateSettings = async () => {
    try {
        console.log('Using MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT LOADED');
        if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        let settings = await Settings.findOne({});
        if (!settings) {
            settings = new Settings();
        }

        settings.supportEmail = 'support@dhanik.in';
        settings.supportLiveChat = '+91 91 87094 178';
        settings.supportWebsite = 'https://www.dhanik.in/';
        settings.supportFacebook = 'https://www.facebook.com/profile.php?id=61587832813071';
        settings.supportInstagram = 'https://www.instagram.com/dhanikcrypto?igsh=OW9sNDhybmd2cWxw&utm_source=qr';
        
        await settings.save();
        console.log('Settings updated successfully in DB');
        process.exit(0);
    } catch (err) {
        console.error('Update failed:', err);
        process.exit(1);
    }
};

updateSettings();

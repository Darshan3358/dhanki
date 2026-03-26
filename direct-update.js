const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const update = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI is missing');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB via native driver');
        const db = client.db('dhanik'); // The DB name from your Compass screenshot
        const settings = db.collection('settings');

        const result = await settings.updateOne(
            {}, // Update the first document found
            {
                $set: {
                    supportEmail: 'support@dhanik.in',
                    supportLiveChat: '+91 91 87094 178',
                    supportWebsite: 'https://www.dhanik.in/',
                    supportFacebook: 'https://www.facebook.com/profile.php?id=61587832813071',
                    supportInstagram: 'https://www.instagram.com/dhanikcrypto?igsh=OW9sNDhybmd2cWxw&utm_source=qr',
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        console.log('Update result:', result);
        console.log('Settings successfully saved to database!');
        process.exit(0);
    } catch (err) {
        console.error('Update failed:', err);
        process.exit(1);
    } finally {
        await client.close();
    }
};

update();

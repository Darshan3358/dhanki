const SupportMessage = require('../models/SupportMessage');
const Settings = require('../models/Settings');

// @desc    Submit support ticket/message
// @route   POST /api/support/contact
const contactSupport = async (req, res) => {
    const { subject, message } = req.body;

    try {
        const newMessage = await SupportMessage.create({
            user: req.user._id,
            subject,
            message
        });

        res.status(201).json({
            message: 'Your message has been received. Our team will contact you soon.',
            ticketId: newMessage._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get support contact info
// @route   GET /api/support/contact-info
const getContactInfo = async (req, res) => {
    try {
        const settings = await Settings.findOne({}).lean();
        let email = (settings?.supportEmail && settings.supportEmail.trim()) || 'support@dhanik.in';
        let liveChat = (settings?.supportLiveChat && settings.supportLiveChat.trim()) || '+91 91 87094 178';
        let website = (settings?.supportWebsite && settings.supportWebsite.trim()) || 'https://www.dhanik.in/';
        let facebook = (settings?.supportFacebook && settings.supportFacebook.trim()) || 'https://www.facebook.com/profile.php?id=61587832813071';
        let instagram = (settings?.supportInstagram && settings.supportInstagram.trim()) || 'https://www.instagram.com/dhanikcrypto';

        // Force new defaults if old ones are in database
        if (email === 'support@dhanik.io') email = 'support@dhanik.in';
        if (liveChat === '#' || liveChat === 'undefined') liveChat = '+91 91 87094 178';
        if (website === 'https://dhanik.io' || website === 'https://www.dhanik.io/') website = 'https://www.dhanik.in/';

        res.json({ email, liveChat, website, facebook, instagram });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system FAQs
// @route   GET /api/support/faqs
const getFaqs = async (req, res) => {
    const faqs = [
        { q: "How do I purchase Dhanik tokens?", a: "Go to the 'Buy Token' section, select your payment method (INR or USDT), enter the amount, and follow the payment instructions." },
        { q: "What is the referral commission structure?", a: "We offer a 3-level commission structure: Level 1 (5%), Level 2 (2%), and Level 3 (1%)." },
        { q: "How long does it take to credit tokens?", a: "Tokens are usually credited instantly after the transaction is verified by our team, typically within 15-30 minutes." },
        { q: "Can I withdraw my referral earnings?", a: "Yes, referral earnings are credited to your main wallet and can be withdrawn according to our withdrawal policy." }
    ];
    res.json(faqs);
};

// @desc    Get user's support tickets
// @route   GET /api/support/my-tickets
const getUserTickets = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not identified' });
        }

        const tickets = await SupportMessage.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { contactSupport, getFaqs, getContactInfo, getUserTickets };

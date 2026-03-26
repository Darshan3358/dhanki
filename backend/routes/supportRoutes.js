const express = require('express');
const { contactSupport, getFaqs, getContactInfo, getUserTickets } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/contact', protect, contactSupport);
router.get('/my-tickets', protect, getUserTickets);
router.get('/contact-info', getContactInfo);
router.get('/faqs', getFaqs);

module.exports = router;

const express = require('express');
const { contactSupport, getFaqs, getContactInfo } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/contact', protect, contactSupport);
router.get('/contact-info', getContactInfo);
router.get('/faqs', getFaqs);

module.exports = router;

const express = require('express');
const { getUserProfile, updateUserProfile, bindWallet, getSponsorWallet } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/bind-wallet', protect, bindWallet);
router.get('/sponsor-wallet', protect, getSponsorWallet);

module.exports = router;

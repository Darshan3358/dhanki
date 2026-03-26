const express = require('express');
const { getReferralNetwork, getLevelIncomeHistory } = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/network', protect, getReferralNetwork);
router.get('/income-history', protect, getLevelIncomeHistory);

module.exports = router;

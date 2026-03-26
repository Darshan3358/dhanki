const express = require('express');
const {
    getAllUsers,
    updateUserStatus,
    updateUserWallet,
    updateUserData,
    getAllTransactions,
    updateTransactionStatus,
    getPlatformStats,
    getSettings,
    updateSettings,
    getSupportMessages,
    updateSupportMessageStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware to ensure user is admin (simplified for now)
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin === 1) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin only' });
    }
};

router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/status', protect, adminOnly, updateUserStatus);
router.put('/users/:id/wallet', protect, adminOnly, updateUserWallet);
router.put('/users/:id/edit', protect, adminOnly, updateUserData);
router.get('/stats', protect, adminOnly, getPlatformStats);
router.get('/transactions', protect, adminOnly, getAllTransactions);
router.put('/transactions/:id', protect, adminOnly, updateTransactionStatus);
router.get('/settings', protect, adminOnly, getSettings);
router.put('/settings', protect, adminOnly, updateSettings);
router.get('/support-messages', protect, adminOnly, getSupportMessages);
router.put('/support-messages/:id', protect, adminOnly, updateSupportMessageStatus);

module.exports = router;
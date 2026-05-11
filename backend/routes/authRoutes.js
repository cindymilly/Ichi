const express = require('express');
const router = express.Router();
const { register, login, linkWeb3Wallet, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Dành cho tất cả mọi người
router.post('/register', register);
router.post('/login', login);

// Route liên kết ví cho tài xế/merchant (Yêu cầu đã đăng nhập bằng sđt)
router.post('/link-wallet', protect, linkWeb3Wallet);

// Lấy thông tin cá nhân
router.get('/profile', protect, getProfile);

module.exports = router;

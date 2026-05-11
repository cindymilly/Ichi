const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_SECRET_KEY');
      
      req.user = await User.findById(decoded.id).select('-passwordHash');
      if (!req.user) throw new Error('User not found');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Không có quyền truy cập, thiếu token' });
  }
};

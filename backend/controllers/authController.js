const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'YOUR_SECRET_KEY', { expiresIn: '30d' });
};

// Đăng ký Web2: Tự động sinh ví Custodial Web3 cho khách ở dưới nền
exports.register = async (req, res) => {
  const { fullName, phoneNumber, passwordHash, role } = req.body;
  try {
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) return res.status(400).json({ success: false, message: 'Số điện thoại đã tồn tại' });

    // Tự động sinh ví ảo (Custodial Wallet) cho user bằng Ethers.js
    const wallet = ethers.Wallet.createRandom();

    const user = await User.create({ 
      fullName, 
      phoneNumber, 
      passwordHash,
      role: role || 'CUSTOMER',
      custodialWallet: {
        address: wallet.address,
        privateKey: wallet.privateKey // Thực tế cần mã hóa trước khi lưu vào DB
      }
    });

    res.status(201).json({ 
      success: true, 
      token: generateToken(user._id), 
      user: {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        walletAddress: user.custodialWallet.address // Trả về địa chỉ ví ảo để hiển thị cho oai
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Đăng nhập truyền thống Web2 (Nhanh gọn, không cần MetaMask)
exports.login = async (req, res) => {
  const { phoneNumber, passwordHash } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user && user.passwordHash === passwordHash) {
      res.json({ 
        success: true, 
        token: generateToken(user._id), 
        user: {
          _id: user._id,
          fullName: user.fullName,
          role: user.role,
          walletAddress: user.custodialWallet?.address,
          linkedWeb3Wallet: user.linkedWeb3Wallet
        } 
      });
    } else {
      res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Dành cho tài xế/quán ăn: Liên kết ví MetaMask cá nhân để nhận lương tức thì
exports.linkWeb3Wallet = async (req, res) => {
  const { walletAddress } = req.body;
  try {
    const user = await User.findById(req.user._id);
    
    if (user.role === 'CUSTOMER') {
      return res.status(403).json({ success: false, message: 'Khách hàng hiện tại không cần liên kết ví ngoài.' });
    }

    user.linkedWeb3Wallet = walletAddress.toLowerCase();
    await user.save();

    res.json({ success: true, message: 'Liên kết ví thành công! Bạn sẽ nhận lương trực tiếp vào ví này.', linkedWeb3Wallet: user.linkedWeb3Wallet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

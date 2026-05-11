const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Vui lòng nhập họ tên'] 
  },
  phoneNumber: { 
    type: String, 
    required: [true, 'Vui lòng nhập số điện thoại'], 
    unique: true 
  },
  passwordHash: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['CUSTOMER', 'DRIVER', 'ADMIN', 'MERCHANT'], 
    default: 'CUSTOMER' 
  },
  // Ví nội bộ tự động tạo cho Khách hàng (Web 2.5 Custodial Wallet)
  custodialWallet: {
    address: String,
    privateKey: String // Trong thực tế tế sẽ được mã hóa (encrypted) cẩn thận
  },
  // Ví MetaMask cá nhân do Tài xế tự liên kết để nhận lương ngay lập tức
  linkedWeb3Wallet: { 
    type: String,
    default: null
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'INACTIVE', 'BANNED'], 
    default: 'ACTIVE' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

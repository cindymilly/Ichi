const Order = require('../models/Order');
const axios = require('axios');

// URL của ML Service (Python Flask - port 5001)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// ─── Helper: Tính khoảng cách 2 điểm GPS (Haversine formula) ───────────────
function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Helper: Gọi ML Service để lấy ETA ─────────────────────────────────────
async function getEtaFromML(distanceKm, weather = 'sunny') {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      distance_km: distanceKm,
      weather: weather,
      hour_of_day: new Date().getHours()
    }, { timeout: 5000 }); // timeout 5 giây

    if (response.data.success) {
      return response.data.eta_minutes;
    }
  } catch (err) {
    console.warn('⚠️  [ML-Service] Không kết nối được, dùng ETA ước tính:', err.message);
  }

  // Fallback: tính thủ công nếu ML service không hoạt động
  return Math.round(distanceKm * 4 + 10);
}


// ─── POST /api/orders — Tạo đơn hàng mới ───────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body, customerId: req.user._id };

    // Tính khoảng cách giữa pickup và dropoff
    const { pickup, dropoff } = orderData;
    let distanceKm = orderData.pricing?.distanceKm;

    if (!distanceKm && pickup?.lat && dropoff?.lat) {
      distanceKm = parseFloat(
        calculateDistanceKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng).toFixed(2)
      );
    }

    // 🤖 Gọi AI để dự đoán ETA
    const etaMinutes = await getEtaFromML(distanceKm || 5, req.body.weather || 'sunny');

    // Gắn ETA và distance vào đơn hàng
    orderData.etaMinutes = etaMinutes;
    if (distanceKm) {
      orderData.pricing = {
        ...orderData.pricing,
        distanceKm
      };
    }

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      data: order,
      eta: {
        minutes: etaMinutes,
        message: `Dự kiến giao hàng trong ${etaMinutes} phút`
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// ─── POST /api/orders/guest — Tạo đơn hàng không cần Login ───────────────
exports.createGuestOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Lưu thẳng vào MongoDB theo đúng schema
    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Lưu đơn hàng vào MongoDB thành công!'
    });
  } catch (error) {
    console.error("Lỗi tạo đơn:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── GET /api/orders — Lấy danh sách đơn hàng ──────────────────────────────
exports.getOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'CUSTOMER' ? { customerId: req.user._id } :
                   req.user.role === 'DRIVER' ? { driverId: req.user._id } : {};

    const orders = await Order.find(filter).sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// ─── PUT /api/orders/:id/accept — Tài xế nhận đơn ─────────────────────────
exports.acceptOrder = async (req, res) => {
  if (req.user.role !== 'DRIVER') {
    return res.status(403).json({ success: false, message: 'Chỉ tài xế mới có thể nhận đơn' });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: 'FINDING_DRIVER' },
      { driverId: req.user._id, status: 'ACCEPTED' },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại hoặc đã có người nhận' });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// ─── PUT /api/orders/:id/status — Cập nhật trạng thái đơn hàng ─────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

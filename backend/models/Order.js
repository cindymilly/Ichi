const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  quantity: Number,
  unitPrice: Number,
  totalPrice: Number,
  specialInstructions: String
});

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true },
  customerId: { type: String }, // Tạm thời để String vì chưa có chức năng login
  restaurantId: { type: String },
  driverId: { type: String, default: null },
  status: {
    type: String,
    enum: ["DRAFT", "PENDING_PAYMENT", "FINDING_DRIVER", "DRIVER_ACCEPTED", "AT_RESTAURANT", "FOOD_READY", "PICKED_UP", "IN_TRANSIT", "ARRIVED_AT_DROPOFF", "DELIVERED", "CANCELLED", "FAILED_DELIVERY"],
    default: "FINDING_DRIVER"
  },
  orderItems: [orderItemSchema],
  locationDetails: {
    pickup: {
      address: String,
      lat: Number,
      lng: Number
    },
    dropoff: {
      address: String,
      lat: Number,
      lng: Number
    }
  },
  payment: {
    method: { type: String, enum: ["COD", "CREDIT_CARD", "MOMO", "ZALOPAY", "WEB3_CRYPTO"], default: "COD" },
    subtotal: Number,
    deliveryFee: Number,
    discount: Number,
    total: Number,
    status: { type: String, enum: ["UNPAID", "PAID", "REFUNDED"], default: "UNPAID" },
    web3TxHash: String
  },
  weatherAtDropoff: {
    condition: String,
    precipitationProbability: Number
  },
  etaDetails: {
    predictedMinutes: Number,
    mlConfidence: Number,
    distanceKm: Number,
    trafficMultiplier: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

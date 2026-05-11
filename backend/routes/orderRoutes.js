const express = require('express');
const router = express.Router();
const { createOrder, createGuestOrder, getOrders, acceptOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/guest', createGuestOrder);
router.put('/guest/:id/status', updateOrderStatus);

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.put('/:id/accept', protect, acceptOrder);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;

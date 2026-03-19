const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController');

// 1. Core Order Routes
router.post('/place', controller.placeOrder);

// 2. Admin Routes
router.get('/', controller.getOrders); // All orders
router.post('/confirm-cash', controller.confirmCashPayment); // Admin confirm cash

// 3. Kitchen Routes
router.get('/kitchen', controller.getKitchenOrders); // Only PAID orders

// 4. Razorpay Verify
router.post('/verify', controller.verifyPayment);

// 5. User History
router.get('/user/:userId', controller.getUserOrders);

// 6. Status Updates
router.put('/:id/status', controller.updateOrderStatus);

module.exports = router;

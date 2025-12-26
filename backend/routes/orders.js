const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/ordersController');

router.post('/place', placeOrder);
router.get('/view', getOrders);

module.exports = router;

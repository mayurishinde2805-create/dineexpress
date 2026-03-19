const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/sales', controller.getSalesData);
router.get('/popular', controller.getPopularItems);
router.get('/diet', controller.getDietStats);
router.get('/status', controller.getStatusStats);
router.get('/stats', controller.getDashboardStats); // New route

module.exports = router;

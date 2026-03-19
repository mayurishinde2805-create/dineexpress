const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesAnalytics, getPopularItems, getDietStats } = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/analytics/sales', getSalesAnalytics);
router.get('/analytics/popular', getPopularItems);
router.get('/analytics/diet', getDietStats);

module.exports = router;

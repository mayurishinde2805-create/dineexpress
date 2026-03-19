const express = require('express');
const router = express.Router();
const controller = require('../controllers/customersController');

router.get('/', controller.getCustomers);
router.get('/:id/history', controller.getCustomerDetails);

module.exports = router;

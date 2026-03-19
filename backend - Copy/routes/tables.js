const express = require('express');
const router = express.Router();
const controller = require('../controllers/tablesController');

router.get('/', controller.getTables);
router.post('/', controller.addTable);
router.delete('/:id', controller.deleteTable);
router.put('/:id/status', controller.updateTableStatus);
router.post('/regenerate-qr', controller.regenerateQR);

module.exports = router;

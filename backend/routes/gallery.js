const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.get('/images', galleryController.getGalleryImages);

module.exports = router;

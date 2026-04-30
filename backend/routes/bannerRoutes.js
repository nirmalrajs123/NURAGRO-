const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../middleware/upload');

router.get('/', bannerController.getBanners);
router.put('/:id', upload.any(), bannerController.updateBanner);
router.post('/', upload.any(), bannerController.createBanner);
router.delete('/:id', bannerController.deleteBanner);
module.exports = router;

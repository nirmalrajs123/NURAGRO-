const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');

router.get('/', seoController.getAllSeo);
router.get('/:id', seoController.getSeoById);
router.post('/', seoController.createSeo);
router.put('/:id', seoController.updateSeo);
router.delete('/:id', seoController.deleteSeo);

module.exports = router;

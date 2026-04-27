const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'spec_file', maxCount: 1 },
    { name: 'nutrition_file', maxCount: 1 }
]), productController.createProduct);

router.put('/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'spec_file', maxCount: 1 },
    { name: 'nutrition_file', maxCount: 1 }
]), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

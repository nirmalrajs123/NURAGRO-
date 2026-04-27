const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.post('/', upload.any(), productController.createProduct);
router.put('/:id', upload.any(), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

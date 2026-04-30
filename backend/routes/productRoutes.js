const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', upload.any(), productController.createProduct);
router.put('/:id', upload.any(), productController.updateProduct);
router.patch('/:id/special', productController.toggleSpecial);
router.patch('/:id/trending', productController.toggleTrending);
router.patch('/:id/best_seller', productController.toggleBestSeller);
router.patch('/:id/featured_products', productController.toggleFeaturedProducts);
router.patch('/:id/new_arrival_products', productController.toggleNewArrivalProducts);
router.delete('/:id', productController.deleteProduct);
router.get('/:id/seo', productController.getProductSeo);
router.put('/:id/seo', productController.updateProductSeo);

module.exports = router;

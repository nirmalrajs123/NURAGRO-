const express = require('express');
const router = express.Router();
const navbarController = require('../controllers/navbarController');

router.get('/', navbarController.getNavbars);
router.post('/', navbarController.createNavbar);
router.put('/:id', navbarController.updateNavbar);
router.delete('/:id', navbarController.deleteNavbar);

module.exports = router;

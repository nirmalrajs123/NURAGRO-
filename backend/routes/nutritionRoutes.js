const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');

router.get('/', nutritionController.getNutritions);
router.post('/', nutritionController.createNutrition);
router.put('/:id', nutritionController.updateNutrition);
router.delete('/:id', nutritionController.deleteNutrition);

module.exports = router;

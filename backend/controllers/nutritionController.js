const pool = require('../config/db');

// Get all nutrition items
exports.getNutritions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "nutrition" ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a nutrition item
exports.createNutrition = async (req, res) => {
  try {
    console.log('BACKEND: Received createNutrition payload:', req.body);
    const { nutrition_name, nutrition_parent, parent_id } = req.body;
    const result = await pool.query(
      'INSERT INTO "nutrition" (nutrition_name, nutrition_parent, parent_id) VALUES ($1, $2, $3) RETURNING *',
      [nutrition_name, nutrition_parent, parent_id ? parseInt(parent_id) : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a nutrition item
exports.updateNutrition = async (req, res) => {
  try {
    const { id } = req.params;
    const { nutrition_name, nutrition_parent, parent_id } = req.body;
    const result = await pool.query(
      'UPDATE "nutrition" SET nutrition_name = $1, nutrition_parent = $2, parent_id = $3 WHERE id = $4 RETURNING *',
      [nutrition_name, nutrition_parent, parent_id ? parseInt(parent_id) : null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Nutrition item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a nutrition item
exports.deleteNutrition = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM "nutrition" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Nutrition item not found' });
    }
    res.json({ message: 'Nutrition item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

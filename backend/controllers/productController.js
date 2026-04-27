const pool = require('../config/db');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.category_name 
      FROM "Products" p 
      LEFT JOIN "Categories" c ON p.category_id = c.id 
      WHERE p.is_delete = false 
      ORDER BY p.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const fields = [
      'name', 'description', 'category_id', 'image', 'packing', 
      'is_active', 'calories', 'total_fat', 'saturated_fat', 'cholesterol', 
      'sodium', 'potassium', 'total_carbohydrate', 'dietary_fiber', 'sugars', 'protein', 'vitamins', 'description_facts', 'weight', 'packing_details', 'packing_options', 'nutrition_file', 'type_options', 'spec_file'
    ];
    
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f] === undefined ? null : req.body[f]);

    const query = `
      INSERT INTO "Products" (${fields.map(f => `"${f}"`).join(', ')}, is_delete, "createdAt", "updatedAt") 
      VALUES (${placeholders}, false, NOW(), NOW()) 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [
      'name', 'description', 'category_id', 'image', 'packing', 
      'is_active', 'calories', 'total_fat', 'saturated_fat', 'cholesterol', 
      'sodium', 'potassium', 'total_carbohydrate', 'dietary_fiber', 'sugars', 'protein', 'vitamins', 'description_facts', 'weight', 'packing_details', 'packing_options', 'nutrition_file', 'type_options', 'spec_file'
    ];

    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f] === undefined ? null : req.body[f]);
    values.push(id);

    const query = `
      UPDATE "Products" 
      SET ${setClause}, "updatedAt" = NOW() 
      WHERE id = $${values.length} AND is_delete = false 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE "Products" SET is_delete = true, "updatedAt" = NOW() WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    
    res.json({ message: 'Product deleted (soft delete)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

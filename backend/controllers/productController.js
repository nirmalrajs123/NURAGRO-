const pool = require('../config/db');

// Get all products (with types and packing)
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.category_name,
      (SELECT json_agg(t.*) FROM "Type" t WHERE t.product_id = p.id) as type_options,
      (SELECT json_agg(pk.*) FROM "packing" pk WHERE pk.product_id = p.id) as packing_options
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
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const fields = [
      'name', 'description', 'isFeatured', 'path', 'category_id', 'health_benefits', 
      'is_active', 'nutrition_file', 'product_imag_path', 
      'specifications_image_path', 'nutrition_image_path', 'image', 'packing', 
      'calories', 'total_fat', 'saturated_fat', 'cholesterol', 'sodium', 
      'potassium', 'total_carbohydrate', 'dietary_fiber', 'sugars', 'protein', 
      'vitamins', 'description_facts', 'weight', 'packing_details', 
      'spec_file', 'facts'
    ];
    
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f] === undefined ? null : req.body[f]);

    const productQuery = `
      INSERT INTO "Products" (${fields.map(f => `"${f}"`).join(', ')}, is_delete, "createdAt", "updatedAt") 
      VALUES (${placeholders}, false, NOW(), NOW()) 
      RETURNING id
    `;

    const productResult = await client.query(productQuery, values);
    const productId = productResult.rows[0].id;

    // Handle Type Variations
    if (req.body.type_options && Array.isArray(req.body.type_options)) {
      for (const opt of req.body.type_options) {
        if (opt.name || opt.description || opt.file) {
          await client.query(
            'INSERT INTO "Type" (variation_name, description, image_path, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
            [opt.name, opt.description, opt.file, productId]
          );
        }
      }
    }

    // Handle Packing Options
    if (req.body.packing_options && Array.isArray(req.body.packing_options)) {
      for (const opt of req.body.packing_options) {
        if (opt.product || opt.packing || opt.container) {
          await client.query(
            'INSERT INTO "packing" (packing_product, packing_packing, packing_container, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
            [opt.product, opt.packing, opt.container, productId]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ id: productId, message: 'Product created successfully with variations' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.updateProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');

    const fields = [
      'name', 'description', 'isFeatured', 'path', 'category_id', 'health_benefits', 
      'is_active', 'nutrition_file', 'product_imag_path', 
      'specifications_image_path', 'nutrition_image_path', 'image', 'packing', 
      'calories', 'total_fat', 'saturated_fat', 'cholesterol', 'sodium', 
      'potassium', 'total_carbohydrate', 'dietary_fiber', 'sugars', 'protein', 
      'vitamins', 'description_facts', 'weight', 'packing_details', 
      'spec_file', 'facts'
    ];

    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
    const values = fields.map(f => req.body[f] === undefined ? null : req.body[f]);
    values.push(id);

    await client.query(`
      UPDATE "Products" 
      SET ${setClause}, "updatedAt" = NOW() 
      WHERE id = $${values.length} AND is_delete = false
    `, values);

    // Refresh Type Variations
    await client.query('DELETE FROM "Type" WHERE product_id = $1', [id]);
    if (req.body.type_options && Array.isArray(req.body.type_options)) {
      for (const opt of req.body.type_options) {
        if (opt.name || opt.description || opt.file) {
          await client.query(
            'INSERT INTO "Type" (variation_name, description, image_path, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
            [opt.name, opt.description, opt.file, id]
          );
        }
      }
    }

    // Refresh Packing Options
    await client.query('DELETE FROM "packing" WHERE product_id = $1', [id]);
    if (req.body.packing_options && Array.isArray(req.body.packing_options)) {
      for (const opt of req.body.packing_options) {
        if (opt.product || opt.packing || opt.container) {
          await client.query(
            'INSERT INTO "packing" (packing_product, packing_packing, packing_container, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
            [opt.product, opt.packing, opt.container, id]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Product updated successfully with variations' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Type and Packing will be deleted automatically due to ON DELETE CASCADE
    const result = await pool.query('UPDATE "Products" SET is_delete = true, "updatedAt" = NOW() WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    
    res.json({ message: 'Product deleted (soft delete)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

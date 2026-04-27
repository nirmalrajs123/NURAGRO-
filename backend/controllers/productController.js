const pool = require('../config/db');

// Helper to find file path by fieldname in multer's upload.any() array
const getFilePath = (files, fieldname) => {
  const file = files && files.find(f => f.fieldname === fieldname);
  return file ? `/uploads/${file.filename}` : null;
};

// Get all products (with types and packing)
exports.getProducts = async (req, res) => {
  try {
    console.log('Fetching all products from database...');
    const result = await pool.query(`
      SELECT p.*, c.category_name,
      (SELECT json_agg(t.* ORDER BY t.id ASC) FROM "Type" t WHERE t.product_id = p.id) as type_options,
      (SELECT json_agg(pk.* ORDER BY pk.id ASC) FROM "packing" pk WHERE pk.product_id = p.id) as packing_options
      FROM "Products" p 
      LEFT JOIN "Categories" c ON p.category_id = c.id 
      WHERE p.is_delete = false 
      ORDER BY p.id ASC
    `);
    console.log(`Found ${result.rows.length} products.`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let {
      name, description, isFeatured, path, category_id, health_benefits,
      is_active, calories, total_fat, saturated_fat, cholesterol, sodium,
      potassium, total_carbohydrate, dietary_fiber, sugars, protein,
      vitamins, description_facts, weight, packing_details, facts,
      type_options, packing_options
    } = req.body;

    // Standardize data types
    if (typeof type_options === 'string') type_options = JSON.parse(type_options);
    if (typeof packing_options === 'string') packing_options = JSON.parse(packing_options);
    if (category_id === 'null' || category_id === '' || isNaN(category_id)) category_id = null;

    // Extract file paths from multer req.files (upload.any())
    const image = getFilePath(req.files, 'image') || req.body.image;
    const spec_file = getFilePath(req.files, 'spec_file') || req.body.spec_file;
    const nutrition_file = getFilePath(req.files, 'nutrition_file') || req.body.nutrition_file;

    const fields = [
      'name', 'description', 'isFeatured', 'path', 'category_id', 'health_benefits',
      'is_active', 'image', 'packing', 'calories', 'total_fat', 'saturated_fat',
      'cholesterol', 'sodium', 'potassium', 'total_carbohydrate', 'dietary_fiber',
      'sugars', 'protein', 'vitamins', 'description_facts', 'weight',
      'packing_details', 'spec_file', 'nutrition_file', 'facts'
    ];

    const data = {
      name, description, isFeatured, path, category_id, health_benefits,
      is_active, image, packing: req.body.packing, calories, total_fat, saturated_fat,
      cholesterol, sodium, potassium, total_carbohydrate, dietary_fiber,
      sugars, protein, vitamins, description_facts, weight,
      packing_details, spec_file, nutrition_file, facts
    };

    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const values = fields.map(f => data[f] === undefined ? null : data[f]);

    const productQuery = `
      INSERT INTO "Products" (${fields.map(f => `"${f}"`).join(', ')}, is_delete, "createdAt", "updatedAt") 
      VALUES (${placeholders}, false, NOW(), NOW()) 
      RETURNING id
    `;

    const productResult = await client.query(productQuery, values);
    const productId = productResult.rows[0].id;

    // Handle Type Variations with Physical File Paths
    if (type_options && Array.isArray(type_options)) {
      for (let i = 0; i < type_options.length; i++) {
        const opt = type_options[i];
        let filePath = opt.file;

        if (filePath === `__TYPE_FILE_${i}__`) {
          filePath = getFilePath(req.files, `type_file_${i}`);
        }

        if (opt.name || opt.description || filePath) {
          await client.query(
            'INSERT INTO "Type" (variation_name, description, image_path, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
            [opt.name, opt.description, filePath, productId]
          );
        }
      }
    }

    // Handle Packing Options with Physical File Paths
    if (packing_options && Array.isArray(packing_options)) {
      for (let i = 0; i < packing_options.length; i++) {
        const opt = packing_options[i];
        let filePath = opt.file;

        if (filePath === `__PACKING_FILE_${i}__`) {
          filePath = getFilePath(req.files, `packing_file_${i}`);
        }

        if (opt.product || opt.packing || opt.container || filePath) {
          await client.query(
            'INSERT INTO "packing" (packing_product, packing_packing, packing_container, image_path, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
            [opt.product, opt.packing, opt.container, filePath, productId]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', err);
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

    let {
      name, description, isFeatured, path, category_id, health_benefits,
      is_active, calories, total_fat, saturated_fat, cholesterol, sodium,
      potassium, total_carbohydrate, dietary_fiber, sugars, protein,
      vitamins, description_facts, weight, packing_details, facts,
      type_options, packing_options
    } = req.body;

    if (typeof type_options === 'string') type_options = JSON.parse(type_options);
    if (typeof packing_options === 'string') packing_options = JSON.parse(packing_options);
    if (category_id === 'null' || category_id === '' || isNaN(category_id)) category_id = null;

    const image = getFilePath(req.files, 'image') || req.body.image;
    const spec_file = getFilePath(req.files, 'spec_file') || req.body.spec_file;
    const nutrition_file = getFilePath(req.files, 'nutrition_file') || req.body.nutrition_file;

    const fields = [
      'name', 'description', 'isFeatured', 'path', 'category_id', 'health_benefits',
      'is_active', 'image', 'packing', 'calories', 'total_fat', 'saturated_fat',
      'cholesterol', 'sodium', 'potassium', 'total_carbohydrate', 'dietary_fiber',
      'sugars', 'protein', 'vitamins', 'description_facts', 'weight',
      'packing_details', 'spec_file', 'nutrition_file', 'facts'
    ];

    const data = {
      name, description, isFeatured, path, category_id, health_benefits,
      is_active, image, packing: req.body.packing, calories, total_fat, saturated_fat,
      cholesterol, sodium, potassium, total_carbohydrate, dietary_fiber,
      sugars, protein, vitamins, description_facts, weight,
      packing_details, spec_file, nutrition_file, facts
    };

    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
    const values = fields.map(f => data[f] === undefined ? null : data[f]);
    values.push(id);

    await client.query(`
      UPDATE "Products" 
      SET ${setClause}, "updatedAt" = NOW() 
      WHERE id = $${values.length} AND is_delete = false
    `, values);

    // Refresh Type Variations
    await client.query('DELETE FROM "Type" WHERE product_id = $1', [id]);
    if (type_options && Array.isArray(type_options)) {
      for (let i = 0; i < type_options.length; i++) {
        const opt = type_options[i];
        let filePath = opt.file;

        if (filePath === `__TYPE_FILE_${i}__`) {
          filePath = getFilePath(req.files, `type_file_${i}`);
        }

        if (opt.name || opt.description || filePath) {
          await client.query(
            'INSERT INTO "Type" (variation_name, description, image_path, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
            [opt.name, opt.description, filePath, id]
          );
        }
      }
    }

    // Refresh Packing Options
    await client.query('DELETE FROM "packing" WHERE product_id = $1', [id]);
    if (packing_options && Array.isArray(packing_options)) {
      for (let i = 0; i < packing_options.length; i++) {
        const opt = packing_options[i];
        let filePath = opt.file;

        if (filePath === `__PACKING_FILE_${i}__`) {
          filePath = getFilePath(req.files, `packing_file_${i}`);
        }

        if (opt.product || opt.packing || opt.container || filePath) {
          await client.query(
            'INSERT INTO "packing" (packing_product, packing_packing, packing_container, image_path, product_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
            [opt.product, opt.packing, opt.container, filePath, id]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE "Products" SET is_delete = true, "updatedAt" = NOW() WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const processBase64Image = (base64String) => {
  if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image')) return base64String;
  try {
    const matches = base64String.match(/^data:image\/([A-Za-z-+\.]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const filename = `category_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
      const uploadDir = path.join(__dirname, '../uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const destPath = path.join(uploadDir, filename);
      fs.writeFileSync(destPath, buffer);
      return `/uploads/${filename}`;
    }
  } catch (err) {
    console.error('Error processing base64 image:', err);
  }
  return base64String;
};

exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Categories" WHERE is_delete = false ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_name, category_image, parent_id_cat, is_active } = req.body;
    const finalImagePath = processBase64Image(category_image);
    
    const result = await pool.query(
      'INSERT INTO "Categories" (category_name, category_image, parent_id_cat, is_active, is_delete, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, false, NOW(), NOW()) RETURNING *',
      [category_name, finalImagePath, parent_id_cat || null, is_active !== undefined ? is_active : true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, category_image, parent_id_cat, is_active } = req.body;
    const finalImagePath = processBase64Image(category_image);

    const result = await pool.query(
      'UPDATE "Categories" SET category_name = $1, category_image = $2, parent_id_cat = $3, is_active = $4, "updatedAt" = NOW() WHERE id = $5 RETURNING *',
      [category_name, finalImagePath, parent_id_cat || null, is_active !== undefined ? is_active : true, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE "Categories" SET is_delete = true, "updatedAt" = NOW() WHERE id = $1', [id]);
    res.json({ message: 'Category deleted (soft delete)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Extract file paths safely
const getFilePath = (files, fieldName) => {
  if (!files || files.length === 0) return null;
  const file = files.find(f => f.fieldname === fieldName);
  return file ? `/uploads/${file.filename}` : null;
};

exports.getBanners = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Banners" ORDER BY id ASC');
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, link } = req.body;
    
    // Handle image update
    let image = req.body.image;
    const newImage = getFilePath(req.files, 'image');
    if (newImage) image = newImage;

    const query = `
      UPDATE "Banners" 
      SET title = $1, subtitle = $2, image = $3, link = $4, "updatedAt" = NOW() 
      WHERE id = $5 
      RETURNING *
    `;
    const values = [title, subtitle, image, link, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json({ message: 'Banner updated successfully', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, type } = req.body;
    const image = getFilePath(req.files, 'image');

    const query = `
      INSERT INTO "Banners" (title, subtitle, image, link, type, "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
      RETURNING *
    `;
    const values = [title, subtitle, image, link, type || 'tall'];
    const result = await pool.query(query, values);

    res.json({ message: 'Banner created successfully', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM "Banners" WHERE id = $1', [id]);
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

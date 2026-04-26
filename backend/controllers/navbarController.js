const pool = require('../config/db');

// Get all navbar items
exports.getNavbars = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Navbars" ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a navbar item
exports.createNavbar = async (req, res) => {
  try {
    const { nav_menu_name, parent_id, is_active, path } = req.body;
    const result = await pool.query(
      'INSERT INTO "Navbars" (nav_menu_name, parent_id, is_active, path, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [nav_menu_name, parent_id, is_active, path]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a navbar item
exports.updateNavbar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nav_menu_name, parent_id, is_active, path } = req.body;
    const result = await pool.query(
      'UPDATE "Navbars" SET nav_menu_name = $1, parent_id = $2, is_active = $3, path = $4, "updatedAt" = NOW() WHERE id = $5 RETURNING *',
      [nav_menu_name, parent_id, is_active, path, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Navbar item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a navbar item
exports.deleteNavbar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM "Navbars" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Navbar item not found' });
    }
    res.json({ message: 'Navbar item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

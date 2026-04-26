const pool = require('./config/db');

async function updateCategoryTable() {
  try {
    const query = `
      ALTER TABLE "Categories" 
      ADD COLUMN IF NOT EXISTS path TEXT, 
      ADD COLUMN IF NOT EXISTS is_delete BOOLEAN DEFAULT FALSE;
    `;
    await pool.query(query);
    console.log('Categories table updated successfully (path and is_delete added).');
  } catch (err) {
    console.error('Error updating Categories table:', err);
  } finally {
    process.exit(0);
  }
}

updateCategoryTable();

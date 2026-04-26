const pool = require('./config/db');

async function addIsActiveToCategory() {
  try {
    const query = `
      ALTER TABLE "Categories" 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    `;
    await pool.query(query);
    console.log('Categories table updated successfully (is_active added).');
  } catch (err) {
    console.error('Error updating Categories table:', err);
  } finally {
    process.exit(0);
  }
}

addIsActiveToCategory();

const pool = require('./config/db');

async function createCategoryTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS "Categories" (
        id SERIAL PRIMARY KEY,
        category_name TEXT NOT NULL,
        category_image TEXT,
        parent_id_cat INTEGER,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await pool.query(query);
    console.log('Categories table created successfully or already exists.');
  } catch (err) {
    console.error('Error creating Categories table:', err);
  } finally {
    process.exit(0);
  }
}

createCategoryTable();

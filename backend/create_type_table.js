const pool = require('./config/db');

async function createTypeTable() {
  try {
    console.log('Creating "Type" table...');
    const query = `
      CREATE TABLE IF NOT EXISTS "Type" (
        id SERIAL PRIMARY KEY,
        variation_name TEXT,
        description TEXT,
        image_path TEXT,
        product_id INT REFERENCES "Products"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await pool.query(query);
    console.log('Table "Type" created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating table:', err.message);
    process.exit(1);
  }
}

createTypeTable();

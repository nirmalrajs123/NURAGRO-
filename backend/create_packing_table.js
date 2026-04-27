const pool = require('./config/db');

async function createPackingTable() {
  try {
    console.log('Creating "packing" table...');
    const query = `
      CREATE TABLE IF NOT EXISTS "packing" (
        id SERIAL PRIMARY KEY,
        packing_product TEXT,
        packing_packing TEXT,
        packing_container TEXT,
        product_id INT REFERENCES "Products"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await pool.query(query);
    console.log('Table "packing" created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating table:', err.message);
    process.exit(1);
  }
}

createPackingTable();

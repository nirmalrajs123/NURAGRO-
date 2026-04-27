const pool = require('./config/db');

async function fixPacking() {
  try {
    console.log('Adding "image_path" to "packing" table...');
    await pool.query('ALTER TABLE "packing" ADD COLUMN IF NOT EXISTS "image_path" TEXT;');
    console.log('Column added successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixPacking();

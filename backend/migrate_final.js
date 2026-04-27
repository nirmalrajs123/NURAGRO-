const pool = require('./config/db');
const fs = require('fs');

async function migrateAndCheck() {
  try {
    console.log('Adding requested columns...');
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "product_imag_path" TEXT;');
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "specifications_image_path" TEXT;');
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "nutrition_image_path" TEXT;');
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "facts" TEXT;');
    console.log('Columns added.');

    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Products' ORDER BY column_name;");
    const output = res.rows.map(r => `${r.column_name}: ${r.data_type}`).join('\n');
    fs.writeFileSync('full_schema.txt', output);
    console.log('Full schema written to full_schema.txt');
    process.exit(0);
  } catch (err) {
    console.error('Migration/Check failed:', err.message);
    process.exit(1);
  }
}

migrateAndCheck();

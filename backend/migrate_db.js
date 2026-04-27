const pool = require('./config/db');

async function migrate() {
  try {
    console.log('Starting migration...');
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "spec_file" TEXT;');
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "nutrition_file" TEXT;');
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "type_options" JSONB;');
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();

const pool = require('./config/db');

async function migrate() {
  try {
    console.log('Starting migration to TEXT types...');
    const columns = [
      'image', 'description', 'description_facts', 'spec_file', 
      'nutrition_file', 'origin', 'grade', 'packing', 'health_benefits',
      'vitamins', 'packing_details'
    ];
    
    for (const col of columns) {
      try {
        await pool.query(`ALTER TABLE "Products" ALTER COLUMN "${col}" TYPE TEXT;`);
        console.log(`Column ${col} converted to TEXT.`);
      } catch (e) {
        console.log(`Skipping ${col}: ${e.message}`);
      }
    }
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();

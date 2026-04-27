const pool = require('./config/db');

async function fixConstraints() {
  try {
    console.log('Dropping NOT NULL constraints on legacy columns...');
    const columns = ['category', 'isFeatured', 'path', 'facts'];
    
    for (const col of columns) {
      try {
        await pool.query(`ALTER TABLE "Products" ALTER COLUMN "${col}" DROP NOT NULL;`);
        console.log(`Constraint dropped for ${col}.`);
      } catch (e) {
        console.log(`Skipping ${col}: ${e.message}`);
      }
    }
    
    console.log('Cleanup completed.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err.message);
    process.exit(1);
  }
}

fixConstraints();

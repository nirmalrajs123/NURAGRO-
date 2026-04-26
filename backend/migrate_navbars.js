const pool = require('./config/db');

async function migrate() {
  try {
    await pool.query('ALTER TABLE "Navbars" ADD COLUMN path TEXT;');
    console.log('Successfully added "path" column to Navbars table.');
  } catch (err) {
    if (err.code === '42701') {
      console.log('Column "path" already exists.');
    } else {
      console.error('Error adding column:', err);
    }
  } finally {
    process.exit(0);
  }
}

migrate();

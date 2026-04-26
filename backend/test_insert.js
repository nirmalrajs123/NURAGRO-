const pool = require('./config/db');

async function testInsert() {
  try {
    const result = await pool.query(
      'INSERT INTO "Navbars" (nav_menu_name, parent_id, is_active, path, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      ['Home', null, 1, '/home']
    );
    console.log('Success:', result.rows[0]);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

testInsert();

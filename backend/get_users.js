const pool = require('./config/db');
async function test() {
  const result = await pool.query('SELECT username FROM "Users"');
  console.log("Users:", result.rows);
  process.exit(0);
}
test();

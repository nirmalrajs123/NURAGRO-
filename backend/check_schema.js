const pool = require('./config/db');
const fs = require('fs');

async function checkSchema() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Products';");
    fs.writeFileSync('schema_check.txt', res.rows.map(r => r.column_name).join('\n'));
    console.log('Schema written to schema_check.txt');
    process.exit(0);
  } catch (err) {
    fs.writeFileSync('schema_check.txt', 'ERROR: ' + err.message);
    console.error(err);
    process.exit(1);
  }
}

checkSchema();

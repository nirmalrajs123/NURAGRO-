const pool = require('./config/db');

const check = async () => {
  const result = await pool.query('SELECT id, name, focus_keyphrase, slug_text, seo_title, meta_description FROM "Products"');
  console.log(result.rows);
  process.exit(0);
}
check();

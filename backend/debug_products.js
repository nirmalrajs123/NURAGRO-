const pool = require('./config/db');

async function check() {
  try {
    console.log('--- Testing full getProducts query ---');
    const r = await pool.query(`
      SELECT p.*, c.category_name,
      (SELECT json_agg(t.*) FROM "Type" t WHERE t.product_id = p.id ORDER BY t.id ASC) as type_options,
      (SELECT json_agg(pk.*) FROM "packing" pk WHERE pk.product_id = p.id ORDER BY pk.id ASC) as packing_options
      FROM "Products" p 
      LEFT JOIN "Categories" c ON p.category_id = c.id 
      WHERE p.is_delete = false 
      ORDER BY p.id ASC
    `);
    console.log('Rows returned:', r.rows.length);
    r.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Name: ${row.name}, Category: ${row.category_name}`);
    });
  } catch(e) {
    console.error('Query FAILED:', e.message);
  }
  process.exit(0);
}
check();

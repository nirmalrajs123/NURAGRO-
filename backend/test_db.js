const pool = require('./config/db');
async function test() {
  const result = await pool.query(`
      SELECT p.*, c.category_name,
      (SELECT json_agg(t.* ORDER BY t.id ASC) FROM "Type" t WHERE t.product_id = p.id) as type_options,
      (SELECT json_agg(pk.* ORDER BY pk.id ASC) FROM "packing" pk WHERE pk.product_id = p.id) as packing_options
      FROM "Products" p 
      LEFT JOIN "Categories" c ON p.category_id = c.id 
      WHERE p.is_delete = false 
      ORDER BY p.id ASC
    `);
  console.log("DB rows length:", result.rows.length);
  console.log(result.rows);
  process.exit(0);
}
test();

const pool = require('./config/db');

async function updateProductsTable() {
  try {
    const query = `
      ALTER TABLE "Products" 
      ADD COLUMN IF NOT EXISTS path TEXT,
      ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES "Categories"(id),
      ADD COLUMN IF NOT EXISTS origin TEXT,
      ADD COLUMN IF NOT EXISTS grade TEXT,
      ADD COLUMN IF NOT EXISTS packing TEXT,
      ADD COLUMN IF NOT EXISTS health_benefits TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS is_delete BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS calories TEXT,
      ADD COLUMN IF NOT EXISTS total_fat TEXT,
      ADD COLUMN IF NOT EXISTS saturated_fat TEXT,
      ADD COLUMN IF NOT EXISTS cholesterol TEXT,
      ADD COLUMN IF NOT EXISTS sodium TEXT,
      ADD COLUMN IF NOT EXISTS potassium TEXT,
      ADD COLUMN IF NOT EXISTS total_carbohydrate TEXT,
      ADD COLUMN IF NOT EXISTS dietary_fiber TEXT,
      ADD COLUMN IF NOT EXISTS sugars TEXT,
      ADD COLUMN IF NOT EXISTS protein TEXT,
      ADD COLUMN IF NOT EXISTS vitamins TEXT;
    `;
    await pool.query(query);
    console.log('Products table updated successfully with technical and nutritional fields.');
  } catch (err) {
    console.error('Error updating Products table:', err);
  } finally {
    process.exit(0);
  }
}

updateProductsTable();

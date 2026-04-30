const pool = require('./config/db');

const addFieldsToProductNutrition = async () => {
  try {
    const queryText = `
      ALTER TABLE "product_nutrition" 
      ADD COLUMN IF NOT EXISTS display BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS "order" INT DEFAULT 0;
    `;
    await pool.query(queryText);
    console.log('Columns display and order added to product_nutrition successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating product_nutrition schema:', err);
    process.exit(1);
  }
};

addFieldsToProductNutrition();

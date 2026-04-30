const pool = require('./config/db');

const createProductNutritionTable = async () => {
  try {
    const queryText = `
      CREATE TABLE IF NOT EXISTS "product_nutrition" (
        id SERIAL PRIMARY KEY,
        product_id INT REFERENCES "Products"(id) ON DELETE CASCADE,
        nutrition_item INT REFERENCES "nutrition"(id) ON DELETE CASCADE,
        value INT,
        daily_value INT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;
    await pool.query(queryText);
    console.log('product_nutrition table created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating product_nutrition table:', err);
    process.exit(1);
  }
};

createProductNutritionTable();

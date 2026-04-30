const pool = require('./config/db');

const createNutritionTable = async () => {
  try {
    const queryText = `
      CREATE TABLE IF NOT EXISTS "nutrition" (
        id SERIAL PRIMARY KEY,
        nutrition_name TEXT,
        nutrition_parent TEXT,
        parent_id INT
      );
    `;
    await pool.query(queryText);
    console.log('Nutrition table created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating nutrition table:', err);
    process.exit(1);
  }
};

createNutritionTable();

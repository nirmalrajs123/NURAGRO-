const pool = require('./config/db');

const nutritionData = [
  { nutrition_name: 'Total Fat', nutrition_parent: 'Fats & Oils' },
  { nutrition_name: 'Saturated Fat', nutrition_parent: 'Fats & Oils' },
  { nutrition_name: 'Trans Fat', nutrition_parent: 'Fats & Oils' },
  { nutrition_name: 'Cholesterol', nutrition_parent: 'Fats & Oils' },
  { nutrition_name: 'Sodium', nutrition_parent: 'Minerals' },
  { nutrition_name: 'Total Carbohydrates', nutrition_parent: 'Energy & Carbs' },
  { nutrition_name: 'Dietary Fiber', nutrition_parent: 'Fiber' },
  { nutrition_name: 'Total Sugars', nutrition_parent: 'Energy & Carbs' },
  { nutrition_name: 'Protein', nutrition_parent: 'Proteins' },
  { nutrition_name: 'Vitamin D', nutrition_parent: 'Vitamins' },
  { nutrition_name: 'Calcium', nutrition_parent: 'Minerals' },
  { nutrition_name: 'Iron', nutrition_parent: 'Minerals' },
  { nutrition_name: 'Potassium', nutrition_parent: 'Minerals' },
  { nutrition_name: 'Vitamin C', nutrition_parent: 'Vitamins' },
  { nutrition_name: 'Vitamin A', nutrition_parent: 'Vitamins' }
];

const seedNutrition = async () => {
  try {
    for (const item of nutritionData) {
      await pool.query(
        'INSERT INTO "nutrition" (nutrition_name, nutrition_parent) VALUES ($1, $2)',
        [item.nutrition_name, item.nutrition_parent]
      );
    }
    console.log('Nutrition table seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding nutrition table:', err);
    process.exit(1);
  }
};

seedNutrition();

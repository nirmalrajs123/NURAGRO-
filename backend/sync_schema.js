const pool = require('./config/db');

async function fixSchema() {
  try {
    console.log('Synchronizing database schema with controller...');
    const columns = [
      ['image', 'TEXT'],
      ['packing', 'TEXT'],
      ['calories', 'TEXT'],
      ['total_fat', 'TEXT'],
      ['saturated_fat', 'TEXT'],
      ['cholesterol', 'TEXT'],
      ['sodium', 'TEXT'],
      ['potassium', 'TEXT'],
      ['total_carbohydrate', 'TEXT'],
      ['dietary_fiber', 'TEXT'],
      ['sugars', 'TEXT'],
      ['protein', 'TEXT'],
      ['vitamins', 'TEXT'],
      ['description_facts', 'TEXT'],
      ['weight', 'TEXT'],
      ['packing_details', 'TEXT'],
      ['packing_options', 'JSONB'],
      ['spec_file', 'TEXT'],
      ['product_imag_path', 'TEXT'],
      ['specifications_image_path', 'TEXT'],
      ['nutrition_image_path', 'TEXT'],
      ['facts', 'TEXT']
    ];

    for (const [name, type] of columns) {
      try {
        await pool.query(`ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "${name}" ${type};`);
        console.log(`Column "${name}" ensured.`);
      } catch (e) {
        console.log(`Error adding column "${name}": ${e.message}`);
      }
    }

    console.log('Schema synchronization complete.');
    process.exit(0);
  } catch (err) {
    console.error('Schema fix failed:', err.message);
    process.exit(1);
  }
}

fixSchema();

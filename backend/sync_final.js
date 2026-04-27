const pool = require('./config/db');

async function sync() {
  try {
    const columns = [
      ['calories', 'TEXT'], ['total_fat', 'TEXT'], ['saturated_fat', 'TEXT'],
      ['cholesterol', 'TEXT'], ['sodium', 'TEXT'], ['potassium', 'TEXT'],
      ['total_carbohydrate', 'TEXT'], ['dietary_fiber', 'TEXT'], ['sugars', 'TEXT'],
      ['protein', 'TEXT'], ['vitamins', 'TEXT'], ['description_facts', 'TEXT'],
      ['weight', 'TEXT'], ['packing_details', 'TEXT'], ['packing_options', 'JSONB'],
      ['spec_file', 'TEXT'], ['facts', 'TEXT'], ['image', 'TEXT'], ['packing', 'TEXT']
    ];

    console.log('Starting explicit column synchronization...');
    for (const [name, type] of columns) {
      try {
        await pool.query(`ALTER TABLE public."Products" ADD COLUMN IF NOT EXISTS "${name}" ${type};`);
        console.log(`+ Column "${name}" (${type}) exists/added.`);
      } catch (err) {
        console.error(`! Error on "${name}":`, err.message);
      }
    }
    console.log('Synchronization finished.');
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
}

sync();

const pool = require('./config/db');
const fs = require('fs');

async function analyze() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'Products'
      ORDER BY ordinal_position;
    `);
    
    const analysis = res.rows.map(r => 
      `${r.column_name}: ${r.data_type}${r.character_maximum_length ? `(${r.character_maximum_length})` : ''} [Nullable: ${r.is_nullable}]`
    ).join('\n');
    
    fs.writeFileSync('db_analysis.txt', analysis);
    console.log('Detailed analysis written to db_analysis.txt');
    
    // Also log the fields that SHOULD be in the controller
    const controllerFields = res.rows.map(r => r.column_name).filter(c => !['id', 'createdAt', 'updatedAt', 'is_delete'].includes(c));
    fs.appendFileSync('db_analysis.txt', '\n\nSUGGESTED CONTROLLER FIELDS:\n' + JSON.stringify(controllerFields, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

analyze();

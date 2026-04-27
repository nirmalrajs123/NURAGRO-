const pool = require('./config/db');

async function checkSchema() {
    try {
        console.log('--- Database Column Check ---');
        
        // 1. Check table names
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name ILIKE 'products'
        `);
        console.log('Tables found:', tables.rows.map(r => r.table_name));

        if (tables.rows.length === 0) {
            console.log('No products table found in public schema.');
            return;
        }

        const tableName = tables.rows[0].table_name;

        // 2. Check columns
        const columns = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = $1
        `, [tableName]);
        
        console.log(`Columns in "${tableName}":`, columns.rows.map(r => r.column_name));

        // 3. Try to add "path" if missing
        if (!columns.rows.some(r => r.column_name === 'path')) {
            console.log('Adding "path" column...');
            await pool.query(`ALTER TABLE "public"."${tableName}" ADD COLUMN "path" TEXT`);
            console.log('Column "path" added successfully.');
        } else {
            console.log('Column "path" already exists.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error checking/updating schema:', err);
        process.exit(1);
    }
}

checkSchema();

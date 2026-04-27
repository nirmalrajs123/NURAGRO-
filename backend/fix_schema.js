const pool = require('./config/db');

async function fixSchema() {
    try {
        console.log('Synchronizing Products table schema with controller requirements...');
        
        const requiredColumns = [
            { name: 'path', type: 'TEXT' },
            { name: 'health_benefits', type: 'TEXT' },
            { name: 'packing', type: 'TEXT' },
            { name: 'calories', type: 'TEXT' },
            { name: 'total_fat', type: 'TEXT' },
            { name: 'saturated_fat', type: 'TEXT' },
            { name: 'cholesterol', type: 'TEXT' },
            { name: 'sodium', type: 'TEXT' },
            { name: 'potassium', type: 'TEXT' },
            { name: 'total_carbohydrate', type: 'TEXT' },
            { name: 'dietary_fiber', type: 'TEXT' },
            { name: 'sugars', type: 'TEXT' },
            { name: 'protein', type: 'TEXT' },
            { name: 'vitamins', type: 'TEXT' },
            { name: 'description_facts', type: 'TEXT' },
            { name: 'weight', type: 'TEXT' },
            { name: 'packing_details', type: 'TEXT' },
            { name: 'spec_file', type: 'TEXT' },
            { name: 'nutrition_file', type: 'TEXT' },
            { name: 'facts', type: 'TEXT' }
        ];

        for (const col of requiredColumns) {
            await pool.query(`
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Products' AND column_name='${col.name}') THEN
                        ALTER TABLE "Products" ADD COLUMN "${col.name}" ${col.type};
                        RAISE NOTICE 'Added column: %', '${col.name}';
                    END IF;
                END $$;
            `);
        }

        console.log('Schema synchronization completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error synchronizing schema:', err);
        process.exit(1);
    }
}

fixSchema();

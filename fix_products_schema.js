const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function fixSchema() {
    try {
        console.log('Checking for missing columns in "Products" table...');
        
        await pool.query(`
            DO $$ 
            BEGIN 
                -- Add "path"
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Products' AND column_name='path') THEN
                    ALTER TABLE "Products" ADD COLUMN "path" TEXT;
                    RAISE NOTICE 'Added "path" column';
                END IF;
                
                -- Add "spec_file"
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Products' AND column_name='spec_file') THEN
                    ALTER TABLE "Products" ADD COLUMN "spec_file" TEXT;
                    RAISE NOTICE 'Added "spec_file" column';
                END IF;

                -- Add "nutrition_file"
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Products' AND column_name='nutrition_file') THEN
                    ALTER TABLE "Products" ADD COLUMN "nutrition_file" TEXT;
                    RAISE NOTICE 'Added "nutrition_file" column';
                END IF;

                -- Add "facts"
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Products' AND column_name='facts') THEN
                    ALTER TABLE "Products" ADD COLUMN "facts" TEXT;
                    RAISE NOTICE 'Added "facts" column';
                END IF;
            END $$;
        `);

        console.log('Schema update completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error updating schema:', err);
        process.exit(1);
    }
}

fixSchema();

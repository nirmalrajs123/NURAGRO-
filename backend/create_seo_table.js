const pool = require('./config/db');

const createSeoTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS seo (
                id SERIAL PRIMARY KEY,
                focus_keyphrase TEXT,
                slug_text TEXT,
                seo_title TEXT,
                meta_description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("seo table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating seo table:", err);
        process.exit(1);
    }
};

createSeoTable();

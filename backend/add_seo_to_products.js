const pool = require('./config/db');

const addSeoFields = async () => {
    try {
        await pool.query(`
            ALTER TABLE "Products" 
            ADD COLUMN IF NOT EXISTS focus_keyphrase TEXT,
            ADD COLUMN IF NOT EXISTS slug_text TEXT,
            ADD COLUMN IF NOT EXISTS seo_title TEXT,
            ADD COLUMN IF NOT EXISTS meta_description TEXT;
        `);
        console.log("SEO fields added to products table successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error adding SEO fields to products table:", err);
        process.exit(1);
    }
};

addSeoFields();

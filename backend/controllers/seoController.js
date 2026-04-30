const pool = require('../config/db');

exports.getAllSeo = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM seo ORDER BY id ASC');
        res.json({ data: result.rows });
    } catch (err) {
        console.error('Error fetching SEO entries', err);
        res.status(500).json({ message: 'Error fetching SEO entries' });
    }
};

exports.getSeoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM seo WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'SEO entry not found' });
        res.json({ data: result.rows[0] });
    } catch (err) {
        console.error('Error fetching SEO entry', err);
        res.status(500).json({ message: 'Error fetching SEO entry' });
    }
};

exports.createSeo = async (req, res) => {
    try {
        const { focus_keyphrase, slug_text, seo_title, meta_description } = req.body;
        const result = await pool.query(
            'INSERT INTO seo (focus_keyphrase, slug_text, seo_title, meta_description) VALUES ($1, $2, $3, $4) RETURNING *',
            [focus_keyphrase, slug_text, seo_title, meta_description]
        );
        res.status(201).json({ data: result.rows[0], message: 'SEO entry created successfully' });
    } catch (err) {
        console.error('Error creating SEO entry', err);
        res.status(500).json({ message: 'Error creating SEO entry' });
    }
};

exports.updateSeo = async (req, res) => {
    try {
        const { id } = req.params;
        const { focus_keyphrase, slug_text, seo_title, meta_description } = req.body;
        const result = await pool.query(
            'UPDATE seo SET focus_keyphrase = $1, slug_text = $2, seo_title = $3, meta_description = $4 WHERE id = $5 RETURNING *',
            [focus_keyphrase, slug_text, seo_title, meta_description, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'SEO entry not found' });
        res.json({ data: result.rows[0], message: 'SEO entry updated successfully' });
    } catch (err) {
        console.error('Error updating SEO entry', err);
        res.status(500).json({ message: 'Error updating SEO entry' });
    }
};

exports.deleteSeo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM seo WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'SEO entry not found' });
        res.json({ message: 'SEO entry deleted successfully' });
    } catch (err) {
        console.error('Error deleting SEO entry', err);
        res.status(500).json({ message: 'Error deleting SEO entry' });
    }
};

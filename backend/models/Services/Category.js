const pool = require('../../config/db');

const Category = {
  create: async ({ language, name, slug, image, icon, description, status, featured }) => {
    const [result] = await pool.query(
      `INSERT INTO categories (language, name, slug, image, icon, description, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        language, name, slug,
        image ?? null, icon ?? null, description ?? null,
        status ?? 'active', featured ? 1 : 0
      ]
    );
    return Category.findById(result.insertId);
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findBySlug: async (slug) => {
    const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
    return rows;
  },

  update: async (id, fields) => {
    const keys = Object.keys(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = Object.values(fields);
    await pool.query(`UPDATE categories SET ${setClause} WHERE id = ?`, [...values, id]);
    return Category.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Category;
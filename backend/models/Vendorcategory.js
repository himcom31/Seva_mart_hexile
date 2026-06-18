const pool = require('../config/db');

const VendorCategory = {

  create: async (data) => {
    const { name, slug, description, icon } = data;
    const [result] = await pool.query(
      `INSERT INTO vendor_categories (name, slug, description, icon)
       VALUES (?, ?, ?, ?)`,
      [name, slug, description || null, icon || null]
    );
    return { id: result.insertId, name, slug, description, icon, is_active: 1 };
  },

  getAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM vendor_categories ORDER BY created_at DESC`);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM vendor_categories WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  getBySlug: async (slug) => {
    const [rows] = await pool.query(`SELECT * FROM vendor_categories WHERE slug = ?`, [slug]);
    return rows[0] || null;
  },

  update: async (id, data) => {
    const { name, slug, description, icon, is_active } = data;
    const [result] = await pool.query(
      `UPDATE vendor_categories
       SET name = ?, slug = ?, description = ?, icon = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, slug, description || null, icon || null, is_active ?? 1, id]
    );
    return result;
  },

  softDelete: async (id) => {
    const [result] = await pool.query(
      `UPDATE vendor_categories SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query(`DELETE FROM vendor_categories WHERE id = ?`, [id]);
    return result;
  },

};

module.exports = VendorCategory;
const pool = require('../../config/db');

const Service = {

  create: async ({ name, category_id, code, slug, image, icon, description, status, verify_status, featured }) => {
    const [result] = await pool.query(
      `INSERT INTO services
        (name, category_id, code, slug, image, icon, description, status, verify_status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, category_id, code, slug,
        image         ?? null,
        icon          ?? null,
        description   ?? null,
        status        ?? 'active',
        verify_status ?? 'pending',
        featured ? 1 : 0
      ]
    );
    return Service.findById(result.insertId);
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT s.*, c.name AS category_name
      FROM   services s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE  s.id = ?
    `, [id]);
    return rows[0] || null;
  },

  findByCode: async (code) => {
    const [rows] = await pool.query('SELECT * FROM services WHERE code = ?', [code]);
    return rows[0] || null;
  },

  findBySlug: async (slug) => {
    const [rows] = await pool.query('SELECT * FROM services WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT s.*, c.name AS category_name
      FROM   services s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER  BY s.created_at DESC
    `);
    return rows;
  },

  findByCategoryId: async (category_id) => {
    const [rows] = await pool.query(`
      SELECT s.*, c.name AS category_name
      FROM   services s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE  s.category_id = ?
      ORDER  BY s.created_at DESC
    `, [category_id]);
    return rows;
  },

  // Auto-generate code like PROD001, ELP002
  generateCode: async (prefix = 'PROD') => {
    const [rows] = await pool.query(
      `SELECT code FROM services WHERE code LIKE ? ORDER BY id DESC LIMIT 1`,
      [`${prefix}%`]
    );
    const last = rows[0];
    if (!last) return `${prefix}001`;
    const num = parseInt(last.code.replace(prefix, ''), 10) + 1;
    return `${prefix}${String(num).padStart(3, '0')}`;
  },

  update: async (id, fields) => {
    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE services SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
    return Service.findById(id);
  },

  updateStatus: async (id, status) => {
    await pool.query('UPDATE services SET status = ? WHERE id = ?', [status, id]);
    return Service.findById(id);
  },

  updateVerifyStatus: async (id, verify_status) => {
    await pool.query('UPDATE services SET verify_status = ? WHERE id = ?', [verify_status, id]);
    return Service.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [id]);
    return result;
  },
};

module.exports = Service;
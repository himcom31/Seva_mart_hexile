const pool = require('../../config/db');

const SubService = {
  create: async ({ service_id, name, slug, image, icon, description, price, status, featured }) => {
    const [result] = await pool.query(
      `INSERT INTO sub_services (service_id, name, slug, image, icon, description, price, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        service_id, name, slug,
        image       ?? null,
        icon        ?? null,
        description ?? null,
        price       ?? null,
        status      ?? 'active',
        featured ? 1 : 0
      ]
    );
    return SubService.findById(result.insertId);
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT ss.*, s.name AS service_name, c.name AS category_name
      FROM sub_services ss
      LEFT JOIN services  s ON ss.service_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE ss.id = ?
    `, [id]);
    return rows[0] || null;
  },

  findBySlug: async (slug) => {
    const [rows] = await pool.query('SELECT * FROM sub_services WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT ss.*, s.name AS service_name, c.name AS category_name
      FROM sub_services ss
      LEFT JOIN services  s ON ss.service_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY ss.created_at DESC
    `);
    return rows;
  },

  findByServiceId: async (service_id) => {
    const [rows] = await pool.query(`
      SELECT ss.*, s.name AS service_name, c.name AS category_name
      FROM sub_services ss
      LEFT JOIN services  s ON ss.service_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE ss.service_id = ?
      ORDER BY ss.created_at DESC
    `, [service_id]);
    return rows;
  },

  findByCategoryId: async (category_id) => {
    const [rows] = await pool.query(`
      SELECT ss.*, s.name AS service_name, c.name AS category_name
      FROM sub_services ss
      LEFT JOIN services  s ON ss.service_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.category_id = ?
      ORDER BY ss.created_at DESC
    `, [category_id]);
    return rows;
  },

  update: async (id, fields) => {
    const keys      = Object.keys(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE sub_services SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
    return SubService.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM sub_services WHERE id = ?', [id]);
    return result;
  },
};

module.exports = SubService;
const pool = require('../config/db');

const Admin = {
  findOne: async ({ email, role } = {}) => {
    let query = 'SELECT * FROM admins WHERE 1=1';
    const params = [];

    if (email !== undefined) { query += ' AND email = ?'; params.push(email); }
    if (role  !== undefined) { query += ' AND role = ?';  params.push(role);  }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, mobile FROM admins WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  create: async ({ name, email, password, role = 'admin', mobile }) => {
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password, role, mobile) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role, mobile ?? null]
    );
    return { id: result.insertId, name, email, role, mobile };
  }
};

module.exports = Admin;
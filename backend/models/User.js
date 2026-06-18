const pool = require('../config/db');

const User = {
  create: async ({ full_name, mobile, email, address, landmark, city, profile_photo }) => {
    const [result] = await pool.query(
      `INSERT INTO users (full_name, mobile, email, address, landmark, city, profile_photo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name, mobile, email ?? null, address ?? null,
        landmark ?? null, city ?? null, profile_photo ?? null
      ]
    );
    return User.findById(result.insertId);
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByMobile: async (mobile) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
    return rows[0] || null;
  },

  findOrCreate: async ({ full_name, mobile, email, address, landmark, city }) => {
    const existing = await User.findByMobile(mobile);
    if (existing) {
      // Update details on each booking
      await pool.query(
        `UPDATE users SET full_name=?, email=?, address=?, landmark=?, city=?
         WHERE id=?`,
        [
          full_name, email ?? existing.email, address ?? existing.address,
          landmark ?? existing.landmark, city ?? existing.city, existing.id
        ]
      );
      return User.findById(existing.id);
    }
    return User.create({ full_name, mobile, email, address, landmark, city });
  },

  findAll: async ({ is_active, is_blocked, city } = {}) => {
    let q = 'SELECT * FROM users WHERE 1=1';
    const params = [];
    if (is_active  !== undefined) { q += ' AND is_active = ?';  params.push(is_active); }
    if (is_blocked !== undefined) { q += ' AND is_blocked = ?'; params.push(is_blocked); }
    if (city)                     { q += ' AND city = ?';       params.push(city); }
    q += ' ORDER BY registered_at DESC';
    const [rows] = await pool.query(q, params);
    return rows;
  },

  update: async (id, fields) => {
    const keys = Object.keys(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
    return User.findById(id);
  },

  toggleBlock: async (id) => {
    const user = await User.findById(id);
    if (!user) return null;
    await pool.query('UPDATE users SET is_blocked = ? WHERE id = ?', [user.is_blocked ? 0 : 1, id]);
    return User.findById(id);
  },

  incrementBookingCount: async (id) => {
    await pool.query(
      `UPDATE users SET total_bookings = total_bookings + 1,
       last_booking_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
  },

  updateBookingStats: async (id, type) => {
    // type = 'completed' | 'cancelled'
    if (type === 'completed') {
      await pool.query('UPDATE users SET completed_bookings = completed_bookings + 1 WHERE id = ?', [id]);
    } else if (type === 'cancelled') {
      await pool.query('UPDATE users SET cancelled_bookings = cancelled_bookings + 1 WHERE id = ?', [id]);
    }
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

module.exports = User;
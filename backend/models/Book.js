const pool = require('../config/db');

// ── Auto-generate booking number like BK-20240530-0001 ───────────────────────
const generateBookingNumber = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const [rows] = await pool.query(
    `SELECT booking_number FROM bookings WHERE booking_number LIKE ? ORDER BY id DESC LIMIT 1`,
    [`BK-${today}-%`]
  );
  const last = rows[0];
  if (!last) return `BK-${today}-0001`;
  const seq = parseInt(last.booking_number.split('-')[2]) + 1;
  return `BK-${today}-${String(seq).padStart(4, '0')}`;
};

const Booking = {
  create: async ({
    service_id, service_name, category_name, service_code,
    full_name, mobile, address, landmark, city,
    preferred_date, preferred_time, notes,
    selected_sub_services
  }) => {
    const booking_number = await generateBookingNumber();
    const [result] = await pool.query(
      `INSERT INTO bookings
        (booking_number, service_id, service_name, category_name, service_code,
         full_name, mobile, address, landmark, city,
         preferred_date, preferred_time, notes, status, selected_sub_services)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        booking_number, service_id, service_name, category_name ?? null,
        service_code ?? null, full_name, mobile, address,
        landmark ?? null, city ?? 'Patna', preferred_date, preferred_time,
        notes ?? null,
        selected_sub_services ?? null
      ]
    );
    return Booking.findById(result.insertId);
  },

  // ── Look up all bookings for a customer by their mobile number ──────────
  findByMobile: async (mobile) => {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE mobile = ? ORDER BY created_at DESC', [mobile]
    );
    return rows;
  },

  findByVendorId: async (vendor_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE vendor_id = ? ORDER BY created_at DESC', [vendor_id]
    );
    return rows;
  },

  // ── Look up bookings for a customer by their users.id ──────────────────────
  // bookings table doesn't store user_id directly, only mobile — so we
  // resolve the user's mobile first, then look up bookings by that mobile.
  findByUser: async (user_id) => {
    const [userRows] = await pool.query('SELECT mobile FROM users WHERE id = ?', [user_id]);
    const user = userRows[0];
    if (!user) return [];
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE mobile = ? ORDER BY created_at DESC', [user.mobile]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByBookingNumber: async (booking_number) => {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE booking_number = ?', [booking_number]
    );
    return rows[0] || null;
  },

  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    return rows;
  },

  findByServiceId: async (service_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE service_id = ? ORDER BY created_at DESC', [service_id]
    );
    return rows;
  },

  findByStatus: async (status) => {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC', [status]
    );
    return rows;
  },

  updateStatus: async (id, status) => {
    await pool.query(
      `UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
    return Booking.findById(id);
  },

  update: async (id, fields) => {
    const keys      = Object.keys(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(
      `UPDATE bookings SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...Object.values(fields), id]
    );
    return Booking.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    return result;
  },

  getStats: async () => {
    const [[{ total }]]     = await pool.query('SELECT COUNT(*) as total FROM bookings');
    const [[{ pending }]]   = await pool.query("SELECT COUNT(*) as pending FROM bookings WHERE status = 'pending'");
    const [[{ confirmed }]] = await pool.query("SELECT COUNT(*) as confirmed FROM bookings WHERE status = 'confirmed'");
    const [[{ completed }]] = await pool.query("SELECT COUNT(*) as completed FROM bookings WHERE status = 'completed'");
    const [[{ cancelled }]] = await pool.query("SELECT COUNT(*) as cancelled FROM bookings WHERE status = 'cancelled'");
    return { total, pending, confirmed, completed, cancelled };
  }
};

module.exports = Booking;
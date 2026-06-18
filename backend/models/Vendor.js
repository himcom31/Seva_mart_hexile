// models/Vendor.js
const pool   = require('../config/db');
const bcrypt = require('bcryptjs');

const Vendor = {

  // ── Auth helpers ────────────────────────────────────────────────────────────

  hashPassword: (plain) => bcrypt.hashSync(plain, 10),

  checkPassword: (plain, hash) => bcrypt.compareSync(plain, hash),

  // Strip password before returning to client
  _safe: (vendor) => {
    if (!vendor) return null;
    const { password, ...safe } = vendor;
    return safe;
  },

  // ── CRUD ────────────────────────────────────────────────────────────────────

  create: async ({ name, mobile, aadhaar, email, password,
             experience, category_id, subcategory_id,
             city, address, profile_photo, aadhaar_front,
             aadhaar_back, certificate, vendor_type, notes }) => {

    const hashed = password ? Vendor.hashPassword(password) : null;

    const [result] = await pool.query(
      `INSERT INTO vendors
        (name, mobile, aadhaar, email, password, experience, category_id,
         subcategory_id, city, address, profile_photo, aadhaar_front,
         aadhaar_back, certificate, vendor_type, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, mobile, aadhaar, email ?? null, hashed,
        experience ?? 0, category_id ?? null, subcategory_id ?? null,
        city, address ?? null, profile_photo ?? null,
        aadhaar_front ?? null, aadhaar_back ?? null, certificate ?? null,
        vendor_type ?? 'individual', notes ?? null
      ]
    );

    const raw = await Vendor.findByIdRaw(result.insertId);
    return Vendor._safe(raw);
  },

  // Returns row WITH password (for auth checks only — never send to client)
  findByIdRaw: async (id) => {
    const [rows] = await pool.query(`
      SELECT v.*, c.name as category_name
      FROM vendors v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.id = ?
    `, [id]);
    return rows[0] || null;
  },

  findById: async (id) => Vendor._safe(await Vendor.findByIdRaw(id)),

  findByMobileRaw: async (mobile) => {
    const [rows] = await pool.query('SELECT * FROM vendors WHERE mobile = ?', [mobile]);
    return rows[0] || null;
  },

  findByEmailRaw: async (email) => {
    const [rows] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);
    return rows[0] || null;
  },

  findByAadhaar: async (aadhaar) => {
    const [rows] = await pool.query('SELECT * FROM vendors WHERE aadhaar = ?', [aadhaar]);
    return rows[0] || null;
  },

  findByMobile: async (mobile) => Vendor._safe(await Vendor.findByMobileRaw(mobile)),
  findByEmail:  async (email)  => Vendor._safe(await Vendor.findByEmailRaw(email)),

  findAll: async ({ status, city, category_id, verify_status } = {}) => {
    let q = `SELECT v.id, v.name, v.mobile, v.email, v.experience, v.aadhaar,
                    v.category_id, v.subcategory_id, v.city, v.address,
                    v.profile_photo, v.status, v.verify_status, v.is_available,
                    v.vendor_type, v.rating, v.total_jobs, v.completed_jobs,
                    v.cancelled_jobs, v.avg_response_time, v.notes,
                    v.registered_at, c.name as category_name
             FROM vendors v
             LEFT JOIN categories c ON v.category_id = c.id
             WHERE 1=1`;
    const params = [];
    if (status)        { q += ' AND v.status = ?';        params.push(status); }
    if (city)          { q += ' AND v.city = ?';          params.push(city); }
    if (category_id)   { q += ' AND v.category_id = ?';   params.push(category_id); }
    if (verify_status) { q += ' AND v.verify_status = ?'; params.push(verify_status); }
    q += ' ORDER BY v.registered_at DESC';
    const [rows] = await pool.query(q, params);   // password never selected
    return rows;
  },

  update: async (id, fields) => {
    // Never allow direct password update via this method
    const { password, ...rest } = fields;
    if (!Object.keys(rest).length) return Vendor.findById(id);
    const setClause = Object.keys(rest).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE vendors SET ${setClause} WHERE id = ?`, [...Object.values(rest), id]);
    return Vendor.findById(id);
  },

  // Dedicated safe password change
  updatePassword: async (id, newPlain) => {
    const hashed = Vendor.hashPassword(newPlain);
    await pool.query('UPDATE vendors SET password = ? WHERE id = ?', [hashed, id]);
  },

  updateStatus: async (id, status) => {
    await pool.query('UPDATE vendors SET status = ? WHERE id = ?', [status, id]);
    return Vendor.findById(id);
  },

  updateVerifyStatus: async (id, verify_status) => {
    await pool.query('UPDATE vendors SET verify_status = ? WHERE id = ?', [verify_status, id]);
    return Vendor.findById(id);
  },

  toggleAvailability: async (id) => {
    const vendor = await Vendor.findByIdRaw(id);
    if (!vendor) return null;
    const newVal = vendor.is_available ? 0 : 1;
    await pool.query('UPDATE vendors SET is_available = ? WHERE id = ?', [newVal, id]);
    return Vendor.findById(id);
  },

  updateStats: async (id, { completed_jobs, cancelled_jobs, rating }) => {
    const v = await Vendor.findByIdRaw(id);
    if (!v) return null;
    const newCompleted = (v.completed_jobs || 0) + (completed_jobs || 0);
    const newCancelled = (v.cancelled_jobs || 0) + (cancelled_jobs || 0);
    const newTotalJobs = newCompleted + newCancelled;
    const newRating    = rating !== undefined ? rating : v.rating;
    await pool.query(
      `UPDATE vendors SET completed_jobs=?, cancelled_jobs=?, total_jobs=?, rating=? WHERE id=?`,
      [newCompleted, newCancelled, newTotalJobs, newRating, id]
    );
    return Vendor.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM vendors WHERE id = ?', [id]);
    return result;
  },

  // ── Vendor Services (many-to-many) ──────────────────────────────────────────

  addService: async (vendor_id, service_id) => {
    try {
      await pool.query(
        'INSERT INTO vendor_services (vendor_id, service_id) VALUES (?, ?)',
        [vendor_id, service_id]
      );
      return { success: true };
    } catch {
      return { success: false, message: 'Service already assigned' };
    }
  },

  removeService: async (vendor_id, service_id) => {
    await pool.query(
      'DELETE FROM vendor_services WHERE vendor_id = ? AND service_id = ?',
      [vendor_id, service_id]
    );
  },

  getServices: async (vendor_id) => {
    const [rows] = await pool.query(`
      SELECT s.id, s.name, s.code, c.name as category_name
      FROM vendor_services vs
      JOIN services s ON vs.service_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE vs.vendor_id = ?
    `, [vendor_id]);
    return rows;
  },

  // Vendor Category Map (many-to-many)
  setVendorCategories: async (vendor_id, category_ids = []) => {
    await pool.query('DELETE FROM vendor_category_map WHERE vendor_id = ?', [vendor_id]);
    for (const cid of category_ids) {
      await pool.query(
        'INSERT IGNORE INTO vendor_category_map (vendor_id, vendor_category_id) VALUES (?, ?)',
        [vendor_id, cid]
      );
    }
  },

  getVendorCategories: async (vendor_id) => {
    const [rows] = await pool.query(`
      SELECT vc.id, vc.name, vc.slug
      FROM vendor_category_map vcm
      JOIN vendor_categories vc ON vcm.vendor_category_id = vc.id
      WHERE vcm.vendor_id = ?
    `, [vendor_id]);
    return rows;
  },

  // ── Attendance ───────────────────────────────────────────────────────────────

  markAttendance: async (vendor_id, date, status, note) => {
    await pool.query(
      `INSERT INTO vendor_attendance (vendor_id, date, status, note)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status), note = VALUES(note)`,
      [vendor_id, date, status ?? 'present', note ?? null]
    );
    const [rows] = await pool.query(
      'SELECT * FROM vendor_attendance WHERE vendor_id = ? AND date = ?',
      [vendor_id, date]
    );
    return rows[0];
  },

  getAttendance: async (vendor_id, month) => {
    let q = 'SELECT * FROM vendor_attendance WHERE vendor_id = ?';
    const params = [vendor_id];
    if (month) { q += ' AND date LIKE ?'; params.push(`${month}%`); }
    const [rows] = await pool.query(q, params);
    return rows;
  },
};

module.exports = Vendor;
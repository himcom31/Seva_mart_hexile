// routes/bookingRoutes.js
const express = require('express');
const router  = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware.js');
const {
  createBooking,
  getAllBookings,
  getBookingStats,
  getBookingById,
  getBookingsByService,
  getBookingsByMobile,   // ← NEW
  updateBookingStatus,
  updateBooking,
  assignVendor,
  deleteBooking,
  getMyBookings,
} = require('../Controllers/BookController.js');
const { protectVendor } = require('../middleware/Vendorauthmiddleware.js');


// ── Public ────────────────────────────────────────────────────────────────────
router.post('/',                        createBooking);
router.get('/customer/:mobile',         getBookingsByMobile);   // ← NEW — mobile lookup
router.get('/my',                       protectVendor, getMyBookings);

// ── Admin only ────────────────────────────────────────────────────────────────
router.get('/stats',                    protect, isAdmin, getBookingStats);
router.get('/',                         protect, isAdmin, getAllBookings);
router.get('/service/:service_id',      protect, isAdmin, getBookingsByService);
router.get('/:id',                      protect, isAdmin, getBookingById);
router.put('/:id',                      protect, isAdmin, updateBooking);
router.patch('/:id/status',             protect, isAdmin, updateBookingStatus);
router.patch('/:id/assign-vendor',      protect, isAdmin, assignVendor);
router.delete('/:id',                   protect, isAdmin, deleteBooking);


module.exports = router;
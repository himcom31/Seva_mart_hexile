const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { protect, isAdmin } = require('../middleware/authMiddleware.js');
const upload  = require('../config/upload');           // ✅ multer middleware

const {
  addSubService,
  getAllSubServices,
  getSubServicesByService,
  getSubServiceById,
  updateSubService,
  deleteSubService,
} = require('../Controllers/Subservicecontroller.js');


// Public
router.get('/',                       getAllSubServices);
router.get('/by-service/:service_id', getSubServicesByService);
router.get('/:id',                    getSubServiceById);

// Admin
router.post('/',      protect, isAdmin, upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'icon',  maxCount: 3 },
]), addSubService);
router.put('/:id',    protect, isAdmin, upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'icon',  maxCount: 3 },
]), updateSubService);
router.delete('/:id', protect, isAdmin,   upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'icon',  maxCount: 3 },
]),      deleteSubService);

module.exports = router;


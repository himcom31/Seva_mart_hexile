const express    = require('express');
const router     = express.Router();
const upload  = require('../config/upload');           // ✅ multer middleware

const { protect, isAdmin } = require('../middleware/authMiddleware.js');
const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../Controllers/categoryController.js');

// Public
router.get('/',    getAllCategories);
router.get('/:id', getCategoryById);

// Admin only
router.post('/',    protect, isAdmin,  upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'icon',  maxCount: 3 },
]), addCategory);
router.put('/:id',  protect, isAdmin,  upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'icon',  maxCount: 3 },
]), updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
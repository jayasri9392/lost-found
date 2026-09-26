const express = require('express');
const router = express.Router();
const {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  getMyFoundItems,
  updateFoundItem,
  deleteFoundItem,
  markReturned,
} = require('../controllers/foundItemController');
const { protect } = require('../middleware/authMiddleware');

// User-specific routes (must be defined before /:id)
router.get('/my', protect, getMyFoundItems);

// General collections
router.get('/', getFoundItems);
router.post('/', protect, createFoundItem);

// Specific item routes
router.get('/:id', getFoundItemById);
router.put('/:id', protect, updateFoundItem);
router.delete('/:id', protect, deleteFoundItem);
router.patch('/:id/returned', protect, markReturned);

module.exports = router;

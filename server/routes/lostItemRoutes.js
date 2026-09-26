const express = require('express');
const router = express.Router();
const {
  createLostItem,
  getLostItems,
  getLostItemById,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
  markRecovered,
} = require('../controllers/lostItemController');
const { protect } = require('../middleware/authMiddleware');

// User-specific routes (must be defined before /:id)
router.get('/my', protect, getMyLostItems);

// General collections
router.get('/', getLostItems);
router.post('/', protect, createLostItem);

// Specific item routes
router.get('/:id', getLostItemById);
router.put('/:id', protect, updateLostItem);
router.delete('/:id', protect, deleteLostItem);
router.patch('/:id/recovered', protect, markRecovered);

module.exports = router;

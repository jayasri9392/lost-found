const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllLostItems,
  getAllFoundItems,
  getAllClaims,
} = require('../controllers/adminController');
const { deleteLostItem } = require('../controllers/lostItemController');
const { deleteFoundItem } = require('../controllers/foundItemController');
const { getReports, updateReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/lost-items', getAllLostItems);
router.delete('/lost-items/:id', deleteLostItem);

router.get('/found-items', getAllFoundItems);
router.delete('/found-items/:id', deleteFoundItem);

router.get('/claims', getAllClaims);

router.get('/reports', getReports);
router.patch('/reports/:id', updateReport);

module.exports = router;

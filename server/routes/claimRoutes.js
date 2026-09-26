const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  getClaimById,
  updateClaimStatus,
  cancelClaim,
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All claim routes require authentication

router.post('/', createClaim);
router.get('/my', getMyClaims);
router.get('/received', getReceivedClaims);
router.get('/:id', getClaimById);
router.patch('/:id/status', updateClaimStatus);
router.patch('/:id/cancel', cancelClaim);

module.exports = router;

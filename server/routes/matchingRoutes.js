const express = require('express');
const router = express.Router();
const {
  getMatchesForLostItem,
  getMatchesForFoundItem,
} = require('../controllers/matchingController');

router.get('/lost/:lostItemId', getMatchesForLostItem);
router.get('/found/:foundItemId', getMatchesForFoundItem);

module.exports = router;

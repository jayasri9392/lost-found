const express = require('express');
const router = express.Router();
const { searchAllItems } = require('../controllers/searchController');

router.get('/', searchAllItems);

module.exports = router;

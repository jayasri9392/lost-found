const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * @desc    Health check endpoint
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    message: 'Intelligent Lost & Found Network API is operational',
    timestamp: new Date().toISOString(),
    status: 'UP',
    database: dbStatus,
    version: '1.0.0',
  });
});

module.exports = router;

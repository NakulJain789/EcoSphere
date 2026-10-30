const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EcoSphere API',
    database: dbStatus,
    version: '1.0.0',
  });
});

module.exports = router;

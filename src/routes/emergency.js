const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const emergencyService = require('../services/emergencyService');

router.post('/',
  body('patientId').isMongoId(),
  body('location').isString().notEmpty(),
  body('severity').isIn(['low','medium','high']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const emergency = await emergencyService.createEmergency(req.body);
      res.status(201).json(emergency);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
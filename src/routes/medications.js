// src/routes/medications.js
"use strict";

const express = require('express');
const Joi = require('joi');

// Middleware for authentication
const auth = require('../middleware/auth');

// Controller functions
const {
  getAllMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication
} = require('../controllers/medications');

const router = express.Router();

// Async wrapper to handle errors
const asyncWrapper = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

// Validation schemas
const medicationSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  dosage: Joi.string().min(1).max(255).required(),
  frequency: Joi.string().min(1).max(255).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().optional()
});

const validateMedication = (req, res, next) => {
  const { error } = medicationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(e => e.message)
    });
  }
  next();
};

// Routes
router.get(
  '/',
  auth,
  asyncWrapper(async (req, res) => {
    const meds = await getAllMedications(req.user.id);
    res.json(meds);
  })
);

router.get(
  '/:id',
  auth,
  asyncWrapper(async (req, res, next) => {
    const med = await getMedicationById(req.params.id, req.user.id);
    if (!med) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(med);
  })
);

router.post(
  '/',
  auth,
  validateMedication,
  asyncWrapper(async (req, res) => {
    const newMed = await createMedication(req.body, req.user.id);
    res.status(201).json(newMed);
  })
);

router.put(
  '/:id',
  auth,
  validateMedication,
  asyncWrapper(async (req, res, next) => {
    const updated = await updateMedication(req.params.id, req.body, req.user.id);
    if (!updated) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(updated);
  })
);

router.delete(
  '/:id',
  auth,
  asyncWrapper(async (req, res, next) => {
    const deleted = await deleteMedication(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.sendStatus(204);
  })
);

module.exports = router;

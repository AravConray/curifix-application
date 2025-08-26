const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../services/doctors');
const auth = require('../middleware/auth');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.get('/doctors', async (req, res) => {
  try {
    const doctors = await getDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/doctors/:id',
  param('id').isInt().withMessage('Doctor id must be an integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const doctor = await getDoctorById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/doctors',
  auth.authenticate,
  body('name').notEmpty().withMessage('Name is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const newDoctor = await createDoctor(req.body);
      res.status(201).json(newDoctor);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.put('/doctors/:id',
  auth.authenticate,
  param('id').isInt().withMessage('Doctor id must be an integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const updatedDoctor = await updateDoctor(req.params.id, req.body);
      if (!updatedDoctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json(updatedDoctor);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.delete('/doctors/:id',
  auth.authenticate,
  param('id').isInt().withMessage('Doctor id must be an integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const deleted = await deleteDoctor(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.status(204).send();
    } catch (err) error: 'Internal Server Error' });
    }
  });

module.exports = router;
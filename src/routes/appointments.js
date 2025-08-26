const express = require('express');
const { body, param, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const appointmentsService = require('../services/appointmentsService');

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const appointments = await appointmentsService.getAll();
    res.json(appointments);
  })
);

router.get(
  '/:id',
  param('id').isUUID(),
  validate,
  asyncHandler(async (req, res) => {
    const appointment = await appointmentsService.getById(req.params.id);
    if (!appointment) return res.status(404).end();
    res.json(appointment);
  })
);

router.post(
  '/',
  body('patientId').exists().isUUID(),
  body('doctorId').exists().isUUID(),
  body('date').exists().isISO8601(),
  body('reason').isString().optional(),
  validate,
  asyncHandler(async (req, res) => {
    const newAppointment = await appointmentsService.create(req.body);
    res.status(201).json(newAppointment);
  })
);

router.put(
  '/:id',
  param('id').isUUID(),
  body('patientId').optional().isUUID(),
  body('doctorId').optional().isUUID(),
  body('date').optional().isISO8601(),
  body('reason').optional().isString(),
  validate,
  asyncHandler(async (req, res) => {
    const updatedAppointment = await appointmentsService.update(req.params.id, req.body);
    if (!updatedAppointment) return res.status(404).end();
    res.json(updatedAppointment);
  })
);

router.delete(
  '/:id',
  param('id').isUUID(),
  validate,
  asyncHandler(async (req, res) => {
    const deleted = await appointmentsService.delete(req.params.id);
    if (!deleted) return res.status(404).end();
    res.status(204).end();
  })
);

module.exports = router;
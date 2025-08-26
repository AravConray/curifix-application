// src/controllers/appointmentController.js

const appointmentService = require('../services/appointmentService');

/**
 * Create a new appointment.
 * Expects:
 *  - body: { patientId, doctorId, scheduledAt, ... }
 */
async function createAppointment(req, res, next) {
  try {
    const appointmentData = req.body;
    const created = await appointmentService.createAppointment(appointmentData);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve all appointments.
 */
async function getAllAppointments(req, res, next) {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve a single appointment by ID.
 */
async function getAppointmentById(req, res, next) {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an existing appointment.
 */
async function updateAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await appointmentService.updateAppointment(id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an appointment.
 */
async function deleteAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await appointmentService.deleteAppointment(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
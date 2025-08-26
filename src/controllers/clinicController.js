"use strict";

const clinicService = require("../services/clinicService");

/**
 * Retrieve all clinics.
 */
async function getClinics (req, res) {
  try {
    const clinics = await clinicService.getAllClinics();
    res.json({ success: true, data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Retrieve a single clinic by ID.
 */
async function getClinicById (req, res) {
  const { id } = req.params;
  try {
    const clinic = await clinicService.getClinicById(id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Create a new clinic.
 */
async function createClinic (req, res) {
  const clinicData = req.body;
  try {
    const newClinic = await clinicService.createClinic(clinicData);
    res.status(201).json({ success: true, data: newClinic });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

/**
 * Update an existing clinic.
 */
async function updateClinic (req, res) {
  const { id } = req.params;
  const clinicData = req.body;
  try {
    const updatedClinic = await clinicService.updateClinic(id, clinicData);
    if (!updatedClinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, data: updatedClinic });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

/**
 * Delete a clinic.
 */
async function deleteClinic (req, res) {
  const { id } = req.params;
  try {
    const deleted = await clinicService.deleteClinic(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic
};
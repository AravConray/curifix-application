const express = require('express');

const router = express.Router();

const clinicController = require('../controllers/clinic.controller');
const auth = require('../middleware/auth');

// Retrieve all clinics
router.get('/', clinicController.getAllClinics);

// Retrieve a single clinic by ID
router.get('/:id', clinicController.getClinicById);

// Create a new clinic (requires authentication)
router.post('/', auth.verifyToken, clinicController.createClinic);

// Update an existing clinic (requires authentication)
router.put('/:id', auth.verifyToken, clinicController.updateClinic);

// Delete a clinic (requires authentication)
router.delete('/:id', auth.verifyToken, clinicController.deleteClinic);

module.exports = router;
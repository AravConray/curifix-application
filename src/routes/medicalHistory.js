const express = require('express');
const router = express.Router();

const { getAllMedicalHistory, getMedicalHistoryById, createMedicalHistory, updateMedicalHistory, deleteMedicalHistory } = require('../controllers/medicalHistoryController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', ensureAuthenticated, getAllMedicalHistory);
router.get('/:id', ensureAuthenticated, getMedicalHistoryById);
router.post('/', ensureAuthenticated, createMedicalHistory);
router.put('/:id', ensureAuthenticated, updateMedicalHistory);
router.delete('/:id', ensureAuthenticated, deleteMedicalHistory);

module.exports = router;
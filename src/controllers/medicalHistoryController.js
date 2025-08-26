const medicalHistoryService = require('../services/medicalHistoryService');

const createMedicalHistory = async (req, res, next) => {
  try {
    const data = await medicalHistoryService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getMedicalHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await medicalHistoryService.findById(id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Medical history not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updateMedicalHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await medicalHistoryService.update(id, req.body);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Medical history not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const deleteMedicalHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await medicalHistoryService.delete(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Medical history not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMedicalHistory,
  getMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory
};
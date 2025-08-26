const Emergency = require('../models/emergency.model');

const createEmergency = async (req, res) => {
  try {
    const emergency = new Emergency(req.body);
    const saved = await emergency.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getEmergencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const emergency = await Emergency.findById(id);
    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }
    return res.json(emergency);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const updateEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Emergency.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ error: 'Emergency not found' });
    }
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const deleteEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Emergency.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Emergency not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getAllEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find();
    return res.json(emergencies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createEmergency,
  getEmergencyById,
  updateEmergency,
  deleteEmergency,
  getAllEmergencies
};
const MenstrualCycle = require('../models/menstrualCycle');

const createMenstrualCycle = async (req, res, next) => {
  try {
    const cycle = new MenstrualCycle(req.body);
    const savedCycle = await cycle.save();
    res.status(201).json({ success: true, data: savedCycle });
  } catch (err) {
    next(err);
  }
};

const getMenstrualCycle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cycle = await MenstrualCycle.findById(id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }
    res.json({ success: true, data: cycle });
  } catch (err) {
    next(err);
  }
};

const getAllMenstrualCycles = async (req, res, next) => {
  try {
    const cycles = await MenstrualCycle.find();
    res.json({ success: true, data: cycles });
  } catch (err) {
    next(err);
  }
};

const updateMenstrualCycle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCycle = await MenstrualCycle.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }
    res.json({ success: true, data: updatedCycle });
  } catch (err) {
    next(err);
  }
};

const deleteMenstrualCycle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await MenstrualCycle.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMenstrualCycle,
  getMenstrualCycle,
  getAllMenstrualCycles,
  updateMenstrualCycle,
  deleteMenstrualCycle,
};
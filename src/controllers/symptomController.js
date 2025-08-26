const { Symptom } = require('../models/symptom');

const getAllSymptoms = async (req, res, next) => {
  try {
    const symptoms = await Symptom.findAll();
    res.status(200).json(symptoms);
  } catch (error) {
    next(error);
  }
};

const getSymptomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const symptom = await Symptom.findByPk(id);
    if (!symptom) {
      return res.status(404).json({ message: 'Symptom not found' });
    }
    res.status(200).json(symptom);
  } catch (error) {
    next(error);
  }
};

const createSymptom = async (req, res, next) => {
  try {
    const symptomData = req.body;
    const newSymptom = await Symptom.create(symptomData);
    res.status(201).json(newSymptom);
  } catch (error) {
    next(error);
  }
};

const updateSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const symptomData = req.body;
    const symptom = await Symptom.findByPk(id);
    if (!symptom) {
      return res.status(404).json({ message: 'Symptom not found' });
    }
    await symptom.update(symptomData);
    res.status(200).json(symptom);
  } catch (error) {
    next(error);
  }
};

const deleteSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rowsDeleted = await Symptom.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      return res.status(404).json({ message: 'Symptom not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSymptoms,
  getSymptomById,
  createSymptom,
  updateSymptom,
  deleteSymptom,
};
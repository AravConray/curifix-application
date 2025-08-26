const express = require('express');
const router = express.Router();
const Symptom = require('../models/symptom');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const symptoms = await Symptom.find({ patientId: req.user.id }).lean().exec();
    res.json(symptoms);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const symptom = await Symptom.findOne({ _id: req.params.id, patientId: req.user.id }).lean().exec();
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    res.json(symptom);
  } catch (err) {
    next(err);
  }
});

router.post('/', ensureAuthenticated, async (req, res, next) => {
  const { description, severity } = req.body;
  if (!description || !severity) {
    return res.status(400).json({ error: 'Description and severity are required' });
  }
  try {
    const newSymptom = new Symptom({
      description,
      severity,
      patientId: req.user.id,
      reportedAt: new Date(),
    });
    const saved = await newSymptom.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', ensureAuthenticated, async (req, res, next) => {
  const { description, severity } = req.body;
  try {
    const updated = await Symptom.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user.id },
      { description, severity },
      { new: true, runValidators: true }
    ).lean().exec();
    if (!updated) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const deleted = await Symptom.findOneAndDelete({
      _id: req.params.id,
      patientId: req.user.id,
    }).exec();
    if (!deleted) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

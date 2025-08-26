const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Condition = require('../models/condition');

const isValidObjectId = mongoose.Types.ObjectId.isValid;

// Retrieve all conditions
router.get('/', async (req, res) => {
  try {
    const conditions = await Condition.find();
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve a single condition by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    const condition = await Condition.findById(id);
    if (!condition) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    res.json(condition);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new condition
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const newCondition = await Condition.create({ name, description });
    res.status(201).json(newCondition);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing condition by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const { name, description } = req.body;
  try {
    const updatedCondition = await Condition.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedCondition) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    res.json(updatedCondition);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a condition by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    const deleted = await Condition.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
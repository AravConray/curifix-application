import express from 'express';
import { validateCycleInput } from '../middlewares/validation.js';
import { getAllCycles, getCycleById, createCycle, updateCycle, deleteCycle } from '../services/menstrualCycleService.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// @route   GET /menstrualCycle
// @desc    Retrieve all menstrual cycles for authenticated user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cycles = await getAllCycles(req.user.id);
    res.status(200).json(cycles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /menstrualCycle/:id
// @desc    Retrieve a specific cycle by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const cycle = await getCycleById, req.user.id);
    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }
    res.status(200).json(cycle);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid cycle ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /menstrualCycle
// @desc    Create a new menstrual cycle
// @access  Private
router.post('/', [authMiddleware, validateCycleInput], async (req, res) => {
  try {
    const newCycle = await createCycle(req.user.id, req.body);
    res.status(201).json(newCycle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /menstrualCycle/:id
// @desc    Update an existing cycle
// @access  Private
router.put('/:id', [authMiddleware, validateCycleInput], async (req, res) => {
  try {
    const updatedCycle = await updateCycle(req.params.id, req.user.id, req.body);
    if (!updatedCycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }
    res.status(200).json(updatedCycle);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid cycle ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /menstrualCycle/:id
// @desc    Delete a cycle
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await deleteCycle(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Cycle not found' });
    }
    res.status(200).json({ message: 'Cycle deleted successfully' });
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid cycle ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
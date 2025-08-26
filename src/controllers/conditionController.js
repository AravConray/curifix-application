const conditionService = require('../services/conditionService');

async function getAllConditions(req, res, next) {
  try {
    const conditions = await conditionService.getAllConditions();
    res.status(200).json(conditions);
  } catch (err) {
    next(err);
  }
}

async function getConditionById(req, res, next) {
  try {
    const { id } = req.params;
    const condition = await conditionService.getConditionById(id);
    if (!condition) {
      return res.status(404).json({ message: 'Condition not found' });
    }
    res.status(200).json(condition);
  } catch (err) {
    next(err);
  }
}

async function createCondition(req, res, next) {
  try {
    const conditionData = req.body;
    const newCondition = await conditionService.createCondition(conditionData);
    res.status(201).json(newCondition);
  } catch (err) {
    next(err);
  }
}

async function updateCondition(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedCondition = await conditionService.updateCondition(id, updates);
    if (!updatedCondition) {
      return res.status(404).json({ message: 'Condition not found' });
    }
    res.status(200).json(updatedCondition);
  } catch (err) {
    next(err);
  }
}

async function deleteCondition(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await conditionService.deleteCondition(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Condition not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllConditions,
  getConditionById,
  createCondition,
  updateCondition,
  deleteCondition
};
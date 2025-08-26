const { Schema, model } = require('mongoose');

const ConditionSchema = new Schema({
  name: { type: String, required: true, trim: true },
  expression: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ConditionSchema.index({ name: 1 }, { unique: true });

module.exports = model('Condition', ConditionSchema);
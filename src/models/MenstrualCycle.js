const mongoose = require('mongoose');

const MenstrualCycleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date },
  cycleLength: { type: Number, min: 1 },
  periodDuration: { type: Number, min: 1 },
  symptoms: [{ type: String }],
  notes: { type: String },
}, { timestamps: true });

MenstrualCycleSchema.index({ user: 1, periodStart: 1 }, { unique: true });

MenstrualCycleSchema.statics.getAverageCycleLength = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, avgCycle: { $avg: '$cycleLength' } } },
  ]);
  return result[0] ? result[0].avgCycle : null;
};

MenstrualCycleSchema.methods.isCurrentCycle = function() {
  const today = new Date();
  return today >= this.periodStart && (!this.periodEnd || today <= this.periodEnd);
};

MenstrualCycleSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('MenstrualCycle', MenstrualCycleSchema);
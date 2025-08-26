const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/.+@.+\\..+/, 'is invalid'] },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
    specialization: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    schedule: {
        type: Map,
        of: [String]
    },
    createdAt: { type: Date, default: Date.now }
});

DoctorSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

DoctorSchema.methods.isAvailable = function (day, time) {
    const slots = this.schedule.get(day);
    return slots && slots.includes(time);
};

module.exports = mongoose.model('Doctor', DoctorSchema);

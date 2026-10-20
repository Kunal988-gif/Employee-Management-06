const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a leave type name'],
      unique: true,
      trim: true
    },
    yearlyQuota: {
      type: Number,
      required: [true, 'Please provide yearly quota in days'],
      min: [1, 'Yearly quota must be at least 1 day']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LeaveType', leaveTypeSchema);

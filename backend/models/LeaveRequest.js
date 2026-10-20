const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Leave request must belong to an employee']
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: [true, 'Please select a leave type']
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide leave start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide leave end date']
    },
    numberOfDays: {
      type: Number,
      required: [true, 'Number of leave days is required'],
      min: [1, 'Number of leave days must be at least 1']
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for leave'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be pending, approved, or rejected'
      },
      default: 'pending'
    },
    adminRemarks: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);

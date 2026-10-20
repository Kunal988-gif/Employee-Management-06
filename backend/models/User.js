const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide employee name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee'
    },
    employeeId: {
      type: String,
      required: [true, 'Please provide an Employee ID'],
      unique: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please provide a department'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Please provide a designation'],
      trim: true
    },
    joiningDate: {
      type: Date,
      required: [true, 'Please provide the joining date']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const User = require('../models/User');
const LeaveType = require('../models/LeaveType');
const LeaveRequest = require('../models/LeaveRequest');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await LeaveRequest.deleteMany({});
    await LeaveType.deleteMany({});
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@12345', salt);
    const userPassword = await bcrypt.hash('User@12345', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: adminPassword,
      role: 'admin',
      employeeId: 'ADM-001',
      department: 'Management',
      designation: 'System Administrator',
      joiningDate: new Date('2023-01-15')
    });

    const emp1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@company.com',
      password: userPassword,
      role: 'employee',
      employeeId: 'EMP-101',
      department: 'Engineering',
      designation: 'Software Developer',
      joiningDate: new Date('2023-06-01')
    });

    const emp2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@company.com',
      password: userPassword,
      role: 'employee',
      employeeId: 'EMP-102',
      department: 'Design',
      designation: 'UI/UX Designer',
      joiningDate: new Date('2023-08-15')
    });

    const emp3 = await User.create({
      name: 'Amit Verma',
      email: 'amit@company.com',
      password: userPassword,
      role: 'employee',
      employeeId: 'EMP-103',
      department: 'Marketing',
      designation: 'Marketing Executive',
      joiningDate: new Date('2024-01-10')
    });

    const emp4 = await User.create({
      name: 'Sneha Rao',
      email: 'sneha@company.com',
      password: userPassword,
      role: 'employee',
      employeeId: 'EMP-104',
      department: 'Engineering',
      designation: 'QA Engineer',
      joiningDate: new Date('2024-02-01')
    });

    const casualLeave = await LeaveType.create({
      name: 'Casual Leave',
      yearlyQuota: 12,
      isActive: true
    });

    const sickLeave = await LeaveType.create({
      name: 'Sick Leave',
      yearlyQuota: 10,
      isActive: true
    });

    const paidLeave = await LeaveType.create({
      name: 'Paid Leave',
      yearlyQuota: 15,
      isActive: true
    });

    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const leaveRequestsData = [
      {
        employee: emp1._id,
        leaveType: casualLeave._id,
        startDate: yesterday,
        endDate: tomorrow,
        numberOfDays: 3,
        reason: 'Family function at hometown',
        status: 'approved',
        adminRemarks: 'Approved'
      },
      {
        employee: emp2._id,
        leaveType: sickLeave._id,
        startDate: today,
        endDate: tomorrow,
        numberOfDays: 2,
        reason: 'Viral fever and doctor consultation',
        status: 'approved',
        adminRemarks: 'Get well soon'
      },
      {
        employee: emp3._id,
        leaveType: casualLeave._id,
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-12'),
        numberOfDays: 3,
        reason: 'Personal work',
        status: 'approved',
        adminRemarks: 'Approved'
      },
      {
        employee: emp4._id,
        leaveType: paidLeave._id,
        startDate: new Date('2026-04-05'),
        endDate: new Date('2026-04-08'),
        numberOfDays: 4,
        reason: 'Vacation trip',
        status: 'approved',
        adminRemarks: 'Enjoy your vacation'
      },
      {
        employee: emp1._id,
        leaveType: sickLeave._id,
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-01-16'),
        numberOfDays: 2,
        reason: 'Severe migraine',
        status: 'approved',
        adminRemarks: 'Approved'
      },
      {
        employee: emp2._id,
        leaveType: paidLeave._id,
        startDate: new Date('2026-02-10'),
        endDate: new Date('2026-02-13'),
        numberOfDays: 4,
        reason: 'Attending cousin wedding',
        status: 'approved',
        adminRemarks: 'Approved'
      },
      {
        employee: emp1._id,
        leaveType: paidLeave._id,
        startDate: new Date('2026-11-10'),
        endDate: new Date('2026-11-12'),
        numberOfDays: 3,
        reason: 'Festival celebrations',
        status: 'pending',
        adminRemarks: ''
      },
      {
        employee: emp3._id,
        leaveType: sickLeave._id,
        startDate: new Date('2026-11-15'),
        endDate: new Date('2026-11-16'),
        numberOfDays: 2,
        reason: 'Health checkup appointment',
        status: 'pending',
        adminRemarks: ''
      },
      {
        employee: emp4._id,
        leaveType: casualLeave._id,
        startDate: new Date('2026-11-20'),
        endDate: new Date('2026-11-22'),
        numberOfDays: 3,
        reason: 'Moving to new apartment',
        status: 'pending',
        adminRemarks: ''
      },
      {
        employee: emp2._id,
        leaveType: casualLeave._id,
        startDate: new Date('2026-12-01'),
        endDate: new Date('2026-12-02'),
        numberOfDays: 2,
        reason: 'Personal urgent appointment',
        status: 'pending',
        adminRemarks: ''
      },
      {
        employee: emp3._id,
        leaveType: paidLeave._id,
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-02-05'),
        numberOfDays: 5,
        reason: 'Too many leaves requested together during release',
        status: 'rejected',
        adminRemarks: 'Cannot approve during sprint release week'
      },
      {
        employee: emp4._id,
        leaveType: sickLeave._id,
        startDate: new Date('2026-05-10'),
        endDate: new Date('2026-05-12'),
        numberOfDays: 3,
        reason: 'Tooth extraction',
        status: 'rejected',
        adminRemarks: 'Please submit medical certificate'
      }
    ];

    await LeaveRequest.insertMany(leaveRequestsData);

    console.log('Seeded successfully:');
    console.log('- 1 Admin');
    console.log('- 4 Employees');
    console.log('- 3 Leave Types');
    console.log('- 12 Leave Requests (6 Approved, 4 Pending, 2 Rejected)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();

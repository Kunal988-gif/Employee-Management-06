const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createInitialAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminEmpId = 'ADM-001';

    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail.toLowerCase() }, { employeeId: adminEmpId }, { role: 'admin' }]
    });

    if (existingAdmin) {
      console.log('Admin already exists: ' + existingAdmin.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = await User.create({
      name: 'System Administrator',
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      employeeId: adminEmpId,
      department: 'Human Resources',
      designation: 'HR Administrator',
      joiningDate: new Date('2024-01-01')
    });

    console.log('Admin user created: ' + admin.email);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

createInitialAdmin();

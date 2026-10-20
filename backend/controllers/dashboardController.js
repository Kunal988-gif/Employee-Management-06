const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const pendingCount = await LeaveRequest.countDocuments({ status: 'pending' });

    const activeLeavesToday = await LeaveRequest.find({
      status: 'approved',
      startDate: { $lte: endOfToday },
      endDate: { $gte: today }
    }).distinct('employee');

    const employeesOnLeaveToday = activeLeavesToday.length;

    const approvedLeaves = await LeaveRequest.find({ status: 'approved' }).populate('employee', 'department');
    const deptMap = {};
    approvedLeaves.forEach((item) => {
      const dept = item.employee?.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { department: dept, totalLeaves: 0, totalDays: 0 };
      }
      deptMap[dept].totalLeaves += 1;
      deptMap[dept].totalDays += item.numberOfDays;
    });

    const departmentLeaveStats = Object.values(deptMap);

    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const approvedCount = await LeaveRequest.countDocuments({ status: 'approved' });
    const rejectedCount = await LeaveRequest.countDocuments({ status: 'rejected' });

    res.status(200).json({
      success: true,
      data: {
        pendingCount,
        employeesOnLeaveToday,
        departmentWiseLeaveCount: departmentLeaveStats,
        summary: {
          totalEmployees,
          approvedCount,
          rejectedCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};

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

    const departmentLeaveStats = await LeaveRequest.aggregate([
      {
        $match: { status: 'approved' }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      {
        $unwind: '$employeeDetails'
      },
      {
        $group: {
          _id: '$employeeDetails.department',
          totalLeaves: { $sum: 1 },
          totalDays: { $sum: '$numberOfDays' }
        }
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          totalLeaves: 1,
          totalDays: 1
        }
      },
      {
        $sort: { totalLeaves: -1 }
      }
    ]);

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

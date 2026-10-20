const LeaveRequest = require('../models/LeaveRequest');
const LeaveType = require('../models/LeaveType');

const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end < start) {
    throw new Error('End date cannot be earlier than start date');
  }

  let days = 0;
  const current = new Date(start);

  while (current <= end) {
    if (current.getDay() !== 0) {
      days++;
    }
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const checkLeaveOverlap = async (employeeId, startDate, endDate, excludeRequestId = null) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const query = {
    employee: employeeId,
    status: { $in: ['pending', 'approved'] },
    startDate: { $lte: end },
    endDate: { $gte: start }
  };

  if (excludeRequestId) {
    query._id = { $ne: excludeRequestId };
  }

  const existingRequest = await LeaveRequest.findOne(query).populate('leaveType', 'name');
  return existingRequest;
};

const calculateEmployeeBalance = async (employeeId, leaveTypeId, year) => {
  const leaveType = await LeaveType.findById(leaveTypeId);
  if (!leaveType) {
    throw new Error('Leave type not found');
  }

  const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

  const approvedRequests = await LeaveRequest.find({
    employee: employeeId,
    leaveType: leaveTypeId,
    status: 'approved',
    startDate: { $gte: startOfYear, $lte: endOfYear }
  });

  const usedDays = approvedRequests.reduce((sum, req) => sum + req.numberOfDays, 0);
  const availableBalance = Math.max(0, leaveType.yearlyQuota - usedDays);

  return {
    leaveTypeId: leaveType._id,
    leaveTypeName: leaveType.name,
    yearlyQuota: leaveType.yearlyQuota,
    usedDays,
    availableBalance
  };
};

module.exports = {
  calculateLeaveDays,
  checkLeaveOverlap,
  calculateEmployeeBalance
};

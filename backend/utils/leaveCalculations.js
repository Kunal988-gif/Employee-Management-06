const LeaveRequest = require('../models/LeaveRequest');
const LeaveType = require('../models/LeaveType');

const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
};

const checkLeaveOverlap = async (employeeId, startDate, endDate, excludeRequestId = null) => {
  const query = {
    employee: employeeId,
    status: { $in: ['pending', 'approved'] },
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) }
  };

  if (excludeRequestId) {
    query._id = { $ne: excludeRequestId };
  }

  return await LeaveRequest.findOne(query);
};

const calculateEmployeeBalance = async (employeeId, leaveTypeId, year) => {
  const leaveType = await LeaveType.findById(leaveTypeId);
  if (!leaveType) {
    throw new Error('Leave type not found');
  }

  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

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

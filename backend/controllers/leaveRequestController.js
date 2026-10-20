const LeaveRequest = require('../models/LeaveRequest');
const LeaveType = require('../models/LeaveType');
const {
  calculateLeaveDays,
  checkLeaveOverlap,
  calculateEmployeeBalance
} = require('../utils/leaveCalculations');

const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: leaveType, startDate, endDate, reason'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start date or end date format'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date'
      });
    }

    const typeDoc = await LeaveType.findById(leaveType);
    if (!typeDoc || !typeDoc.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Selected leave type not found or is currently inactive'
      });
    }

    const numberOfDays = calculateLeaveDays(start, end);
    if (numberOfDays <= 0) {
      return res.status(400).json({
        success: false,
        message: 'The selected date range contains no working days (e.g. only Sundays)'
      });
    }

    const overlapping = await checkLeaveOverlap(req.user._id, start, end);
    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: `You already have an existing ${overlapping.status} leave request from ${new Date(overlapping.startDate).toLocaleDateString()} to ${new Date(overlapping.endDate).toLocaleDateString()}`
      });
    }

    const leaveYear = start.getFullYear();
    const balanceInfo = await calculateEmployeeBalance(req.user._id, leaveType, leaveYear);

    if (numberOfDays > balanceInfo.availableBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. You requested ${numberOfDays} day(s), but only have ${balanceInfo.availableBalance} day(s) available for ${typeDoc.name} in ${leaveYear}`
      });
    }

    const leaveRequest = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason: reason.trim(),
      status: 'pending',
      adminRemarks: ''
    });

    const populated = await LeaveRequest.findById(leaveRequest._id)
      .populate('leaveType', 'name yearlyQuota')
      .populate('employee', 'name email employeeId department');

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

const getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id })
      .populate('leaveType', 'name yearlyQuota')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
};

const getLeaveById = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate('leaveType', 'name yearlyQuota')
      .populate('employee', 'name email employeeId department designation joiningDate');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (req.user.role !== 'admin' && leave.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only view your own leave requests'
      });
    }

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

const cancelLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findOne({
      _id: req.params.id,
      employee: req.user._id
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found or not owned by you'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a leave request that has already been ${leave.status}. Only pending requests can be cancelled.`
      });
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getMyBalances = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const activeTypes = await LeaveType.find({ isActive: true });

    const balances = await Promise.all(
      activeTypes.map(async (lt) => {
        return await calculateEmployeeBalance(req.user._id, lt._id, currentYear);
      })
    );

    res.status(200).json({
      success: true,
      year: currentYear,
      data: balances
    });
  } catch (error) {
    next(error);
  }
};

const getAllLeaves = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const leaves = await LeaveRequest.find(filter)
      .populate('leaveType', 'name yearlyQuota')
      .populate('employee', 'name email employeeId department designation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
};

const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'approved' or 'rejected'"
      });
    }

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This leave request has already been ${leave.status} and cannot be processed again.`
      });
    }

    if (status === 'approved') {
      const overlapping = await checkLeaveOverlap(leave.employee, leave.startDate, leave.endDate, leave._id);
      if (overlapping && overlapping.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Cannot approve: The employee now has another already-approved leave that overlaps with these dates.'
        });
      }

      const leaveYear = new Date(leave.startDate).getFullYear();
      const balanceInfo = await calculateEmployeeBalance(leave.employee, leave.leaveType, leaveYear);
      if (leave.numberOfDays > balanceInfo.availableBalance) {
        return res.status(400).json({
          success: false,
          message: `Cannot approve: Employee now has insufficient balance. (Requested: ${leave.numberOfDays}, Available: ${balanceInfo.availableBalance})`
        });
      }
    }

    const updated = await LeaveRequest.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      {
        status,
        adminRemarks: adminRemarks || ''
      },
      { new: true }
    )
      .populate('leaveType', 'name yearlyQuota')
      .populate('employee', 'name email employeeId department');

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Could not process request: Request may have already been updated by another admin.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Leave request has been ${status} successfully`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getLeaveById,
  cancelLeave,
  getMyBalances,
  getAllLeaves,
  updateLeaveStatus
};

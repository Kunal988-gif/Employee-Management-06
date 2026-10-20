const LeaveType = require('../models/LeaveType');
const LeaveRequest = require('../models/LeaveRequest');

const getLeaveTypes = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user && req.user.role !== 'admin') {
      filter.isActive = true;
    }

    const leaveTypes = await LeaveType.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaveTypes.length,
      data: leaveTypes
    });
  } catch (error) {
    next(error);
  }
};

const getLeaveTypeById = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);

    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: 'Leave type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: leaveType
    });
  } catch (error) {
    next(error);
  }
};

const createLeaveType = async (req, res, next) => {
  try {
    const { name, yearlyQuota, isActive } = req.body;

    if (!name || yearlyQuota === undefined || yearlyQuota === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide leave type name and yearly quota'
      });
    }

    if (Number(yearlyQuota) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Yearly quota must be greater than 0'
      });
    }

    const existing = await LeaveType.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Leave type already exists'
      });
    }

    const leaveType = await LeaveType.create({
      name: name.trim(),
      yearlyQuota: Number(yearlyQuota),
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Leave type created successfully',
      data: leaveType
    });
  } catch (error) {
    next(error);
  }
};

const updateLeaveType = async (req, res, next) => {
  try {
    const { name, yearlyQuota, isActive } = req.body;

    const leaveType = await LeaveType.findById(req.params.id);
    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: 'Leave type not found'
      });
    }

    if (name) {
      const duplicate = await LeaveType.findOne({
        _id: { $ne: req.params.id },
        name: name.trim()
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another leave type with this name already exists'
        });
      }
      leaveType.name = name.trim();
    }

    if (yearlyQuota !== undefined && yearlyQuota !== null) {
      if (Number(yearlyQuota) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Yearly quota must be greater than 0'
        });
      }
      leaveType.yearlyQuota = Number(yearlyQuota);
    }

    if (isActive !== undefined) {
      leaveType.isActive = Boolean(isActive);
    }

    await leaveType.save();

    res.status(200).json({
      success: true,
      message: 'Leave type updated successfully',
      data: leaveType
    });
  } catch (error) {
    next(error);
  }
};

const deleteLeaveType = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);

    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: 'Leave type not found'
      });
    }

    const requestCount = await LeaveRequest.countDocuments({ leaveType: req.params.id });
    if (requestCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete '${leaveType.name}' because ${requestCount} existing leave request(s) reference it. You can set it to inactive instead.`
      });
    }

    await LeaveType.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Leave type deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaveTypes,
  getLeaveTypeById,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType
};

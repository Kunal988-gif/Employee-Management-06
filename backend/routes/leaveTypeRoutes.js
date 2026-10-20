const express = require('express');
const router = express.Router();
const {
  getLeaveTypes,
  getLeaveTypeById,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType
} = require('../controllers/leaveTypeController');
const { authHandler, allowRoles } = require('../middleware/auth');

router.use(authHandler);

router.get('/', getLeaveTypes);
router.get('/:id', getLeaveTypeById);

router.post('/', allowRoles('admin'), createLeaveType);
router.put('/:id', allowRoles('admin'), updateLeaveType);
router.delete('/:id', allowRoles('admin'), deleteLeaveType);

module.exports = router;

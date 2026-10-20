const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getLeaveById,
  cancelLeave,
  getMyBalances,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveRequestController');
const { authHandler, allowRoles } = require('../middleware/auth');

router.use(authHandler);

router.post('/', applyLeave);
router.get('/my', getMyLeaves);
router.get('/balances', getMyBalances);

router.get('/', allowRoles('admin'), getAllLeaves);

router.get('/:id', getLeaveById);
router.delete('/:id', cancelLeave);
router.patch('/:id/status', allowRoles('admin'), updateLeaveStatus);

module.exports = router;

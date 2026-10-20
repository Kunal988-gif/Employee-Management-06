const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authHandler, allowRoles } = require('../middleware/auth');

router.use(authHandler);
router.use(allowRoles('admin'));

router.get('/stats', getDashboardStats);

module.exports = router;

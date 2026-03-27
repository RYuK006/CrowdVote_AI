const express = require('express');
const { getAdminStats, getConfig, updateConfig, updateOfficialResults } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public endpoint for phase info
router.get('/config', getConfig);

// Protected admin endpoints
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.put('/config', updateConfig);
router.post('/results', updateOfficialResults);

module.exports = router;

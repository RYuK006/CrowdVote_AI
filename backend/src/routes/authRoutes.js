const express = require('express');
const router = express.Router();
const { 
  phoneAuth, 
  loginAdmin, 
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/phone', phoneAuth);
router.post('/admin/login', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;

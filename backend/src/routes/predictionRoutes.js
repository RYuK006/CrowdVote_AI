const express = require('express');
const { getConstituencies, submitPrediction } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All prediction routes are protected

router.get('/constituencies', getConstituencies);
router.get('/my-predictions', require('../controllers/predictionController').getMyPredictions);
router.post('/submit', submitPrediction);

module.exports = router;

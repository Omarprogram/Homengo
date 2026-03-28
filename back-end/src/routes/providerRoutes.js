const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

router.get('/verified', providerController.getVerifiedProviders);
router.post('/', providerController.createProvider);
router.put('/:id/verify', providerController.verifyProvider);
router.get('/stats', providerController.getStats);

module.exports = router;

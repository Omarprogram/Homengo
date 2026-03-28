// subscriptionRoutes.js
import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/subscribe', subscriptionController.validateEmail, subscriptionController.subscribe);
router.post('/unsubscribe', subscriptionController.validateEmail, subscriptionController.unsubscribe);
router.put('/preferences', subscriptionController.validateEmail, subscriptionController.updatePreferences);
router.get('/active', subscriptionController.getActiveSubscriptions);
router.get('/stats', subscriptionController.getStats);

export default router;

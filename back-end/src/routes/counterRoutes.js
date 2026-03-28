
import express from 'express';
import { 
  getAllCounters, 
  getCounter, 
  updateCounter, 
  seedCounters 
} from '../controllers/counterController.js';

const router = express.Router();

// Get all counters
router.get('/', getAllCounters);

// Get single counter by type
router.get('/:type', getCounter);

// Update counter (admin only - you might want to add auth middleware)
router.put('/:type', updateCounter);

// Seed/initialize counters with default values
router.post('/seed', seedCounters);

export default router;
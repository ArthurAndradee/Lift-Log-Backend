import { Router } from 'express';
import workoutController from '../controllers/workoutController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/log', authMiddleware, workoutController.logWorkout);
router.get('/records/:userId/:exercise', authMiddleware, workoutController.getPreviousRecords);
router.get('/exercises', authMiddleware, workoutController.getAvailableExercises);
router.delete('/delete', authMiddleware, workoutController.deleteWorkout);

export default router;
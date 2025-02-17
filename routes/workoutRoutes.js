import { Router } from 'express';
import workoutController from '../controllers/workoutController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/log', authMiddleware, workoutController.logWorkout);
router.get('/records/:userId', authMiddleware, workoutController.getAllExerciseRecords);
router.get('/records/:userId/:exercise', authMiddleware, workoutController.getSpecificExerciseRecord);
router.get('/exercises', authMiddleware, workoutController.getExercisesByName);
router.delete('/delete', authMiddleware, workoutController.deleteWorkout);

export default router;
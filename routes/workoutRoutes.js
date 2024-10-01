import { Router } from 'express';
import workoutController from '../controllers/workoutController.js';

const router = Router();

router.post('/log', workoutController.logWorkout);
router.get('/records/:userId/:exercise', workoutController.getPreviousRecords);
router.get('/exercises', workoutController.getAvailableExercises);
router.delete('/delete', workoutController.deleteWorkout);

export default router;

import { Router } from 'express';
import workoutController from '../controllers/workoutController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/log', authMiddleware, workoutController.logWorkout);
router.get('/records/:userId', authMiddleware, workoutController.getAllExerciseSets);
router.get('/records/:userId/:exercise', authMiddleware, workoutController.getUniqueExerciseSets);
router.get('/exercises', authMiddleware, workoutController.getExercisesByName);
router.delete('/delete', authMiddleware, workoutController.deleteExercise);

router.post('/create', authMiddleware, workoutController.createWorkout);
router.get('/workouts/:userId', authMiddleware, workoutController.getWorkoutsForUser); // Fetch all workouts for a user
router.get('/workout/exercises/:userId/:workoutName', authMiddleware, workoutController.getExerciseNamesForWorkout);
router.get('/workout/:userId/:workoutName/exercise-details', authMiddleware, workoutController.getExerciseDetailsForWorkout);
router.post('/workout/:userId/:workoutName/exercise', authMiddleware, workoutController.createExerciseForWorkout);

export default router;
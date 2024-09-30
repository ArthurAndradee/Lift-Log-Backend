const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.post('/log', workoutController.logWorkout);
router.get('/records/:userId/:exercise', workoutController.getPreviousRecords);
router.get('/exercises', workoutController.getAvailableExercises);
router.delete('/delete', workoutController.deleteWorkout);

module.exports = router;

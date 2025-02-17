import Workout from '../models/workoutModel.js';
import db from '../database/db.js';

const workoutController = {
  createWorkout: (req, res) => {
    const { userId, workoutName } = req.body; 
    
    Workout.createWorkout(userId, workoutName, (err, workoutId) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create workout' });
      }
      res.status(200).json({
        message: 'Workout created successfully',
        workoutId: workoutId,
      });
    });
  },
  

  logWorkout: (req, res) => {
    const { userId, exercise, sets, workoutId } = req.body;

    Workout.logWorkout(userId, exercise, sets, workoutId, (err, exerciseId) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log workout' })
      };
      res.status(200).json({ 
        message: 'Workout logged successfully',
        exerciseId
      });
    });
  },
  
  getExercisesByName: (req, res) => {
    const userId = req.userId;

    Workout.getExercisesByName(userId, (err, exercises) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching exercises' });
      }
      res.json({ exercises });
    });
  },

  getUniqueExerciseSets: (req, res) => {
    const { userId, exercise } = req.params;

    Workout.getUniqueExerciseSets(userId, exercise, (err, records) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch records' });
      }
      res.json(records);
    });
  },

  getAllExerciseSets: (req, res) => {
    const { userId } = req.params;
  
    Workout.getAllExerciseSets(userId, (err, records) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch records' });
      }
      res.json(records);
    });
  },

  deleteExercise: (req, res) => {
    const { userId, workoutId } = req.body;

    Workout.deleteExercise(userId, workoutId, (err, success) => {
      if (err) return res.status(500).json({ error: 'Failed to delete workout' });
      if (!success) return res.status(404).json({ error: 'Workout not found or unauthorized' });
      res.status(200).json({ message: 'Workout deleted successfully' });
    });
  }
};

export default workoutController;
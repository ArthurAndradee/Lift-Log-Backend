import Workout from '../models/workoutModel.js';

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
  
  getExercisesNames: (req, res) => {
    const userId = req.userId;

    Workout.getExercisesNames(userId, (err, exercises) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching exercises' });
      }
      res.json({ exercises });
    });
  },

  getExercisesInfo: (req, res) => {
    const { userId, exercise } = req.params;

    Workout.getExercisesInfo(userId, exercise, (err, records) => {
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
  },

  getWorkoutsForUser: (req, res) => {
    const { userId } = req.params;
  
    Workout.getWorkoutsForUser(userId, (err, workouts) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve workouts' });
      }
      res.status(200).json({ workouts });
    });
  },
  
  getExerciseNamesForWorkout: (req, res) => {
    const { userId, workoutId } = req.params;

    Workout.getExerciseNamesForWorkout(userId, workoutId, (err, exercises) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching exercise names' });
      }
      res.json({ exercises });
    });
  },

  getExerciseDetailsForWorkout: (req, res) => {
    const { userId, workoutId } = req.params;

    Workout.getExerciseDetailsForWorkout(userId, workoutId, (err, details) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching exercise details' });
      }
      res.json({ details });
    });
  },

  createExerciseForWorkout: (req, res) => {
    const { userId, workoutName } = req.params;
    const exerciseData = req.body;

    Workout.createExerciseForWorkout(userId, workoutName, exerciseData, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating exercise' });
      }
      res.json(result);
    });
  } 
};

export default workoutController;
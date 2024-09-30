const Workout = require('../models/workoutModel');

exports.logWorkout = (req, res) => {
  const { userId, exercise, sets } = req.body;

  Workout.logWorkout(userId, exercise, sets, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to log workout' });
    res.status(200).json({ message: 'Workout logged successfully' });
  });
};

exports.getPreviousRecords = (req, res) => {
  const { userId, exercise } = req.params;

  Workout.getPreviousRecords(userId, exercise, (err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch records' });
    }
    res.json(records);
  });
};

exports.getAvailableExercises = (req, res) => {
  const userId = req.query.userId;

  Workout.getAvailableExercises(userId, (err, exercises) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching exercises' });
    }
    res.json({ exercises });
  });
};

exports.deleteWorkout = (req, res) => {
  const { userId, workoutId } = req.body;

  Workout.deleteWorkoutRecord(userId, workoutId, (err, success) => {
    if (err) return res.status(500).json({ error: 'Failed to delete workout' });
    if (!success) return res.status(404).json({ error: 'Workout not found or unauthorized' });
    res.status(200).json({ message: 'Workout deleted successfully' });
  });
};
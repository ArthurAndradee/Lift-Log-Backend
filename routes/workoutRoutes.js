const express = require('express');
const router = express.Router();
const Workout = require('../models/workoutModel');

router.post('/log', (req, res) => {
  const { userId, exercise, sets } = req.body;
  
  Workout.logWorkout(userId, exercise, sets, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to log workout' });
    res.status(200).json({ message: 'Workout logged successfully' });
  });
});

router.get('/records/:userId/:exercise', (req, res) => {
  const { userId, exercise } = req.params;

  Workout.getPreviousRecords(userId, exercise, (err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch records' });
    }
    res.json(records);
  });
});

router.get('/exercises', (req, res) => {
  const userId = req.query.userId;

  Workout.getAvailableExercises(userId, (err, exercises) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching exercises' });
    }
    res.json({ exercises });
  });
});

module.exports = router;
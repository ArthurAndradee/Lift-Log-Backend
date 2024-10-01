// models/workoutModel.js
import db from './db.js';

const Workout = {
  logWorkout: (userId, exercise, sets, callback) => {
    const workoutQuery = `INSERT INTO workouts (userId, exercise) VALUES (?, ?)`;

    db.query(workoutQuery, [userId, exercise], (err, result) => {
      if (err) {
        return callback(err);
      }

      const workoutId = result.insertId;
      const setQueries = sets.map(set => {
        return new Promise((resolve, reject) => {
          const setQuery = `INSERT INTO workout_sets (workoutId, setNumber, weight, reps) VALUES (?, ?, ?, ?)`;
          db.query(setQuery, [workoutId, set.setNumber, set.weight, set.reps], (err, setResult) => {
            if (err) return reject(err);
            resolve(setResult);
          });
        });
      });

      Promise.all(setQueries)
        .then(results => callback(null, results))
        .catch(err => callback(err));
    });
  },

  getPreviousRecords: (userId, exercise, callback) => {
    const query = `
      SELECT w.id AS workoutId, w.exercise, w.date, s.setNumber, s.weight, s.reps
      FROM workouts w
      JOIN workout_sets s ON w.id = s.workoutId
      WHERE w.userId = ? AND w.exercise = ?
      ORDER BY w.date DESC`;

    db.query(query, [userId, exercise], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },
  
  getAvailableExercises: (userId, callback) => {
    const query = `
      SELECT DISTINCT exercise 
      FROM workouts`;

    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      const exercises = results.map(row => row.exercise);
      callback(null, exercises);
    });
  },

  deleteWorkoutRecord: (userId, workoutId, callback) => {
    const deleteSetsQuery = `DELETE FROM workout_sets WHERE workoutId = ?`;
    db.query(deleteSetsQuery, [workoutId], (err) => {
      if (err) return callback(err);

      const deleteQuery = `DELETE FROM workouts WHERE id = ? AND userId = ?`;
      db.query(deleteQuery, [parseInt(workoutId, 10), userId], (err, result) => {
        if (err) {
          return callback(err);
        }
        if (result.affectedRows === 0) {
          return callback(null, false);
        }
        callback(null, true); 
      });
    });
  }
};

export default Workout;
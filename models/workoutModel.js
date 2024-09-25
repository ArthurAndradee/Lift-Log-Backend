const db = require('./db');

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
          const setQuery = `INSERT INTO workout_sets (workoutId, setNumber, weight) VALUES (?, ?, ?)`;
          db.query(setQuery, [workoutId, set.setNumber, set.weight], (err, setResult) => {
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
      SELECT w.id AS workoutId, w.exercise, w.date, s.setNumber, s.weight 
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
  }
};

module.exports = Workout; 
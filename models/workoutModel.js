import db from '../database/db.js';

const Workout = {
  logWorkout: (userId, exercise, sets, callback) => {
    const exerciseQuery = `INSERT INTO exercises (userId, exercise) VALUES (?, ?)`;

    db.query(exerciseQuery, [userId, exercise], (err, result) => {
      if (err) {
        return callback(err);
      }
      
      const exerciseId = result.insertId; 
      
      const setQueries = sets.map(set => {
        return new Promise((resolve, reject) => {
          const setQuery = `INSERT INTO exercise_sets (exerciseId, setNumber, weight, reps) VALUES (?, ?, ?, ?)`;  

          db.query(setQuery, [exerciseId, set.setNumber, set.weight, set.reps], (err, setResult) => {
            if (err) return reject(err);
            resolve(setResult);
          });
        });
      });

      Promise.all(setQueries)
        .then(() => callback(null, exerciseId))
        .catch(err => callback(err));
    });
  },

  getUniqueExerciseSets: (userId, exercise, callback) => {
    const query = `
      SELECT e.id AS exerciseId, e.exercise, e.date, s.setNumber, s.weight, s.reps
      FROM exercises e
      JOIN exercise_sets s ON e.id = s.exerciseId
      WHERE e.userId = ? AND e.exercise = ?
      ORDER BY e.date DESC;`;

    db.query(query, [userId, exercise], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  getAllExerciseSets: (userId, callback) => {
    const query = `
      SELECT e.id AS exerciseId, e.exercise, e.date, s.setNumber, s.weight, s.reps
      FROM exercises e
      JOIN exercise_sets s ON e.id = s.exerciseId
      WHERE e.userId = ?
      ORDER BY e.date DESC;`;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },  
  
  getExercisesByName: (userId, callback) => {    
    const query = `
    SELECT DISTINCT exercise 
    FROM exercises 
    WHERE userId = ?`;

    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      const exercises = results.map(row => row.exercise);
      callback(null, exercises);
    });
  },

  deleteWorkoutRecord: (userId, workoutId, callback) => {
    const deleteSetsQuery = `DELETE FROM exercise_sets WHERE exerciseId = ?`;
    db.query(deleteSetsQuery, [workoutId], (err) => {
      if (err) return callback(err);

      const deleteQuery = `DELETE FROM exercises WHERE id = ? AND userId = ?`;
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
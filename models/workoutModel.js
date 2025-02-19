import db from '../database/db.js';

const Workout = {
  createWorkout: (userId, workoutName, callback) => {
    const workoutQuery = `INSERT INTO workouts (userId, name, date) VALUES (?, ?, ?)`;
  
    db.query(workoutQuery, [userId, workoutName, new Date()], (err, result) => {
      if (err) {
        return callback(err);
      }
      const workoutId = result.insertId;
      callback(null, workoutId);  
    });
  },

  logWorkout: (userId, exercise, sets, workoutId, callback) => {
    const exerciseQuery = `INSERT INTO exercises (userId, exercise, workoutId) VALUES (?, ?, ?)`;

    db.query(exerciseQuery, [userId, exercise, workoutId || null], (err, result) => {
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

  deleteExercise: (userId, workoutId, callback) => {
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
  },

  getWorkoutsForUser: (userId, callback) => {
    const query = `
      SELECT DISTINCT w.name AS workoutName
      FROM workouts w
      WHERE w.userId = ?
      ORDER BY w.date DESC;
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      const workoutNames = results.map(row => row.workoutName);
      callback(null, workoutNames);
    });
  },

  getExerciseNamesForWorkout: (userId, workoutName, callback) => {
    const query = `
      SELECT e.exercise
      FROM exercises e
      JOIN workouts w ON e.workoutId = w.id
      WHERE w.userId = ? AND w.name = ?
      ORDER BY e.date DESC;`;

    db.query(query, [userId, workoutName], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results.map(row => row.exercise));
    });
  },

  getExerciseDetailsForWorkout: (userId, workoutName, callback) => {
    const query = `
      SELECT e.exercise, s.setNumber, s.weight, s.reps
      FROM exercises e
      JOIN exercise_sets s ON e.id = s.exerciseId
      JOIN workouts w ON e.workoutId = w.id
      WHERE w.userId = ? AND w.name = ?
      ORDER BY e.date DESC, s.setNumber ASC;`;

    db.query(query, [userId, workoutName], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  createExerciseForWorkout: (userId, workoutName, exerciseData, callback) => {
    const query = `
      INSERT INTO exercises (userId, exercise, workoutId, date)
      VALUES (?, ?, (SELECT id FROM workouts WHERE userId = ? AND name = ?), NOW());`;

    db.query(query, [userId, exerciseData.exercise, userId, workoutName], (err, results) => {
      if (err) {
        return callback(err);
      }

      const exerciseId = results.insertId;
      const setQueries = exerciseData.sets.map(set => {
        return new Promise((resolve, reject) => {
          const setQuery = `
            INSERT INTO exercise_sets (exerciseId, setNumber, weight, reps)
            VALUES (?, ?, ?, ?);`;

          db.query(setQuery, [exerciseId, set.setNumber, set.weight, set.reps], (err, setResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(setResults);
            }
          });
        });
      });

      Promise.all(setQueries)
        .then(() => callback(null, { message: 'Exercise logged successfully' }))
        .catch(err => callback(err));
    });
  }
};

export default Workout;
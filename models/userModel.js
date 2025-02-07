import db from '../database/db.js';

const User = {
  create: (username, email, password, profilePicture, callback) => {
    const query = 'INSERT INTO users (username, email, password, profilePicture) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, password, profilePicture], callback);
  },

  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], callback);
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], callback);
  }
};

export default User;

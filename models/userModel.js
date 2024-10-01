import db from './db.js';

const User = {
  create: (username, password, callback) => {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], callback);
  },

  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], callback);
  }
};

export default User;

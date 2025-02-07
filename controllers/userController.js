import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../database/db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = (req, res) => {
  const { username, password } = req.body;

  // Validate username length
  if (username.length < 8) {
    return res.status(400).json({ error: 'Username must be at least 8 characters long' });
  }

  // Check if username already exists
  User.findByUsername(username, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if password already exists in the database
    const passwordQuery = 'SELECT * FROM users WHERE password = ?';

    db.query(passwordQuery, [password], (err, passwordResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (passwordResults.length > 0) {
        return res.status(400).json({ error: 'Password already in use' });
      }

      // If both checks pass, create the user
      User.create(username, password, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to register' });
        res.status(200).json({ message: 'User registered successfully' });
      });
    });
  });
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, results) => {
    if (err || results.length === 0 || results[0].password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const userId = results[0].id;
  
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '90d' });

    res.status(200).json({ message: 'Login successful', userId, token });
  });
};

import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = (req, res) => {
  const { username, password } = req.body;


  User.create(username, password, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to register' });
    res.status(200).json({ message: 'User registered successfully' });
  });
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;


  User.findByUsername(username, (err, results) => {
    if (err || results.length === 0 || results[0].password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const userId = results[0].id;
  
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

  
    res.status(200).json({ message: 'Login successful', userId, token });
    console.log(userId, token)
  });
};

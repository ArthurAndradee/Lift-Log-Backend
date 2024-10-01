import User from '../models/userModel.js';

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
    res.status(200).json({ message: 'Login successful', userId: results[0].id });
  });
};
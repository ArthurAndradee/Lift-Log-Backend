import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../database/db.js';
import path from 'path';
import fs from 'fs';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password || !req.file) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Store image path
  const profilePicture = `/uploads/${req.file.filename}`;

  // Check if user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkUserQuery, [username, email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Insert new user
    const insertUserQuery = 'INSERT INTO users (username, email, password, profilePicture) VALUES (?, ?, ?, ?)';
    db.query(insertUserQuery, [username, email, password, profilePicture], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register' });

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  User.findByUsername(username, (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Fetch profile picture path from the database
    const getUserQuery = 'SELECT profilePicture FROM users WHERE id = ?';
    db.query(getUserQuery, [user.id], (err, profileResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      let profilePictureBase64 = null;

      if (profileResults.length > 0 && profileResults[0].profilePicture) {
        const profilePicturePath = profileResults[0].profilePicture;
        const absolutePath = path.join(process.cwd(), profilePicturePath);

        if (fs.existsSync(absolutePath)) {
          const imageBuffer = fs.readFileSync(absolutePath);
          profilePictureBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        }
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '90d' });

      res.status(200).json({
        message: 'Login successful',
        userId: user.id,
        username: user.username,
        email: user.email,
        profilePicture: profilePictureBase64, // Return the image as Base64
        token,
      });
    });
  });
};
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Node.js server on Vercel!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

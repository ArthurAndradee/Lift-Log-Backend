const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./app/routes/auth.routes');
const classRoutes = require('./app/routes/classes.routes');
const enrollmentRoutes = require('./app/routes/enrollments.routes');
const fileRoutes = require('./app/routes/files.routes');
const withdrawalRoutes = require('./app/routes/withdrawals.routes');
const userRoutes = require('./app/routes/user.routes');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api', userRoutes);
app.get('/', (req, res) => res.send('E-learning System Backend'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

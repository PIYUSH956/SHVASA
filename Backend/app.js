const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoute');
const eventRoutes = require('./routes/eventRoute');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(error => console.error('Database connection error:', error));

module.exports = app;

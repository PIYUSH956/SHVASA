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

mongoose.connect('mongodb+srv://abpj150:ffGZfBKegIVxWBxx@cluster0.te0io.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(error => console.error('Database connection error:', error));

module.exports = app;

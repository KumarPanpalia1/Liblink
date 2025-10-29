// liblink/server/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

connectDB(); // This should print "MongoDB connected"
const app = express();
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('LibLink Backend is running!');
});

app.listen(5000, () => {
  console.log(' Server running on http://localhost:5000');
});
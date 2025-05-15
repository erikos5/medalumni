const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Connect to Database
connectDB().then(connected => {
  if (!connected) {
    console.log('Note: App will use mock data instead of database');
  }
});

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Make uploads folder accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api', require('./routes/index'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Force port 5006 and ignore any environment variable setting to avoid port conflicts
const PORT = 5006;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

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
app.use(cors({
  origin: process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ extended: false }));
app.use(cookieParser());

// Add debugging middleware
app.use((req, res, next) => {
  if (req.path.includes('/api/events') && req.method === 'POST') {
    console.log('Event creation request received');
    console.log('Headers:', JSON.stringify(req.headers));
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

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

// Force port 5006 for local development but allow Render.com to set its own port
const PORT = process.env.PORT || 5006;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
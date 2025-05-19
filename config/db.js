const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Read MongoDB URI from file if environment variable is not set
    let mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      try {
        const fs = require('fs');
        mongoURI = fs.readFileSync('./mongodb-atlas-uri.txt', 'utf8').trim();
      } catch (err) {
        console.error('Error reading MongoDB URI from file:', err.message);
        mongoURI = 'mongodb://localhost:27017/mediterranean-alumni';
      }
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    console.error('MongoDB connection is required for the application to function properly');
    // Instead of exiting, return false to allow the application to continue with mock data
    return false;
  }
};

module.exports = connectDB; 
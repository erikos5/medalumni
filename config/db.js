const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediterranean-alumni';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    console.log('Server will continue running without database connection');
    return false;
  }
};

module.exports = connectDB; 
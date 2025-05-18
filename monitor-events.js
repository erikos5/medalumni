const mongoose = require('mongoose');
const Event = require('./models/Event');

async function monitorEvents() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mediterranean-alumni');
    console.log('Connected to MongoDB. Monitoring events collection...');
    console.log('Current events:');
    
    const initialEvents = await Event.find().sort({createdAt: -1});
    console.log(`Found ${initialEvents.length} events`);
    
    initialEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event._id})`);
    });
    
    console.log('\nWaiting for new events... Press Ctrl+C to stop monitoring');
    
    // Set up a change stream to monitor for new events
    const changeStream = Event.watch();
    
    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const newEvent = change.fullDocument;
        console.log('\n--- NEW EVENT DETECTED ---');
        console.log('Title:', newEvent.title);
        console.log('ID:', newEvent._id);
        console.log('Date:', newEvent.date);
        console.log('Created At:', newEvent.createdAt);
        console.log('------------------------\n');
      }
    });
    
    // Keep the script running
    // We'll let this run until manually stopped with Ctrl+C
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

monitorEvents(); 
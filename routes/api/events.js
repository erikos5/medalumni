const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const Event = require('../../models/Event');
const User = require('../../models/User');
const { events: mockEvents } = require('../../config/mockData');
const mongoose = require('mongoose');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Using mock events data');
      return res.json(mockEvents);
    }
    
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    // Fallback to mock data
    console.log('Error fetching from DB, using mock events data');
    return res.json(mockEvents);
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Using mock event data');
      const mockEvent = mockEvents.find(
        event => event._id === req.params.id
      );
      
      if (!mockEvent) {
        return res.status(404).json({ msg: 'Event not found' });
      }
      
      return res.json(mockEvent);
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    
    // Fallback to mock data
    const mockEvent = mockEvents.find(
      event => event._id === req.params.id
    );
    
    if (mockEvent) {
      return res.json(mockEvent);
    }
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create a new event
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    isAdmin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        category: req.body.category,
        image: req.body.image,
        registrationEnabled: req.body.registrationEnabled,
        registrationDeadline: req.body.registrationDeadline,
        createdBy: req.user.id
      });

      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Update event fields
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      registrationEnabled,
      registrationDeadline
    } = req.body;
    
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (category) event.category = category;
    if (image) event.image = image;
    if (registrationEnabled !== undefined) event.registrationEnabled = registrationEnabled;
    if (registrationDeadline) event.registrationDeadline = registrationDeadline;
    
    await event.save();
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    await event.remove();
    
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
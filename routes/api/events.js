const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const Event = require('../../models/Event');
const User = require('../../models/User');
const mongoose = require('mongoose');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Only use real data from MongoDB
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events from database:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error('Error fetching event by ID:', err.message);
    
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
    console.log('Event creation endpoint hit');
    console.log('User in request:', req.user);
    console.log('Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors in event creation:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('Creating event with data:', req.body);
      console.log('User ID from token:', req.user.id);
      
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

      console.log('Created new event model:', newEvent);
      const event = await newEvent.save();
      console.log('Event saved to database with ID:', event._id);
      res.json(event);
    } catch (err) {
      console.error('Error creating event:', err.message);
      console.error(err.stack);
      res.status(500).json({ 
        msg: 'Server Error - Could not create event',
        error: err.message
      });
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
    console.log('Attempting to delete event with ID:', req.params.id);
    
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    console.log('Event successfully deleted:', req.params.id);
    res.json({ msg: 'Event removed', id: req.params.id });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router; 
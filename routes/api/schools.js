const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const School = require('../../models/School');
const mongoose = require('mongoose');

// @route   GET api/schools
// @desc    Get all schools
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Only use real data from MongoDB
    const schools = await School.find().sort({ name: 1 });
    res.json(schools);
  } catch (err) {
    console.error('Error fetching schools from database:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/schools/:id
// @desc    Get school by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({ msg: 'School not found' });
    }

    res.json(school);
  } catch (err) {
    console.error('Error fetching school by ID:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'School not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/schools
// @desc    Create a school
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    isAdmin,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, image, departments, programs } = req.body;

      // Check if school already exists
      let school = await School.findOne({ name });

      if (school) {
        return res.status(400).json({ msg: 'School already exists' });
      }

      // Create new school
      school = new School({
        name,
        description,
        image,
        departments: departments || [],
        programs: programs || {
          undergraduate: [],
          postgraduate: [],
          professional: []
        }
      });

      await school.save();

      res.json(school);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/schools/:id
// @desc    Update a school
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    isAdmin,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, image, departments, programs } = req.body;

      // Check if school exists
      let school = await School.findById(req.params.id);

      if (!school) {
        return res.status(404).json({ msg: 'School not found' });
      }

      // Update school
      school = await School.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name,
            description,
            image,
            departments: departments || school.departments,
            programs: programs || school.programs
          }
        },
        { new: true }
      );

      res.json(school);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'School not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/schools/:id
// @desc    Delete a school
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    // Check if school exists
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({ msg: 'School not found' });
    }

    // Delete school using findByIdAndDelete instead of remove
    await School.findByIdAndDelete(req.params.id);

    res.json({ msg: 'School removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'School not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/schools/:id/departments
// @desc    Add department to school
// @access  Private/Admin
router.post(
  '/:id/departments',
  [
    auth,
    isAdmin,
    [
      check('name', 'Department name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description } = req.body;

      // Check if school exists
      const school = await School.findById(req.params.id);

      if (!school) {
        return res.status(404).json({ msg: 'School not found' });
      }

      // Check if department already exists
      const departmentExists = school.departments.find(
        dept => dept.name === name
      );

      if (departmentExists) {
        return res.status(400).json({ msg: 'Department already exists' });
      }

      // Add department
      school.departments.push({ name, description });
      await school.save();

      res.json(school);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'School not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router; 
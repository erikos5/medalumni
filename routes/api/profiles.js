const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const registeredOrApplied = require('../../middleware/registeredOrApplied');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const School = require('../../models/School');
const mongoose = require('mongoose');

// @route   GET api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'email'])
      .populate('school', ['name']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/profiles
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    registeredOrApplied,
    [
      check('school', 'School is required').not().isEmpty(),
      check('graduationYear', 'Graduation year is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      graduationYear,
      degree,
      bio,
      location,
      currentPosition,
      company,
      website,
      skills,
      linkedin,
      twitter,
      facebook,
      instagram,
      profileImage
    } = req.body;

    // Build profile object
    const profileFields = {
      user: req.user.id,
      school,
      graduationYear,
      degree,
      bio,
      location,
      currentPosition,
      company,
      website,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
      profileImage
    };

    // Build social object
    profileFields.social = {};
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profiles
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('user', ['name', 'email'])
      .populate('school', ['name'])
      .sort({ date: -1 });

    res.json(profiles);
  } catch (err) {
    console.error('Error fetching profiles from database:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id })
      .populate('user', ['name', 'email'])
      .populate('school', ['name']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile by user ID:', err.message);
    
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/profiles/school/:school_id
// @desc    Get profiles by school
// @access  Public
router.get('/school/:school_id', async (req, res) => {
  try {
    const profiles = await Profile.find({
      school: req.params.school_id
    }).populate('user', ['name', 'avatar', 'role']).populate('school', ['name', 'description']);

    if (!profiles.length) {
      return res.status(400).json({ msg: 'No profiles found for this school' });
    }

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No profiles found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profiles/approve/:id
// @desc    Approve a profile status
// @access  Private/Admin
router.put('/approve/:id', [auth, isAdmin], async (req, res) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    // Update status to approved
    profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'approved' } },
      { new: true }
    );

    // Also update the user role to registeredAlumni
    await User.findByIdAndUpdate(
      profile.user,
      { $set: { role: 'registeredAlumni' } }
    );

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profiles
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth_mw');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const axios = require('axios');

//@route    - GET /api/profile/me
//@desc     - Gets one specific profile
//@Access   - Private
/* The user would log in and would be authenticated and the token would have the userID 
which can be used to fetch the profile. 
 */
router.get('/me', auth, async (req, res) => {
  try {
    /* user here pertains to the user field in the Profile model which is of type ObjectId. 
    This id is available in req obj as the auth_mw has updated it. SO when the MW is parsed we have the id here
    through jwt.verify method there which gets the Id from the token sent
    The populate method is used to populate specific fields. Here our name and avatar is in User model so 
    we also populate through Profile model it here as they are available in req.user obj.
    Populate - first arg is from whom (i.e user obj ) and second arg is a array of fields that needs to be 
    populated. FindOne finds a user with that user.id and populate will update the name and avatar fom user*/
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name, avatar']
    );

    console.log(req.user);
    console.log('Profile:' + profile);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user ID' });
    }

    console.log(profile);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error...');
  }
});

//@route    - POST /api/profile
//@desc     - Creates a new profile for an existing user or updates the profile of existing user
//@Access   - Private
/*
 */

router.post(
  '/',
  [
    auth,
    [
      check('skills', 'Skills are required to be filled').notEmpty(),
      check('status', 'Status/Working level detail is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    ///destructure the req
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      ...rest
    } = req.body;

    //Build profile
    const profileFields = {
      user: req.user.id,
      website: website,
      //website: website && website !== '' ? normalize(website) : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      ...rest,
    };

    //Build social obj
    const socialFields = { twitter, youtube, instagram, linkedin, facebook };

    //To Do: Update the obj such that it is part of socialFields only if input is present
    for (const [key, value] of Object.entries(socialFields)) {
      if (value) socialFields[key] = value;
    }

    profileFields.social = socialFields;

    try {
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );

      console.log('User: ' + req.user.id);

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error ');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get a profile from user_id
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    console.log(profile);
    if (!profile) {
      console.log('No Profile found');
      return res.status(400).json({ msg: 'No user found with the given ID' });
    }
    return res.send(profile);
  } catch (err) {
    console.error(err.message);
    console.log(err.kind);
    /*if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    */
    return res.status(500).send('Server Error..');
  }
});

// @route    DELETE api/profile/
// @desc     Delete a profile, user and posts
// @access   Private
/* MW is needed as we need req.user.i. Can use Promise.all here as aew doing same operations */
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.status(200).json({ msg: 'Removed the user' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Delete Failed, server error');
  }
});

// @route    PUT api/profile/experience
// @desc     Update experience details
// @access   Private

router.put(
  '/experience',
  [
    auth,
    [
      (check('title', 'Title is required').notEmpty(),
      check('company', 'company is required').notEmpty(),
      check('from', 'From date is required').notEmpty()),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ...rest } = req.body;
    console.log(req.body);

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete a experience detail
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    //First get the profile to delete and then use the params to delete exp
    const profile = await Profile.findOne({ user: req.user.id });

    // Exp is an array, so this code takes in each exp object and  checks the expp._id (which is the actual
    // document id of that exp) and then returns all not matching exps
    //Only the matching exp will  be filtered out and the array will be updated
    //_id is an special type so for checking we need to convert it to string
    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await profile.save();
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/education
// @desc     Update education details
// @access   Private

router.put(
  '/education',
  [
    auth,
    [
      (check('degree', 'Degree is required').notEmpty(),
      check('fieldofstudy', 'fieldofstudy is required').notEmpty()),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(req.body);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/education/edu_id
// @desc     Delete an edu detail
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    //First get the profile to delete and then use the params to delete exp
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );

    await profile.save();
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

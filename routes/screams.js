const router = require('express').Router();
let Scream = require('../models/scream.model');

router.route('/').get(async (req, res) => {
  try {
    const screams = await Scream.find();
    res.json(screams);
  } catch (err) {
    res.json(err);
  }
});

router.route('/postScream').post(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed' });
  }
  const newScream = new Scream({
    body: req.body.body,
    userHandle: req.body.handle,
    userImage: req.body.imageUrl,
    createdAt: new Date(),
    likeCount: 0,
    commentCount: 0,
  });

  try {
    await newScream.save();
    res.json('Scream posted');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.route('/:screamId').get(async (req, res) => {
  try {
    const scream = await Scream.findOne({ _id: req.params.screamId });
    if (!scream) {
      return res.status(400).json({ error: 'Scream not found' });
    }
    res.json(scream);
  } catch (err) {
    console.log('Err', err);
    res.status(400).json({ error: err });
  }
});

module.exports = router;

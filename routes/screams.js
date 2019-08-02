const router = require('express').Router();
let Scream = require('../models/scream.model');
let Comment = require('../models/comment.model');
const FBAuth = require('../util/fbAuth');

router.route('/').get(async (req, res) => {
  try {
    const screams = await Scream.find();
    res.json(screams);
  } catch (err) {
    res.json(err);
  }
});

//post one scream
router.route('/').post(FBAuth, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed' });
  }
  const newScream = new Scream({
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
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
  let screamData = {};
  try {
    const scream = await Scream.findOne({ _id: req.params.screamId });
    if (!scream) {
      return res.status(400).json({ error: 'Scream not found' });
    }
    screamData.scream = scream;

    const comments = await Comment.find({ screamId: req.params.screamId });
    screamData.comments = [];
    comments.forEach(comment => {
      screamData.comments.push(comment);
    });
    console.log('comments', screamData);
    res.json(screamData);
  } catch (err) {
    console.log('Err', err);
    res.status(400).json({ error: err });
  }
});

router.route('/:screamId/comment').post(FBAuth, async (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ comment: 'Must not be empty' });
  }

  const newComment = new Comment({
    body: req.body.body,
    createdAt: new Date(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  });

  try {
    const scream = await Scream.findOne({ _id: req.params.screamId });
    if (!scream) {
      return res.status(400).json({ error: 'Scream not found.' });
    }
    await Scream.findByIdAndUpdate(req.params.screamId, {
      commentCount: scream.commentCount + 1,
    });

    await newComment.save();

    res.json(newComment);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});
module.exports = router;

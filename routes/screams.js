const router = require('express').Router();
let Scream = require('../models/scream.model');

router.route('/').get((req, res) => {
  Scream.find()
    .then(screams => res.json(screams))
    .catch(err => res.json(err));
});

router.route('/postScream').post((req, res) => {
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

  newScream
    .save()
    .then(() => res.json('Scream posted'))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.route('/getScream/:screamId').get((req, res) => {
  Scream.find({ _id: req.params.screamId })
    .then(scream => res.json(scream))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

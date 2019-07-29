const router = require('express').Router();
const jwt = require('jsonwebtoken');
const FBAuth = require('../util/fbAuth');
let User = require('../models/user.model');
let Scream = require('../models/scream.model');

// Get authenticated user
router.route('/').get(FBAuth, (req, res) => {
  console.log('req', req);
  User.find({ handle: req.user.handle })
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/signup').post((req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
    createdAt: new Date(),
    imageUrl: '',
  });

  // TODO: Validate

  newUser
    .save()
    .then(() => res.json('User added'))
    .catch(err => {
      if (err.code === 11000) {
        return res.status(400).json({ email: 'Email is already in use' });
      } else {
        res
          .status(500)
          .json({ general: 'Something went wrong, please try again.' });
      }
    });
});

router.route('/login').post((req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  //TODO: Validate email

  User.findOne({ email: data.email })
    .then(user => {
      if (data.password === user.password) {
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY);

        res.status(200).json({
          token,
        });
      } else {
        res.status(400).json({ general: 'Wrong credentials' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({ error: err });
    });
});

// Get any user details
router.route('/:handle').get((req, res) => {
  let userData = {};
  User.find({ handle: req.params.handle })
    .then(user => {
      userData.user = user;
      return Scream.find({ userHandle: req.params.handle });
    })
    .then(scream => {
      userData.screams = [];
      scream.forEach(doc => {
        userData.screams.push({
          body: doc.body,
          createdAt: doc.createdAt,
          userHandle: doc.userHandle,
          userImage: doc.userImage,
          likeCount: doc.likeCount,
          commentCount: doc.commentCount,
          screamId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch(err => res.status(500).json({ error: err }));
});

router.route('/:handle').post(FBAuth, (req, res) => {
  if (req.user.handle && req.user.handle === req.params.handle) {
    User.findOneAndUpdate({ handle: req.params.handle }, req.body)
      .then(user => res.json(user))
      .catch(err => res.status(500).json({ error: err }));
  } else {
    return res.status(400).json({ error: 'Invalid token' });
  }
});

module.exports = router;

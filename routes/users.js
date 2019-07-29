const router = require('express').Router();
const jwt = require('jsonwebtoken');
const FBAuth = require('../util/fbAuth');
let User = require('../models/user.model');

router.route('/').get(FBAuth, (req, res) => {
  console.log('req', req);
  User.find()
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

module.exports = router;

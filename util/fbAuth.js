const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    const tokenKey = process.env.TOKEN_KEY;
    idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      jwt.verify(idToken, tokenKey, (err, payload) => {
        console.log('Payload: ', payload);
        if (payload) {
          User.findById(payload.userId).then(doc => {
            req.user = doc;
            next();
          });
        } else {
          res.status(403).json({ error: 'Invalid token' });
        }
      });
    } catch (err) {
      res.status(403).json({ error: 'Error verifying token' });
    }
  } else {
    console.log('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }
};

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //Get the token from the headers
  const token = req.header('x-auth-token');

  //Check if there is no token, send  a not auth status
  if (!token) {
    return res.status(401).json({ msg: 'No token received, Auth denied' });
  }

  //Verify the token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    /* See using string here instead of obj */
    req.user = decoded.user;
    console.log('In auth MW: ' + decoded.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

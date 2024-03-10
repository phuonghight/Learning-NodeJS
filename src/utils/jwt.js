const jwt = require("jsonwebtoken");

const config = require("../config/config");
const { constants } = require("../constant");

const generateToken = (user) => {
  return {
    accessToken: jwt.sign(
      {
        sub: user.id,
        type: `${constants.tokenType} Token`,
      },
      config.jwt.secret,
      { expiresIn: `${config.jwt.accessExpMinutes}m` }
    ),
    type: `${constants.tokenType} Token`,
  };
};
const verifyToken = (token) =>
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (!decoded) {
      return err;
    }
    return decoded;
  });

module.exports = { generateToken, verifyToken };

const jwt = require("jsonwebtoken");
exports.createJWT = (email, userid, duration) => {
  const payload = {
    email,
    userid,
    duration,
  };
  return jwt.sign(payload, process.env.TOKEN, {
    expiresIn: duration,
  });
};

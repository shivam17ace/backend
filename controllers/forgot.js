const User = require("../models/index");
require("dotenv").config();
const bcrypt = require("bcrypt");
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const crypto = require("crypto");
const sendEmail = require("../util/mail");
exports.forgot = (req, res, next) => {
  let { email } = req.body;
  let errors = [];
  if (!email) {
    errors.push("email required");
  }
  if (!emailRegxp.test(email)) {
    errors.push("invalid email");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      res
        .status(500)
        .send({ message: "User With This Mail Adress Is Not Found" });
    } else {
      user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordExpires = Date.now() + 300000;
      user.save();
    }
    const link = `${process.env.DATABASE}/resetPassword/${user._id}/${user.resetPasswordToken}`;
    const link1 =
      "http://" +
      req.headers.host +
      `/resetPassword/${user._id}/${user.resetPasswordToken}`;
    console.log(link1);
    sendEmail(user.email, "Password reset", link);
    res.send("password reset link sent to your email account");
  });
};

exports.resetPassword = (req, res, next) => {
  User.findById(req.params.userId).then((user) => {
    if (!user) {
      res.status(400).send("Invalid Link OR Link Expired");
    } else {
      User.findOne({
        resetPasswordToken: req.params.resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
      }).then((user) => {
        user.password = req.body.password;
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) throw err;
            user.password = hash;
            user.save();
            console.log(user.password);
            res.status(201).send(user);
          });
        });
      });
    }
  });
};

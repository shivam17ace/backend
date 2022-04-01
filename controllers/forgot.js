const User = require("../models/index");
require("dotenv").config();
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../util/mail");
const token = require("../models/token");
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
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res
          .status(500)
          .send({ message: "User With This Mail Adress Is Not Found" });
      } else {
        Token.findOne({ userId: user._id })
          .then((data) => {
            if (!data) {
              const token = new Token({
                userId: user._id,
                email: req.body.email,
                token: crypto.randomBytes(32).toString("hex"),
              });
              token.save();
            }
            const link = `${process.env.DATABASE}/resetPassword/${user._id}/${data.token}`;
            const link1 =
              "http://" +
              req.headers.host +
              `/resetPassword/${user._id}/${data.token}`;
            console.log(link1);
            sendEmail(user.email, "Password reset", link);
            res.send("password reset link sent to your email account");
          })
          .catch((err) => {
            res.send("Error Occured");
          });
      }
    })
    .catch((err) => {
      err;
    });
};
exports.resetPassword = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(400).send("Invalid Link OR Link Expired");
      } else {
        Token.findOne({ userId: user._id, token: req.params.token })
          .then((user) => {
            console.log(req.params.token);
            console.log(user._id);
            user.password = req.body.password;
            user.save();
            // token.delete();
            console.log(user.password);
            res.status(201).send(user);
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      }
    })
    .catch((error) => {
      error;
    });
};

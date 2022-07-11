const User = require("../../models/user");
const bcrypt = require("bcrypt");
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  let { name, email, password, confirm_password } = req.body;
  let errors = [];
  if (!name) {
    errors.push("name required");
  }
  if (!email) {
    errors.push("email required");
  }
  if (!emailRegxp.test(email)) {
    errors.push("invalid email");
  }
  if (!password) {
    errors.push("password required");
  }
  if (!confirm_password) {
    errors.push({
      confirm_password: "required",
    });
  }
  if (password != confirm_password) {
    errors.push("password mismatch");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res
          .status(422)
          .json({ errors: [{ user: "email already exists" }] });
      } else {
        const users = new User({
          name: name,
          email: email,
          password: password,
        });
        const token = jwt.sign(
          { userId: users._id, users },
          process.env.TOKEN,
          {
            expiresIn: "1d",
          }
        );
        users.token = token;
        // save user token

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            users.password = hash;
            users
              .save()
              .then((response) => {
                res.status(200).json({
                  success: true,
                  result: response,
                  token,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  errors: [{ error: err }],
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ error: "Something went wrong" }],
      });
      console.log(err);
    });
};

exports.login = (req, res, next) => {
  let { username, password } = req.body;
  let email = username;
  let errors = [];
  if (!email) {
    errors.push({ email: "email required" });
  }
  if (!emailRegxp) {
    errors.push({ email: "invalid email" });
  }
  if (!password) {
    errors.push({ password: "password required" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ errors: [{ user: "User not found" }] });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (!match) {
              return res
                .status(404)
                .json({ errors: [{ password: "Incorrect Password" }] });
            }
            const token = jwt.sign(
              { userId: user._id, user },
              process.env.TOKEN,
              {
                expiresIn: "1d",
              }
            );
            User.findByIdAndUpdate(user._id, { token })
              .then((user) => {
                res.status(200).json({
                  data: { id: user._id, email: user.email, role: user.role },
                  token,
                });
              })
              .catch((err) => {
                next(err);
                console.log(err);
              });
          })
          .catch((err) => {
            res.status(502).json({ errors: err });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.status(502).json({ errors: err });
    });
};

exports.logout = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  const payload = {};
  jwt.sign(payload, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      console.log(logout);
      res.send({ msg: "You have been Logged Out" + payload });
    } else {
      res.send({ msg: "Error" });
    }
  });
};

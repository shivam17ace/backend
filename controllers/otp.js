const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User = require("../models/user");
const Otp = require("../models/otp");
const _ = require("lodash");

/*  SIGNUP USING OTP     One issue */
module.exports.otpsignup = (req, res, next) => {
  let { phone } = req.body;
  let errors = {};
  if (!phone) {
    errors.push("Phone No. Required");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ phone: phone })
    .then((user) => {
      if (user) {
        res.status(400).send("User Already Registered..");
      } else {
        const OTP = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        console.log(OTP);
        /*  to send otp as a sms use local sms gateway {

        } */

        const user = new User({
          phone: phone,
          otp: OTP,
          source: "OTP",
        });
        const accessToken = jwt.sign(
          { userId: user._id, user },
          process.env.TOKEN,
          {
            expiresIn: "1d",
          }
        );
        user.accessToken = accessToken;

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(user.otp, salt, function (err, hash) {
            if (err) throw err;
            user.otp = hash;
            user.save();
            res.status(200).json({
              message: "OTP SEND SUCESSFULLY  :" + OTP,
            });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

/*  LOGIN USING OTP  */
module.exports.otplogin = (req, res, next) => {
  let { phone } = req.body;
  let errors = {};
  if (!phone) {
    errors.push("Phone No. Required");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.find({ phone: phone })
    .then((otp) => {
      if (otp.length === 0) {
        return res.status(400).send("OTP Expired");
      }
      const rightOtpFind = otp[otp.length - 1];
      bcrypt
        .compare(req.body.otp, rightOtpFind.otp)
        .then((match) => {
          if (match) {
            if (rightOtpFind.phone === req.body.phone) {
              const user = new User(_.pick(req.body, ["phone"]));
              const accessToken = jwt.sign(
                { userId: user._id, user },
                process.env.TOKEN,
                {
                  expiresIn: "1d",
                }
              );
              User.findByIdAndUpdate(user._id, { accessToken })
                .then((user) => {
                  res.status(200).json({
                    data: user,
                    accessToken,
                  });
                })
              user.save();
              User.deleteMany({ phone: rightOtpFind.phone });
              return res.status(200).send({
                message: "USer Registration Sucessfull",
                accessToken: accessToken,
                data: user,
              });
            }
          } else {
            res.status(400).send("Otp didnt matched");
          }
        })
        .catch((error) => {
          res.status(500).json({ error });
          console.log(error);
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
      console.log(error);
    });
};

exports.otplogout = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  const payload = {};
  jwt.sign(payload, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      console.log(logout);
      res.send({ msg: "You have been Logged Out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
};

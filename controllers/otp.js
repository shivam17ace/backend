const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User = require("../models/user");
const _ = require("lodash");

/*  SIGNUP USING OTP     One issue */
module.exports.otpsignup = (req, res, next) => {
  let { phone } = req.body;
  let errors = {};
  if (!phone) {
    errors.push("Phone No. Required");
  }
  if (errors.length > 0) {
    res.status(422).json({ errors: errors });
  }
  User.findOne({ phone: phone })
    .then((user) => {
      if (user) {
        // res.status(400).send("User Already Registered..");
        const OTP = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        console.log(OTP);
        User.findByIdAndUpdate(user._id, { otp: OTP }, { new: true })
          .then((data) => {
            res.status(200).json({
              data: data,
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
            console.log(err);
          });
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
        const token = jwt.sign(
          { userId: user._id, user },
          process.env.TOKEN,
          {
            expiresIn: "1d",
          }
        );
        user.token = token;
        user.save();
        res.status(200).json({
          message: "OTP SEND SUCESSFULLY  :" + OTP,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

/*  VERIFY OTP  */
module.exports.verifyotp = (req, res, next) => {
  let { phone } = req.body;
  let errors = {};
  if (!phone) {
    errors.push("Phone No. Required");
  }
  if (errors.length > 0) {
    res.status(422).json({ errors: errors });
  }
  User.find({ phone: phone })
    .then((otp) => {
      if (otp.length === 0) {
        res.status(400).send("OTP Expired");
      }
      const rightOtpFind = otp[otp.length - 1];
      if (req.body.otp === rightOtpFind.otp) {
        if (rightOtpFind.phone === req.body.phone) {
          // res.status(200).send(otp);
          // const user = new User(_.pick(req.body, ["phone"]));
          // User.findById(user._id).then((dta) => res.json({ message: dta }));
          // console.log(user._id);
          // user.save();
          const token = jwt.sign(
            { userId: otp[0]._id, otp },
            process.env.TOKEN,
            {
              expiresIn: "1d",
            }
          );
          User.findByIdAndUpdate(
            otp[0]._id,
            { token: token },
            { new: true }
          ).then((user) => {
            res.status(200).json({
              data: user,
              token,
            });
          });

          // // User.deleteMany({ phone: rightOtpFind.phone });
          res.status(200).json({
            message: "USer Registration Sucessfull",
            token: token,
            data: otp,
          });
        }
      } else {
        res.status(400).send("Otp didnt matched");
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

// /* OTP LOGIN */
// exports.otplogin = (req, res, next) => {
//   let { phone } = req.body;
//   let errors = {};
//   if (!phone) {
//     errors.push("Phone No. Required");
//   }
//   if (errors.length > 0) {
//      res.status(422).json({ errors: errors });
//   }
//   User.findOne({ phone: phone })
//     .then((user) => {
//       const OTP = otpGenerator.generate(6, {
//         digits: true,
//         lowerCaseAlphabets: false,
//         upperCaseAlphabets: false,
//         specialChars: false,
//       });
//       console.log(OTP);
//       User.findByIdAndUpdate(user._id, { otp: OTP }, { new: true })
//         .then((data) => {
//           res.status(200).json({
//             data:data
//           })
//           // User.find({phone:phone})
//           // .then((otp)=>{
//           //   if (otp.length === 0) {
//           //      res.status(400).send("OTP Expired");
//           //   }
//           //   const rightOtpFind = otp[otp.length - 1];
//           //   if (req.body.otp === rightOtpFind.otp) {
//           //     if (rightOtpFind.phone === req.body.phone) {
//           //       const user = new User(_.pick(req.body, ["phone"]));
//           //       const token = jwt.sign(
//           //         { userId: user._id, user },
//           //         process.env.TOKEN,
//           //         {
//           //           expiresIn: "1d",
//           //         }
//           //       );
//           //       User.findByIdAndUpdate(user._id, { token }).then((user) => {
//           //         res
//           //           .status(200)
//           //           .json({
//           //             data: user,
//           //             token,
//           //           })
//           //           .catch((err) => {
//           //             res.status(400).json({ error: err });
//           //           });
//           //       });
//           //       user.save();
//           //       // User.deleteMany({ phone: rightOtpFind.phone });
//           //        res.status(200).send({
//           //         message: "USer Registration Sucessfull",
//           //         token: token,
//           //         data: user,
//           //       });
//           //     }
//           //   } else {
//           //     res.status(400).send("Otp didnt matched");
//           //   }
//           // })
//           // .catch((err)=>{
//           //   res.status(500).json({
//           //     error: err,
//           //   });
//           //   console.log(err);
//           // })
//         })
//         .catch((err) => {
//           res.status(500).json({
//             error: err,
//           });
//           console.log(err);
//         });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//       console.log(err);
//     });
// };

/* OTP LOGOUT */
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

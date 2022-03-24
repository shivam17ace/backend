const User = require("../models/index");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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
        return res.status(401).json({
          message:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again.",
        });
      } else {
        user.generatePasswordReset();
        user
          .save()
          .then((user) => {
            let token = user.resetPasswordToken;
            let link =
              "http://" +
              req.headers.host +
              `/resetPassword?resetPasswordtoken=${token}`;
            console.log(link);
            const mailOptions = {
              to: user.email,
              from: process.env.FROM_EMAIL,
              subject: "Password change request",
              text: `Hi ${user.email} \n 
              Please click on the following link ${link} to reset your password. \n\n 
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            sgMail.send(mailOptions, (result, error) => {
              if (result) {
                res.status(200).json({
                  message: "A reset email has been sent to " + user.email + ".",
                });
              } else {
                return res.status(500).json({ message: error.message });
              }
            });
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
// exports.reset = (req, res) => {
//   User.findOne({
//     resetPasswordToken: resetPasswordToken,
//     resetPasswordExpires: { $gt: new Date() },
//   })
//     .then((user) => {
//       console.log(resetPasswordToken);
//       if (!user)
//         return res
//           .status(401)
//           .json({ message: "Password reset token is invalid or has expired." });
//       res.render("reset", { user });
//     })
//     .catch((err) => res.status(500).json({ message: err.message }));
// };
exports.resetPassword = (req, res) => {
  let { password } = req.body;
  let { resetPasswordToken } = req.params;
  User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: { $gt: new Date() },
  }).then((user) => {
    console.log(req.params.token);
    console.log(token);
    if (!user) {
      return res.status(401).json({
        message: "Password reset token is invalid or has been expired.",
      });
    } else {
      //Set  new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save
      user.save((err) => {
        if (err) return res.status(500).json({ message: err.message });

        // send email
        const mailOptions = {
          to: user.email,
          from: process.env.FROM_EMAIL,
          subject: "Your password has been changed",
          text: `Hi ${user.username} \n 
                    This is a confirmation that the password for your account ${user.email} has just been changed.\n`,
        };

        sgMail.send(mailOptions, (result, error) => {
          if (result) {
            res
              .status(200)
              .json({ message: "Your password has been updated." });
          } else {
            return res.status(500).json({ message: error.message });
          }
        });
      });
    }
  });
};

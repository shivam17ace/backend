// const passport = require("passport");
// const facebookStrategy = require("passport-facebook").Strategy;
// const User = require("../models/index");
// passport.use(
//   new facebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       passReqToCallback: true,
//     },
//     function (request, acessToken, refreshToken, profile, done) {
//       console.log(profile);
//       //   return done(profile, null);
//       const user = new User({});
//       User.findOne({ email: user.email })
//         .then((data) => {
//           user.save();
//         })
//         .catch((error) => {
//           res.status(500).json({ err: error });
//         });
//     }
//   )
// );
// passport.serializeUser((user, cb) => {
//   cb(user, null);
// });

// passport.deserializeUser((obj, cb) => {
//   cb(obj, null);
// });
// (module.exports.passport1 = passport.authenticate("facebook", {
//   scope: ["publish_actions", "profile", "email"],
// })),
//   (req, res, next) => {
//     next();
//   };

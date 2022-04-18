const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      passReqToCallback: true,
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "email",
      ],
    },
    function (request, acessToken, refreshToken, profile, done) {
      console.log(profile);
    //   const newuser = new User({
    //     googleId: profile.id,
    //     displayName: profile.displayName,
    //     firstName: profile.name.givenName,
    //     lastName: profile.name.familyName,
    //     image: profile.photos[0].value,
    //     email: profile.emails[0].value,
    //     source: "google",
    //   });
    //   User.findOne({ email: newuser.email })
    //     .then((data) => {
    //       if (data) {
    //         done(null, data);
    //       } else {
    //         data = User.create(newuser);
    //         done(null, data);
    //       }
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ err: error });
    //     });
    }
  )
);
// passport.serializeUser(function (newuser, done) {
//   console.log(newuser);
//   done(null, newuser.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

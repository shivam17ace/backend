const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");
const User = require("../models/index");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, acessToken, refreshToken, profile, done) {
      console.log(profile);
      //   return done(profile, null);
      const newuser = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
        email: profile.emails[0].value,
        source: "google",
      });
      User.findOne({ email: newuser.email })
        .then((data) => {
          if (data) {
            done(null, data);
          } else {
            data = User.create(newuser);
            done(null, data);
          }
        })
        .catch((error) => {
          res.status(500).json({ err: error });
        });
    }
  )
);
passport.serializeUser(function (newuser, done) {
  console.log(newuser);
  done(null, newuser.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

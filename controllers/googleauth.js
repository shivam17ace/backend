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
      const user = new User({
        id: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePhoto: profile.photos[0].value,
        source: "google",
      });
      User.findOne({email:user.email})
      .then((data)=>{
          user.save();
      })
      .catch((error)=>{res.status(500).json({err:error})});
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(user, null);
});

passport.deserializeUser((obj, cb) => {
  cb(obj, null);
});
(module.exports.passport = passport.authenticate("google", {
  scope: ["profile", "email"],
})),
  (req, res, next) => {
    next();
  };

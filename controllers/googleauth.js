const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      const newuser = new User({
        id: profile.id,
        name: profile.displayName,
        image: profile.photos[0].value,
        email: profile.emails[0].value,
        source: "google",
      });
      if(newuser){
        const accessToken = jwt.sign(
          { userId: newuser._id, newuser },
          process.env.TOKEN,
          {
            expiresIn: "1d",
          }
        );
        User.findOneAndUpdate({email:newuser.email},{accessToken:accessToken})
        .then((data)=>{
          console.log(data)
        })
        .catch((err)=>{
          console.log(err)
        })
      }
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
  // console.log(newuser);
  done(null, newuser.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

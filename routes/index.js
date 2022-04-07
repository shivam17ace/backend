const express = require("express");
const router = express.Router();
const passport = require("passport");
const { signup, login, logout } = require("../controllers/Authentication/user");
const { forgot, resetPassword } = require("../controllers/forgot");
const { uploadimage } = require("../controllers/image");
const { upload } = require("../controllers/image");
const { create, update, findall, find } = require("../controllers/update");
const { del, delall } = require("../controllers/status");
const { otpsignup, otplogin, otplogout } = require("../controllers/otp");
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot", forgot);
router.post("/resetPassword/:userId/:token", resetPassword);
router.post("/uploadimage/:id", upload, uploadimage);
router.post("/otpsignup", otpsignup);
router.post("/otplogin", otplogin);
router.post("/otplogout", otplogout);
router.post("/createuser", create);
router.put("/update/:id", update);
router.put("/delete/:id", del);
router.get("/users", findall);
router.get("/user/:id", find);
router.put("/deleteall", delall);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res, next) => {
    res.redirect("/");
  }
);
router.post("/authlogout", function (req, res) {
  req.logout();
  res.redirect("/");
});
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
  })
);
module.exports = router;

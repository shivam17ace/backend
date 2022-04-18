const express = require("express");
const router = express.Router();
const passport = require("passport");
const { signup, login, logout } = require("../controllers/Authentication/user");
const { forgot, resetPassword } = require("../controllers/forgot");
const { uploadimage } = require("../controllers/image");
const { upload } = require("../controllers/image");
const { uploadCsv } = require("../controllers/uploadcsv");
const { create, update, findall, find  } = require("../controllers/update");
const rolehandler = require("../controllers/rolehandler");
const { del, delall } = require("../controllers/status");
const {
  otpsignup,
  verifyotp,
  // otplogin,
  otplogout,
} = require("../controllers/otp");
const {uploadcsv} = require("../controllers/uploadcsv");
const {downloadcsv} = require("../controllers/downloadcsv");
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot", forgot);
router.post("/resetPassword/:userId/:token", resetPassword);
router.post("/uploadimage/:id", upload, uploadimage);
router.post("/otpsignup", otpsignup);
router.post("/otpverify", verifyotp);
router.post("/otplogout", otplogout);
router.post("/createuser",rolehandler.grantAccess("createAny", "profile"), create);
router.put(
  "/update/:id",
  rolehandler.grantAccess("updateOwn", "profile"),
  update
);
router.put(
  "/delete/:id",
  rolehandler.grantAccess("deleteOwn", "profile"),
  del
);
router.get(
  "/users",
  rolehandler.grantAccess("readAny", "profile"),
  findall
);
router.get("/user/:id", find);
router.put(
  "/deleteall",
  rolehandler.grantAccess("deleteAny", "profile"),
  delall
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" ,
  session: false
}),
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
    session: false
  })
);
router.post("/upload-csv",uploadCsv,uploadcsv);
router.get("/downloadcsv",downloadcsv);
module.exports = router;

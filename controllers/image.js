// const Image = require("../models/image");
const User = require("../models/index");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
});
(module.exports.upload = upload.single("image")),
  (req, res, next) => {
    next();
  };
/* Loader module */
exports.uploadimage = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      image: req.file.path,
    },
    { new: true },
    (err, doc) => {
      console.log(doc);
      if (err) throw err;
      else {
        res.json(doc);
      }
    }
  );
};

/*
  // User.findOne({ id: req.params.id }).then((user) => {
  //   Image.findOne({ userID: user._id }).then((data) => {
  //     const image = new Image({
  //       userId: user._id,
  //       image: req.file.path,
  //     });
  //     image
  //       .save()
  //       .then((response) => {
  //         console.log(req.file);
  //         res.status(201).json({
  //           sucess: true,
  //           message: "image added sucessfully",
  //         });
  //       })
  //       .catch((err) => {
  //         res.status(400).json({
  //           err: err,
  //         });
  //       });
  //   });
  
  // });
*/

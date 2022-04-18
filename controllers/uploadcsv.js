const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const csv = require("csvtojson");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({ storage: storage });
(module.exports.uploadCsv = uploads.single("csv")),
  (req, res, next) => {
    next();
  };
exports.uploadcsv = (req, res, next) => {
  csv()
    .fromFile(req.file.path)
    .then((csvData) => {
      User.insertMany(csvData, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(csvData);
        }
      });
      res.send(csvData);
    });
};

const User = require("../models/index");
/* Delete Single User By Id */
exports.del = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      status: 0,
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

/* DElete all User */

exports.delall = (req, res, next) => {
  User.updateMany({}, { status: 0 }, { new: true }, (err, doc) => {
    console.log(doc);
    if (err) throw err;
    else {
      res.json(doc);
    }
  });
};

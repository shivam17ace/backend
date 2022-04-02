const User = require("../models/index");
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/* Create User (ADMIN)  */
exports.create = (req, res, next) => {
  let { name, email, roll, phone, password, confirm_password } = req.body;
  let errors = [];
  if (!name) {
    errors.push("name required");
  }
  if (!email) {
    errors.push("email required");
  }
  if (!emailRegxp.test(email)) {
    errors.push("invalid email");
  }
  if (!password) {
    errors.push("password required");
  }
  if (!confirm_password) {
    errors.push({
      confirm_password: "required",
    });
  }
  if (password != confirm_password) {
    errors.push("password mismatch");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res
        .status(422)
        .json({ errors: [{ user: "email already exists" }] });
    } else {
      const user = new User({
        name: name,
        email: email,
        password: password,
        confirm_password: confirm_password,
        roll: roll,
        phone: phone,
      });
      user
        .save()
        .then((response) => {
          res.status(200).json({
            success: true,
            result: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            errors: [{ error: err }],
          });
        });
    }
  });
};

/* GET User */
// User.findOne({ id: req.params.id, status: 1 })
exports.find = (req, res) => {
  User.findById(req.params.id)
    .where("status")
    .equals(true)
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        console.log("error returned");
        res.send(500, { error: "Failed to fetch user details" });
      }

      if (!data) {
        res.status(403).send({ error: " Failed" });
      }

      res.status(200).send(data);
      console.log("Data Fetched");
    });
};

/* Update User */
exports.update = (req, res, next) => {
  let { email } = req.body;
  let errors = [];
  if (!emailRegxp.test(email)) {
    errors.push("invalid email");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: email,
      role: req.body.role,
      phone: req.body.phone,
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

/*  GET ALL USER DATA */
exports.findall = (req, res, next) => {
  /* Pagenation ,filtering, Sorting  */
  let { name, email, role, status, sortBy } = req.query;
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let skip = parseInt(req.query.skip);
  let OrderBy = parseInt(req.query.OrderBy);
  let query = {};
  let filter = {};
  if (name != null) {
    filter.name = name;
  }
  if (email != null) {
    filter.email = email;
  }
  if (role != null) {
    filter.role = role;
  }
  if (status != null) {
    filter.status = status;
  }
  if (page < 0 || page === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  if (page > 0) {
    query.skip = skip;
    query.limit = limit;
  }
  if (sortBy && OrderBy) {
    query.sortBy = sortBy;
    query.OrderBy = OrderBy;
  }
  User.find(filter)
    .limit(query.limit)
    .skip(query.skip)
    .sort([[sortBy, query.OrderBy]])
    .then((users) => {
      res.status(200).send({ message: "Users Fetched", data: users });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

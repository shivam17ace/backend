const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
require("dotenv").config();
const Route = require("./routes/index");
const passport = require("passport");
require("./controllers/googleauth");
require("./controllers/facebokaut");


/* middleware */
app.use(bodyparser.json());
app.use(express.json());
app.use(mongoSanitize());
app.use("/", Route);
app.use("/uploads", express.static("./uploads"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "bla bla bla",
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* mongodb connection */
mongoose
  .connect(process.env.DATABASE)
  .then(console.log("database connected"))
  .catch((err) => {
    console.log(err);
  });

/* server */
const port = process.env.PORT;
app.listen(port, (req, res, next) => {
  console.log(`PORT is running on ${port}`);
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
require("dotenv").config();
const Route = require("./routes/index");

/* middleware */
app.use(bodyparser.json());
app.use(express.json());
app.use("/",Route)

/* mongodb connection */
mongoose.connect(process.env.DATABASE)
.then(console.log("database connected"))
.catch(err=>{
    console.log(err)
});

/* server */
const port = process.env.PORT;
app.listen(port,(req,res,next)=>{
    console.log(`PORT is running on ${port}`);
})
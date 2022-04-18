const User = require("../models/user");
const csv = require("csv-express");
// const express = require("express");
exports.downloadcsv = (req,res,next)=>{
    var filename   = "info.csv";
    var dataArray;
    User.find().lean().exec({}, function(err, data) {
        if (err) res.send(err);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(data, true);
    });
}


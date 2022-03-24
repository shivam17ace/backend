const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
let userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: 1,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    resetPasswordToken: {
      type: String ,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "info",
  }
);
userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = new Date() + 300000;
};
module.exports = mongoose.model("User", userSchema);

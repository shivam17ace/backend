const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const crypto = require("crypto");
let userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: 1,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
    },
    phone: {
      type: Number,
      trim: true,
    },
    status: {
      type: Boolean,
      default: 1,
    },
    // resetPasswordToken: {
    //   type: String,
    //   required: false,
    // },
    // resetPasswordExpires: {
    //   type: Date,
    //   required: false,
    // },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
// userSchema.methods.generatePasswordReset = function () {
//   this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
//   this.resetPasswordExpires = Date.now() + 300000;
// };
module.exports = mongoose.model("User", userSchema);

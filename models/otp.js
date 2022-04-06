const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let userotpSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      ref: "User",
    },
    otp: {
      type: String,
      required: true,
    },
    status: {
        type: Boolean,
        default: 1,
      },
    createdAt: { type: Date, default: Date.now(), index: { expiresIn: 300 } },
  },
  { timestamps: true, collection: "otp" }
);

module.exports = mongoose.model("Otp", userotpSchema);

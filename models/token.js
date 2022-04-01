const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    collection: "token",
  }
);

module.exports = mongoose.model("token", tokenSchema);

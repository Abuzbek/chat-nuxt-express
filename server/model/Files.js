const mongoose = require("mongoose");
const Files = new mongoose.Schema({
  name: { type: String },
  path: { type: String },
  mimetype: { type: String },
  size: { type: String },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("file", Files);

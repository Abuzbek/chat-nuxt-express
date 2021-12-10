const mongoose = require("mongoose");

const Users = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  img: { type: String || Array },
  joinDate: { type: Date, default: new Date() },
  contact: { type: Array },
  bio: { type: String },
  phone: { type: String },
  address: { type: String },
  zip: { type: String },
  country: { type: String },
  isActive: { type: Boolean, default: true },
});
module.exports = mongoose.model("Users", Users);

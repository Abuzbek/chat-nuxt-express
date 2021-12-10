const mongoose = require("mongoose");
const Message = new mongoose.Schema({
  text: { type: String || Object || Array },
  from: { type: String },
  from_id: { type: String },
  user: { type: Object },
  date: { type: Date, default: Date.now },
  type: { type: String },
  room_id: { type: String },
  reply_to_message_id: { type: Object || String },
  path: { type: String || Array },
  file_id: { type: String },
  file_name: { type: String || Array },
  file_size: { type: String || Array },
  thumbnail: { type: String || Array },
  mimetype: { type: String || Array },
  duration_seconds: { type: Number || Array },
  width: { type: Number || Array },
  height: { type: Number || Array },
  emoticon: { type: String || Array },
  selected: { type: Boolean, default: false },
});
module.exports = mongoose.model("message", Message);

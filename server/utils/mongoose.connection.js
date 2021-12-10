const mongoose = require("mongoose");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
module.exports = async function db() {
  await mongoose.connect(
    "mongodb+srv://Technobox:mannon_2710@cluster0.88oqc.mongodb.net/test",
    options
  );
};

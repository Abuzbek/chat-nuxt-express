const multer = require("multer");
const moment = require("moment");
const slugfiy = require("slugify");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/img");
  },
  filename(req, file, cb) {
    const date = moment().format("DDMMYYYY-HHmmss_SSS");
    cb(null, `${date}_${slugfiy(file.originalname, "_")}`);
  },
});
module.exports = multer({
  storage,
});

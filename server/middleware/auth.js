const jwt = require("jsonwebtoken");
const Users = require("../model/Users.js");
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, "SUPER_SECRET_KEY");
    if (decode) {
      await Users.findById(decode._id, (err, data) => {
        if (err) {
          res.status(401).json({ message: "not_auth" });
        } else {
          next();
        }
      });
    } else {
      res.status(401).json({ message: "not_auth" });
    }
  } catch (error) {
    res.status(500);
  }
};

const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const cookieparser = require("cookieparser");

const users = require("../controller/users")();
const router = Router();
const upload = require("../utils/file");
const gmailSend = require("../utils/send-gmail");
const Users = require("../model/Users");

// GET METHODS

router.get("/global-users", async (req, res) => {
  const allUsers = await users.users();
  res.status(200).json(allUsers);
});
router.get("/getPrivateUsers", async (req, res) => {
  let users = [];
  const user = await Users.findById(req.query.id);
  for (let i = 0; i < user.contact.length; i++) {
    const u = user.contact[i];
    const friendId = await Users.findById(u.friend);
    users.push({
      _id: friendId._id,
      name: friendId.name,
      email: friendId.email,
      img: friendId.img,
      room: u.room,
    });
    if (users.length === user.contact.length) {
      res.json(users.reverse());
    }
  }
  setTimeout(() => {
    if (users.length === 0) {
      res.json([]);
    }
  }, 1000);
  console.log(user);
});

router.get("/user-search", async (req, res) => {
  const q = req.query.q;
  const results = await users.searchUser(q);
  res.status(200).json(results);
});

router.get("/logout", async (req, res) => {
  res.cookie("token", "");
  res.json({ message: "success logout" });
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.cookie;
  if (authHeader) {
    const getToken = cookieparser.parse(authHeader);
    if (getToken.token) {
      const decode = jwt.verify(getToken.token, "SUPER_SECRET_KEY");
      if (decode) {
        const user = await users.get(decode._id);
        if (user) {
          res.json(user);
        } else {
          res.status(401).json({ message: "not_auth" });
        }
      } else {
        res.status(401).json({ message: "not_auth" });
      }
    } else {
      res.status(401).json({ message: "not_auth" });
    }
  } else {
    res.status(401).json({ message: "not_auth" });
  }
});

// GET METHODS

// POST METHODS

router.post("/login", async (req, res) => {
  const bodyUser = {
    email: req.body.email,
  };
  const user = await users.findOne(bodyUser);
  if (user) {
    const comparePassword = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      res.status(401).json({ message: "wrong_password" });
    } else {
      gmailSend(req, user.password);
      res.json({ message: "send _email", email: user.email });
    }
  } else {
    res.status(401).json({ message: "wrong_email" });
  }
});

router.post("/verify-mail", async (req, res, next) => {
  const bodyUser = {
    email: req.body.email,
  };
  const user = await users.findOne(bodyUser);
  if (user) {
    const comparePassword = user.password == req.body.code;
    if (!comparePassword) {
      res.status(401).json({ message: "wrong_code" });
    } else {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "SUPER_SECRET_KEY",
        {
          expiresIn: 3155695200000,
        }
      );
      res.cookie("token", token, { httpOnly: true, maxAge: 3155695200000 });
      res.json({ token });
    }
  } else {
    res.status(401).json({ message: "wrong_email" });
  }
});

router.post("/register", upload.single("file"), async (req, res) => {
  let host = "";
  if (req.headers.origin.includes("https")) {
    host = `https://${req.headers.host}`;
  } else {
    host = `http://${req.headers.host}`;
  }
  const user = await users.findOne({ email: req.body.email });
  if (user) {
    res.status(409).json({ message: "have_user" });
  } else {
    const hashedPassword = await bcryptjs.hash(req.body.password, 5);
    const bodyUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      img: req.file ? host + "/img/" + req.file.filename : "",
    };
    const data = await users.add(bodyUser);
    res.json(data);
  }
});
// POST METHODS

// PUT METHODS

router.put("/set-private-user", async (req, res) => {
  const { main, friend, room, notification } = req.body;
  const user = await users.setNewPrivateChat(main, friend, room, notification);
  res.json(user);
});

// PUT METHODS

// DELETE METHODS

router.delete("/delete-account/:id", async (req, res) => {
  const deletedUser = await users.remove(req.params.id);
  res.json({ message: "deleted user", ...deletedUser });
});
// DELETE METHODS

module.exports = router;

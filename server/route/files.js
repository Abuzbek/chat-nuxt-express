const { Router } = require("express");
const Files = require("../model/Files");
const Message = require("../model/Message");
const router = Router();
const upload = require("../utils/file");
router.post("/files", upload.array("files"), async (req, res) => {
  let host = "";
  if (req.headers.origin.includes("https")) {
    host = `https://${req.headers.host}`;
  } else {
    host = `http://${req.headers.host}`;
  }
  let i = 0;
  const filesArr = [];
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    console.log(file);
    const files = new Files({
      name: file.originalname,
      size: file.size,
      path: file ? host + "/img/" + file.filename : "",
      mimetype: file.mimetype,
    });
    const fileId = await files.save();
    filesArr.push(fileId);
    if (req.files.length - 1 === i) {
      console.log(filesArr);
      res.json(filesArr);
    }
  }
});
router.get("/file/:id", async (req, res) => {
  const fileId = req.params.id;
  const file = await Files.findById(fileId);
  res.json(file);
});
router.delete("/message/:id", async (req, res) => {
  const messageId = req.params.id;
  const message = await Message.findByIdAndRemove(messageId);
  res.json(message);
});
module.exports = router;

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const auth = require("./middleware/auth");

const users = require("./controller/users")();
const socketIO = require("./socket");
const api = require("./route/index");
const files = require("./route/files");

const mongo = require("./utils/mongoose.connection");

mongo().then(() => console.log("Mongodbga on-line ulandik"));
mongo().catch(err => console.log("Mongodbda hatolik" + err));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.static("public"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", api);
app.use("/", files);
app.use("/admin", auth);
socketIO(io, users);

async function start() {
  const port = 8000;
  const host = "localhost";
  server.listen(port, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
}
start();

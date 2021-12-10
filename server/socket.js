const messages = require("./controller/messages")();
const Users = require("./controller/users")();
const m = (name, text, _id) => ({ name, text, _id });
module.exports = function socketIO(io, users) {
  io.on("connection", (socket) => {
    socket.on("userJoined", async (data, cb) => {
      if (!data.name || !data.password || !data.email) {
        return cb("Данные некорректны");
      }
      const newUser = await users.add({
        name: data.name,
        password: data.password,
        email: data.email,
      });
      cb({ userId: newUser._id });
    });
    socket.on("addRoom", async (data, cb) => {
      socket.join(data.room_id);
    });
    socket.on("get-by-room", async (data, cb) => {
      const byRoomMessages = await messages.getByRoom(data.room_id);
      cb(byRoomMessages);
    });
    socket.on("createMessage", async (data, cb) => {
      socket.join(data.room_id);
      const user = await users.get(data.from_id);
      const dataMessage = await messages.add(data);
      console.log(dataMessage);
      if (user) {
        io.to(dataMessage.room_id).emit("newMessage", dataMessage);
      }
      cb();
    });
    socket.on("userLeft", async (id, cb) => {
      const user = await users.remove(id);
      if (user) {
        io.to(user.room).emit("updateUsers", await users.getByRoom(user.room));
        io.to(user.room).emit(
          "newMessage",
          m("admin", `Пользователь ${user.name} вышел.`)
        );
      }
      cb();
    });
    socket.on("disconnect", async () => {
      const user = await users.remove(socket._id);
      if (user) {
        io.to(user.room).emit("updateUsers", users.getByRoom(user.room));
        io.to(user.room).emit(
          "newMessage",
          m("admin", `Пользователь ${user.name} вышел.`)
        );
      }
    });
    socket.on("deleteMessage", async (data, cb) => {
      const deleteMessage = await messages.remove(data);
    });
    socket.on("get-by-room-user", async (data, cb) => {
      const byRoomUser = await Users.getByRoomUser(data._id, data.room_id);
      // socket.emit("get-by-room-user", byRoomUser);
      cb(byRoomUser);
    });
  });
};

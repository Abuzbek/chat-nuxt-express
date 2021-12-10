const User = require("../model/Users");
class Users {
  constructor() {
    this.searchUserResults = [];
  }
  async users() {
    return await User.find({});
  }
  async add(user) {
    const users = new User(user);
    return await users.save();
  }
  async searchUser(q) {
    this.searchUserResults = await User.find({});
    this.searchUserResults = this.searchUserResults.filter((n, i) => {
      if (n.name.toLowerCase().includes(q.toLowerCase())) {
        return true;
      }
    });
    return this.searchUserResults;
  }
  async get(id) {
    return await User.findById(id);
  }
  async findOne(user) {
    return await User.findOne(user);
  }
  async remove(id) {
    return await User.findByIdAndRemove(id);
  }
  async getByRoom(room) {
    return await User.find({ room });
  }
  async setNewPrivateChat(main, friend, room, notification) {
    let room_id;
    User.findById(main, async (err, data) => {
      if (err) throw err;
      else {
        const privateUser = data.contact.filter((u) => {
          console.log(u);
          if (u.friend == friend) {
            return true; //
          }
        });
        if (privateUser.length == 0) {
          await User.updateOne(
            { _id: main },
            {
              $push: { contact: { friend, room, notification } },
            }
          );
          room_id = room;
        } else {
          room_id = friend.room;
        }
      }
    });
    User.findById(friend, async (err, data) => {
      if (err) throw err;
      else {
        const privateUser = data.contact.filter((u) => {
          if (u.friend == main) {
            return true;
          }
        });
        if (privateUser.length == 0) {
          await User.updateOne(
            { _id: friend },
            {
              $push: { contact: { friend: main, room: room, notification } },
            }
          );
        } else {
        }
      }
    });
    const interval = setInterval(roomInterval, 10);
    function roomInterval() {
      if (room_id) {
        console.log(room_id);
        clearInterval(interval);
      }
    }
  }
  async getByRoomUser(user_id, room_id) {
    const user = await User.findById(user_id);
    const room = user.contact.find((u) => {
      if (u.room == room_id) {
        return true;
      }
    });
    return await User.findById(room.friend);
  }
}

module.exports = function () {
  return new Users();
};

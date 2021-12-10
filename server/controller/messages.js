const Messages = require("../model/Message");
class Message {
  constructor() {
    this.searchMessagesResults = [];
  }
  async messages() {
    return await Messages.find({});
  }
  async add(message) {
    const messages = new Messages(message);
    return await messages.save();
  }
  async get(id) {
    return await Messages.findById(id);
  }
  async findOne(message) {
    return await Messages.findOne(message);
  }
  async remove(id) {
    return await Messages.findByIdAndRemove(id);
  }
  async getByRoom(room_id) {
    return await Messages.find({ room_id });
  }
}

module.exports = function () {
  return new Message();
};

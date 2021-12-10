export const state = () => ({
  users: [],
  globalUsers: [],
  messages: [],
  friend: null
});
export const actions = {
  async fetchAllUsers({ commit }) {
    try {
      const users = await this.$axios({
        method: "GET",
        url: "/global-users"
      });
      commit("setGlobalUsers", users.data);
      return users;
    } catch (error) {
      return error.response;
    }
  },
  async deleteMessage({ commit }, message) {
    const deleteMessage = await this.$axios({
      method: "DELETE",
      url: `/message/${message}`
    });
    commit("deleteMessage", message);
    return deleteMessage;
  },
  async replyMessage({ commit }, message) {
    const replyMessage = await this.$axios({
      method: "POST",
      url: `/message`
    });
    return replyMessage;
  }
};
export const mutations = {
  setMessageByRoom(state, messages) {
    state.messages = messages;
  },
  setGlobalUsers(state, users) {
    state.globalUsers = users;
  },
  SOCKET_newMessage(state, message) {
    state.messages.push(message);
  },
  SOCKET_updateUsers(state, users) {
    state.users = users;
  },
  deleteMessage(state, message) {
    console.log(state.messages.filter(m => m._id === message));
    state.messages = state.messages.filter(m => m._id !== message);
  },
  setFriends(state, friend) {
    state.friend = friend;
  }
};

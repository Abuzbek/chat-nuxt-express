export const state = () => ({
  user: null,
  privateUsers: []
});
export const actions = {
  async nuxtServerInit({ commit }, app) {
    try {
      const me = await this.$axios({ url: "/me" });
      if (me.status === 200) {
        commit("setUser", me.data);
        const mainUser = await this.$axios({
          url: "/getPrivateUsers/" + "?id=" + me.data._id
        });
        if (mainUser.status === 200) {
          commit("setPrivateUsers", mainUser.data);
        }
      } else {
        commit("setUser", null);
      }
    } catch (error) {
      commit("setUser", null);
    }
  },
  async getPrivateUsers({ commit }, id) {
    const mainUser = await this.$axios({
      url: "/getPrivateUsers/" + "?id=" + id
    });
    if (mainUser.status === 200) {
      commit("setPrivateUsers", mainUser.data);
    }
  }
};
export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  clearData(state) {
    state.user = null;
  },
  setPrivateUsers(state, users) {
    state.privateUsers = users;
  }
};

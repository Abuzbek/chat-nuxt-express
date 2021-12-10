export const state = () => ({
  file: null
});
export const actions = {
  async fetchFileById({ commit }, id) {
    const file = await this.$axios.$get(`/file/${id}`);
    commit("setFile", file.data);
    return file;
  }
};
export const mutations = {
  setFile(state, file) {
    state.file = file;
  }
};

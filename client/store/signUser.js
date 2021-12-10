export const actions = {
  async register(_, data) {
    try {
      const registerOption = {
        url: "/register",
        method: "POST",
        data
      };
      const registerUser = await this.$axios(registerOption);
      return registerUser;
    } catch (error) {
      return error.response;
    }
  },
  async login(_, data) {
    try {
      const loginOption = {
        url: "/login",
        method: "POST",
        data
      };
      const loginUser = await this.$axios(loginOption);
      return loginUser;
    } catch (error) {
      return error.response;
    }
  },
  async me() {
    try {
      const meOption = {
        url: "/me",
        method: "GET"
      };
      const meUser = await this.$axios(meOption);
      return meUser;
    } catch (error) {
      return error.response;
    }
  },
  async verifyEmail(_, data) {
    try {
      const verifyEmailOption = {
        url: "/verify-mail",
        method: "POST",
        data
      };
      const verifyEmailUser = await this.$axios(verifyEmailOption);
      return verifyEmailUser;
    } catch (error) {
      return error.response;
    }
  }
};

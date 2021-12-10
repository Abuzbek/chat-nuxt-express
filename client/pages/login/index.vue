<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 class="mt-11">
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="4000" top>
          {{ message }}
          <v-btn color="pink" text @click="snackbar = false">Закрыть</v-btn>
        </v-snackbar>
        <v-card-title>
          <h1>Login Chat</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              filled
              label="Your email address"
              required
            ></v-text-field>
            <v-text-field
              autocomplete="current-password"
              v-model="password"
              filled
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              :rules="rules"
              label="Your password"
              required
            ></v-text-field>
            <v-btn :disabled="!valid" color="primary" @click="submit"
              >SEND</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
      <v-card-text>
        NO ACCOUNT YET? <router-link to="/register">REGISTER NOW</router-link>
      </v-card-text>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  middleware: ["is-not-auth"],
  layout: "empty",
  head: {
    title: "Добро пожаловать в Nuxt чат",
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
  },
  data: () => ({
    valid: true,
    snackbar: false,
    message: "",
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    value: true,
    rules: [(value) => !!value || "Required."],
  }),
  mounted() {
    const { message } = this.$route.query;
    if (message === "noUser") {
      this.message = "Введите данные";
    } else if (message === "leftChat") {
      this.message = "Вы вышли из чата";
    }
    this.snackbar = !!this.message;
  },
  methods: {
    ...mapMutations(["setUser"]),
    async submit() {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password,
        };
        const formdata = new FormData();
        for (const [key, value] of Object.entries(user)) {
          formdata.append(key, value);
        }
        try {
          const login = await this.$store.dispatch("signUser/login", user);
          if (login.status == 200) {
            localStorage.setItem("email", login.data.email);
            this.$router.push("/verify-email");
          }
        } catch (error) {}
      }
    },
  },
};
</script>

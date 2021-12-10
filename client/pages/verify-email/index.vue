<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 class="mt-11">
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="4000" top>
          {{ message }}
          <v-btn color="pink" text @click="snackbar = false">Закрыть</v-btn>
        </v-snackbar>
        <v-card-title>
          <h1>Confirm code</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="code"
              :rules="codeRules"
              filled
              label="Confirmation code"
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
    code: "",
    codeRules: [(v) => !!v || "Code is required"],
    value: true,
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
          email: localStorage.getItem("email")
            ? localStorage.getItem("email")
            : "",
          code: this.code,
        };
        try {
          const login = await this.$store.dispatch(
            "signUser/verifyEmail",
            user
          );
          if (login.status == 200) {
            const me = await this.$store.dispatch("signUser/me");
            if (me.status == 200) {
              this.setUser(me.data);
              this.$router.push("/");
            }
          }
        } catch (error) {}
      }
    },
  },
};
</script>

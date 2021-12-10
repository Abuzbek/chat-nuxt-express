<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 class="mt-11">
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="4000" top>
          {{ message }}
          <v-btn color="pink" text @click="snackbar = false">close</v-btn>
        </v-snackbar>
        <v-card-title>
          <h1>Register Chat</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="16"
              filled
              :rules="nameRules"
              label="Your name"
              required
            ></v-text-field>
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
              hint="Your password passed! Password rules are not meant to be broken!"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              :rules="[rules.password]"
              label="Your password"
              required
            ></v-text-field>
            <v-file-input
              v-model="file"
              accept="image/*"
              filled
              label="File input"
            ></v-file-input>
            <v-btn :disabled="!valid" color="primary" @click="submit"
              >SEND</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
      <v-card-text class="column justify-center">
        I ALREADY HAVE AN <router-link to="/login">ACCOUNT</router-link>
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
    file: null,
    valid: true,
    snackbar: false,
    message: "",
    name: "",
    nameRules: [
      (v) => !!v || "Введите имя",
      (v) => (v && v.length <= 16) || "Имя не должно превышать 16 символов",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    value: true,
    rules: {
      required: (value) => !!value || "Required.",
      password: (value) => {
        const pattern = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#-_\$%\^&\*])(?=.{8,})/;
        return (
          pattern.test(value) ||
          "Min. 8 characters with at least one capital letter, a number and a special character."
        );
      },
    },
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
          name: this.name,
          email: this.email,
          password: this.password,
          file: this.file,
        };
        const formdata = new FormData();
        for (const [key, value] of Object.entries(user)) {
          formdata.append(key, value);
        }
        try {
          const register = await this.$store.dispatch(
            "signUser/register",
            formdata
          );
          if (register.status == 200) {
            const login = await this.$store.dispatch("signUser/login", user);
            console.log(login);
            if (login.status == 200) {
              localStorage.setItem("email", login.data.email);
              this.$router.push("/verify-email");
            }
          }
        } catch (error) {}
      }
    },
  },
  created() {
    console.log(this.user);
  },
  watch: {
    file(val) {
      console.log(val);
    },
  },
};
</script>

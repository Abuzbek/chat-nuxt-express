const pkg = require("./package");
import colors from "vuetify/es5/util/colors";

export default {
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  /*
   ** Plugins to load before mounting the App
   */

  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  plugins: [{ src: "@/plugins/socket", ssr: false }, "@/plugins/axios"],
  modules: ["@nuxtjs/pwa", "@nuxtjs/axios"],
  axios: {
    baseUrl: "http://192.168.1.78:8000"
  }
};

<template>
  <v-app app dark>
    <navigation-drawer
      @dragged="dragged"
      :users="privateUsers"
      :drawer="drawer"
      @open-contact-list="openContactList"
      @open-chat-list="openChatList"
      @open-setting="openSetting"
    />
    <user-drawer
      v-if="friend"
      @close:close="selectFrined"
      @dragged="dragged"
      :friend="friend"
      :drawer="userDrawer"
    />
    <v-app-bar app :class="{ 'transition-none': !isDragged }">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        class="no-selection-text cursor-pointer"
        @click.prevent="selectFrined"
      >
        <v-avatar color="primary" size="44" class="mr-2">
          <img
            :src="
              friend
                ? friend.img
                  ? friend.img
                  : friend.name[0]
                : user
                ? user.img
                  ? user.img
                  : user.name[0]
                : ''
            "
            alt="John"
          />
        </v-avatar>
        {{ friend ? friend.name : user ? user.name : "" }}
      </v-toolbar-title>
    </v-app-bar>

    <v-main :class="{ 'transition-none': !isDragged }">
      <div style="height: 100%">
        <nuxt v-slot="{ Component }">
          <component :is="Component" />
        </nuxt>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NavigationDrawer from "../components/chat/NavigationDrawer.vue";
import UserDrawer from "../components/chat/UserDrawer.vue";
export default {
  components: { NavigationDrawer, UserDrawer },
  middleware: ["auth"],
  data: () => ({
    drawer: true,
    isDragged: true,
    userDrawer: false
  }),
  computed: {
    ...mapState(["user", "users", "privateUsers"]),
    path() {
      return this.$route.params.id;
    },
    messages() {
      return this.$store.state.users.messages;
    },
    friend() {
      return this.$store.state.users.friend;
    }
  },
  async created() {
    this.$socket.emit(
      "get-by-room",
      {
        room_id: this.$route.params.id
      },
      data => {
        this.$store.commit("users/setMessageByRoom", data);
      }
    );
    setTimeout(() => {
      console.log(this.privateUsers);
    }, 1000);
    console.log(this.$store.state);
  },
  methods: {
    openContactList() {},
    openChatList() {},
    openSetting() {},
    dragged(isDragged) {
      this.isDragged = !isDragged;
    },
    ...mapMutations(["clearData"]),
    async exit() {
      await this.$axios({ url: "/logout", method: "GET" });
      this.clearData();
      this.$router.push("/login");
    },
    selectFrined() {
      this.userDrawer = !this.userDrawer;
    }
  },
  mounted() {
    // const calcClass = document.querySelectorAll("[class*='-calc']");
    // console.log(calcClass);
    // calcClass.forEach(el => {
    //   const character = "";
    //   const className = el.className;
    //   const calc = className.split("-calc");
    //   console.log(calc);
    //   const parentElement = el.parentElement.offsetWidth;
    //   const calcArr = calc[1].includes("-")
    //     ? (calc[1].split("-"), (character = "-"))
    //     : calc[1].includes("+")
    //     ? (calc[1].split("+"), (character = "+"))
    //     : calc[1].includes("/")
    //     ? (calc[1].split("/"), (character = "/"))
    //     : (calc[1].split("*"), (character = "*"));
    //   console.log(character);
    //   // calc.map((c, i) => {
    //   //   const check = c.includes("%")
    //   //     ? calc[i].replace(
    //   //         calc[i],
    //   //         parentElement + character + parseInt(calc[i])
    //   //       )
    //   //     : null;
    //   //   console.log(check);
    //   // });
    // });
  },
  watch: {
    path(val) {
      if (val) {
        this.$socket.emit(
          "get-by-room",
          {
            room_id: val
          },
          data => {
            this.$store.commit("users/setMessageByRoom", data);
          }
        );
      }
    }
  }
};
</script>
<style lang="scss">
:root {
  -webkit-font-smoothing: antialiased;
  --composer-hidden-scale: 0.820513;
  --toolbar-hidden-scale: 1.21875;
  --unpin-hidden-scale: 1.9845;
  --toolbar-unpin-hidden-scale: 0.503906;
  --composer-translate-x: 39px;
  --toolbar-translate-x: -26.2564px;
  --pattern-color: #0a0a0a8c;
  --theme-background-color: #0f0f0f;
  --slide-transition: 450ms cubic-bezier(0.25, 1, 0.5, 1);
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  --color-text-lighter: #2e3939;
  --color-text-meta: #686c72;
  --color-text-meta-rgb: 104, 108, 114;
  --color-text-meta-apple: #8c8c91;
  --color-text-green: #4fae4e;
  --color-text-green-rgb: 79, 174, 78;
  --color-webpage-initial-background: #2e3939;
  --color-interactive-active: var(--color-primary);
  --color-interactive-inactive: rgba(var(--color-text-secondary-rgb), 0.25);
  --color-interactive-buffered: rgba(var(--color-text-secondary-rgb), 0.25);
  --color-interactive-element-hover: rgba(
    var(--color-text-secondary-rgb),
    0.08
  );
  --color-primary-shade-darker: #2b79c6;
  --color-green-darker: #00a734;
  --color-error: #e53935;
  --color-error-shade: #d33431;
  --color-error-rgb: 229, 57, 53;
  --color-warning: #fb8c00;
  --color-yellow: #fdd764;
  --color-placeholders: #a2acb4;
  --color-white: #ffffff;
  --color-selection-highlight: #3993fb;
  --color-selection-highlight-emoji: rgba(57, 147, 251, 0.7);
  --color-user-1: #e17076;
  --color-user-2: #7bc862;
  --color-user-4: #65aadd;
  --color-user-5: #a695e7;
  --color-user-6: #ee7aae;
  --color-user-7: #6ec9cb;
  --color-user-8: #faa774;
  --border-radius-default: 0.75rem;
  --border-radius-default-small: 0.625rem;
  --border-radius-default-tiny: 0.375rem;
  --border-radius-messages: 0.75rem;
  --border-radius-messages-small: 0.375rem;
  --messages-container-width: 45.5rem;
  --header-height: 3.5rem;
  --symbol-menu-width: 26.25rem;
  --symbol-menu-height: 23.25rem;
  --symbol-menu-footer-height: 3rem;
  --z-ui-loader-mask: 2000;
  --z-notification: 1000;
  --z-right-column: 900;
  --z-header-menu: 990;
  --z-header-menu-backdrop: 980;
  --z-modal: 1000;
  --z-media-viewer: 1500;
  --z-drop-area: 55;
  --z-animation-fade: 50;
  --z-menu-bubble: 21;
  --z-menu-backdrop: 20;
  --z-message-highlighted: 14;
  --z-message-context-menu: 13;
  --z-scroll-down-button: 12;
  --z-mobile-search: 12;
  --z-middle-header: 11;
  --z-middle-footer: 11;
  --z-country-code-input-group: 10;
  --z-message-select-control: 9;
  --z-message-select-area: 8;
  --z-sticky-date: 9;
  --z-register-add-avatar: 5;
  --z-media-viewer-head: 3;
  --z-resize-handle: 2;
  --z-below: -1;
  --spinner-white-data: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwLjggMjIuNEM2IDIxLjkgMi4xIDE4IDEuNiAxMy4yLjkgNy4xIDUuNCAxLjkgMTEuMyAxLjVjLjQgMCAuNy0uMy43LS43IDAtLjQtLjQtLjgtLjgtLjhDNC44LjQtLjIgNS45IDAgMTIuNS4yIDE4LjYgNS40IDIzLjggMTEuNSAyNGM2LjYuMiAxMi00LjggMTIuNC0xMS4yIDAtLjQtLjMtLjgtLjgtLjgtLjQgMC0uNy4zLS43LjctLjMgNS45LTUuNSAxMC40LTExLjYgOS43eiIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==);
  --spinner-white-thin-data: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTEyIDIzQzUuOSAyMyAxIDE4LjEgMSAxMlM1LjkgMSAxMiAxVjBDNS40IDAgMCA1LjQgMCAxMnM1LjQgMTIgMTIgMTIgMTItNS40IDEyLTEyaC0xYzAgNi4xLTQuOSAxMS0xMSAxMXoiLz48L3N2Zz4=);
  --spinner-blue-data: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwLjggMjIuNEM2IDIxLjkgMi4xIDE4IDEuNiAxMy4yLjkgNy4xIDUuNCAxLjkgMTEuMyAxLjVjLjQgMCAuNy0uMy43LS43IDAtLjQtLjQtLjgtLjgtLjhDNC44LjQtLjIgNS45IDAgMTIuNS4yIDE4LjYgNS40IDIzLjggMTEuNSAyNGM2LjYuMiAxMi00LjggMTIuNC0xMS4yIDAtLjQtLjMtLjgtLjgtLjgtLjQgMC0uNy4zLS43LjctLjMgNS45LTUuNSAxMC40LTExLjYgOS43eiIgZmlsbD0iIzRlYTRmNiIvPjwvc3ZnPg==);
  --spinner-dark-blue-data: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwLjggMjIuNEM2IDIxLjkgMi4xIDE4IDEuNiAxMy4yLjkgNy4xIDUuNCAxLjkgMTEuMyAxLjVjLjQgMCAuNy0uMy43LS43IDAtLjQtLjQtLjgtLjgtLjhDNC44LjQtLjIgNS45IDAgMTIuNS4yIDE4LjYgNS40IDIzLjggMTEuNSAyNGM2LjYuMiAxMi00LjggMTIuNC0xMS4yIDAtLjQtLjMtLjgtLjgtLjgtLjQgMC0uNy4zLS43LjctLjMgNS45LTUuNSAxMC40LTExLjYgOS43eiIgZmlsbD0iIzgzNzhEQiIvPjwvc3ZnPg==);
  --spinner-black-data: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwLjggMjIuNEM2IDIxLjkgMi4xIDE4IDEuNiAxMy4yLjkgNy4xIDUuNCAxLjkgMTEuMyAxLjVjLjQgMCAuNy0uMy43LS43IDAtLjQtLjQtLjgtLjgtLjhDNC44LjQtLjIgNS45IDAgMTIuNS4yIDE4LjYgNS40IDIzLjggMTEuNSAyNGM2LjYuMiAxMi00LjggMTIuNC0xMS4yIDAtLjQtLjMtLjgtLjgtLjgtLjQgMC0uNy4zLS43LjctLjMgNS45LTUuNSAxMC40LTExLjYgOS43eiIgZmlsbD0iIzJlMzkzOSIvPjwvc3ZnPg==);
  --spinner-green-data: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwLjggMjIuNEM2IDIxLjkgMi4xIDE4IDEuNiAxMy4yLjkgNy4xIDUuNCAxLjkgMTEuMyAxLjVjLjQgMCAuNy0uMy43LS43IDAtLjQtLjQtLjgtLjgtLjhDNC44LjQtLjIgNS45IDAgMTIuNS4yIDE4LjYgNS40IDIzLjggMTEuNSAyNGM2LjYuMiAxMi00LjggMTIuNC0xMS4yIDAtLjQtLjMtLjgtLjgtLjgtLjQgMC0uNy4zLS43LjctLjMgNS45LTUuNSAxMC40LTExLjYgOS43eiIgZmlsbD0iIzRmYWU0ZSIvPjwvc3ZnPg==);
  --spinner-gray-data: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEwLjggMjIuNEM2IDIxLjkgMi4xIDE4IDEuNiAxMy4yLjkgNy4xIDUuNCAxLjkgMTEuMyAxLjVjLjQgMCAuNy0uMy43LS43IDAtLjQtLjQtLjgtLjgtLjhDNC44LjQtLjIgNS45IDAgMTIuNS4yIDE4LjYgNS40IDIzLjggMTEuNSAyNGM2LjYuMiAxMi00LjggMTIuNC0xMS4yIDAtLjQtLjMtLjgtLjgtLjgtLjQgMC0uNy4zLS43LjctLjMgNS45LTUuNSAxMC40LTExLjYgOS43eiIgZmlsbD0iIzcwNzU3OSIvPjwvc3ZnPg==);
  --drag-target-border: url("data:image/svg+xml,%3csvg width=%27100%25%27 height=%27100%25%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3crect width=%27100%25%27 height=%27100%25%27 fill=%27none%27 rx=%278%27 ry=%278%27 stroke=%27%23DDDFE0%27 stroke-width=%274%27 stroke-dasharray=%279.1%2c 10.5%27 stroke-dashoffset=%273%27 stroke-linecap=%27round%27/%3e%3c/svg%3e");
  --drag-target-border-hovered: url("data:image/svg+xml,%3csvg width=%27100%25%27 height=%27100%25%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3crect width=%27100%25%27 height=%27100%25%27 fill=%27none%27 rx=%278%27 ry=%278%27 stroke=%27%2363A2E3%27 stroke-width=%274%27 stroke-dasharray=%279.1%2c 10.5%27 stroke-dashoffset=%273%27 stroke-linecap=%27round%27/%3e%3c/svg%3e");
  --layer-transition: 300ms cubic-bezier(0.33, 1, 0.68, 1);
  --layer-blackout-opacity: 0.3;
  --select-transition: 200ms ease-out;
  --right-column-width: 25vw;
  --vh: 4.27px;
  --composer-text-size: 15px;
  --message-meta-height: 19px;
  --message-text-size: 15px;
  --color-primary: rgb(135, 116, 225);
  --color-primary-opacity: rgba(131, 120, 219, 0.501961);
  --color-primary-shade: rgb(123, 113, 198);
  --color-primary-shade-rgb: 123, 113, 198;
  --color-background: rgb(33, 33, 33);
  --color-background-secondary: rgb(15, 15, 15);
  --color-background-secondary-accent: rgb(16, 15, 16);
  --color-background-own: rgb(135, 116, 225);
  --color-background-own-apple: rgb(135, 116, 225);
  --color-background-selected: rgb(44, 44, 44);
  --color-background-own-selected: rgb(101, 73, 212);
  --color-chat-hover: rgb(44, 44, 44);
  --color-chat-active: rgb(135, 116, 225);
  --color-item-active: rgb(41, 41, 41);
  --color-text: rgb(255, 255, 255);
  --color-text-secondary: rgb(170, 170, 170);
  --color-text-secondary-rgb: 170, 170, 170;
  --color-text-secondary-apple: rgb(170, 170, 170);
  --color-borders: rgb(48, 48, 48);
  --color-borders-input: rgb(91, 91, 90);
  --color-dividers: rgb(64, 64, 64);
  --color-links: rgb(135, 116, 225);
  --color-gray: rgb(113, 117, 121);
  --color-pinned: rgb(112, 117, 121);
  --color-default-shadow: rgba(16, 16, 16, 0.611765);
  --color-light-shadow: rgba(0, 0, 0, 0.25098);
  --color-green: rgb(135, 116, 225);
  --color-text-meta-colored: rgb(131, 120, 219);
  --color-reply-hover: rgb(39, 39, 39);
  --color-reply-active: rgb(46, 47, 47);
  --color-reply-own-hover: rgb(125, 107, 202);
  --color-reply-own-hover-apple: rgb(125, 107, 202);
  --color-reply-own-active: rgb(114, 100, 182);
  --color-reply-own-active-apple: rgb(114, 100, 182);
  --color-accent-own: rgb(255, 255, 255);
  --color-message-meta-own: rgba(255, 255, 255, 0.533333);
  --color-own-links: rgb(255, 255, 255);
  --color-code: rgb(135, 116, 225);
  --color-code-own: rgb(255, 255, 255);
  --color-code-bg: rgba(255, 255, 255, 0.14902);
  --color-code-own-bg: rgba(255, 255, 255, 0.14902);
  --color-composer-button: rgba(170, 170, 170, 0.8);
}
* {
  scroll-behavior: smooth;
}
.transition-none {
  transition: 0s !important;
}
.no-selection-text::-moz-selection {
  color: white;
  background: transparent;
}
.no-selection-text::selection {
  color: white;
  background: transparent;
}
.no-selection-text *::-moz-selection {
  color: white;
  background: transparent;
}
.no-selection-text *::selection {
  color: white;
  background: transparent;
}
.pre-wrap {
  white-space: pre-wrap !important;
}
.cursor-pointer {
  cursor: pointer;
}
.overflow-hidden {
  overflow: hidden;
}

.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.bottom-0 {
  bottom: 0;
}
.scroll-auto {
  overflow-y: auto;
}
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.grid-cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
.grid-cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
.grid-cols-7 {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.grid-cols-8 {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}
.grid-cols-9 {
  grid-template-columns: repeat(9, minmax(0, 1fr));
}
.grid-cols-10 {
  grid-template-columns: repeat(10, minmax(0, 1fr));
}
.grid-cols-11 {
  grid-template-columns: repeat(11, minmax(0, 1fr));
}
.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}
.grid-cols-none {
  grid-template-columns: none;
}
.grid-rows-1 {
  grid-template-rows: repeat(1, minmax(0, 1fr));
}
.grid-rows-2 {
  grid-template-rows: repeat(2, minmax(0, 1fr));
}
.grid-rows-3 {
  grid-template-rows: repeat(3, minmax(0, 1fr));
}
.grid-rows-4 {
  grid-template-rows: repeat(4, minmax(0, 1fr));
}
.grid-rows-5 {
  grid-template-rows: repeat(5, minmax(0, 1fr));
}
.grid-rows-6 {
  grid-template-rows: repeat(6, minmax(0, 1fr));
}
.grid-rows-none {
  grid-template-rows: none;
}
.gap-0 {
  gap: 0px;
}
.gap-x-0 {
  column-gap: 0px;
}
.gap-y-0 {
  row-gap: 0px;
}
.gap-px {
  gap: 1px;
}
.gap-x-px {
  column-gap: 1px;
}
.gap-y-px {
  row-gap: 1px;
}
.gap-0\.5 {
  gap: 0.125rem;
}
.gap-x-0\.5 {
  column-gap: 0.125rem;
}
.gap-y-0\.5 {
  row-gap: 0.125rem;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-x-1 {
  column-gap: 0.25rem;
}
.gap-y-1 {
  row-gap: 0.25rem;
}
.gap-1\.5 {
  gap: 0.375rem;
}
.gap-x-1\.5 {
  column-gap: 0.375rem;
}
.gap-y-1\.5 {
  row-gap: 0.375rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-x-2 {
  column-gap: 0.5rem;
}
.gap-y-2 {
  row-gap: 0.5rem;
}
.gap-2\.5 {
  gap: 0.625rem;
}
.gap-x-2\.5 {
  column-gap: 0.625rem;
}
.gap-y-2\.5 {
  row-gap: 0.625rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-x-3 {
  column-gap: 0.75rem;
}
.gap-y-3 {
  row-gap: 0.75rem;
}
.gap-3\.5 {
  gap: 0.875rem;
}
.gap-x-3\.5 {
  column-gap: 0.875rem;
}
.gap-y-3\.5 {
  row-gap: 0.875rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-x-4 {
  column-gap: 1rem;
}
.gap-y-4 {
  row-gap: 1rem;
}
.gap-5 {
  gap: 1.25rem;
}
.gap-x-5 {
  column-gap: 1.25rem;
}
.gap-y-5 {
  row-gap: 1.25rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-x-6 {
  column-gap: 1.5rem;
}
.gap-y-6 {
  row-gap: 1.5rem;
}
.gap-7 {
  gap: 1.75rem;
}
.gap-x-7 {
  column-gap: 1.75rem;
}
.gap-y-7 {
  row-gap: 1.75rem;
}
.gap-8 {
  gap: 2rem;
}
.gap-x-8 {
  column-gap: 2rem;
}
.gap-y-8 {
  row-gap: 2rem;
}
.gap-9 {
  gap: 2.25rem;
}
.gap-x-9 {
  column-gap: 2.25rem;
}
.gap-y-9 {
  row-gap: 2.25rem;
}
.gap-10 {
  gap: 2.5rem;
}
.gap-x-10 {
  column-gap: 2.5rem;
}
.gap-y-10 {
  row-gap: 2.5rem;
}
.gap-11 {
  gap: 2.75rem;
}
.gap-x-11 {
  column-gap: 2.75rem;
}
.gap-y-11 {
  row-gap: 2.75rem;
}
.gap-12 {
  gap: 3rem;
}
.gap-x-12 {
  column-gap: 3rem;
}
.gap-y-12 {
  row-gap: 3rem;
}
.gap-14 {
  gap: 3.5rem;
}
.gap-x-14 {
  column-gap: 3.5rem;
}
.gap-y-14 {
  row-gap: 3.5rem;
}
.gap-16 {
  gap: 4rem;
}
.gap-x-16 {
  column-gap: 4rem;
}
.gap-y-16 {
  row-gap: 4rem;
}
.gap-20 {
  gap: 5rem;
}
.gap-x-20 {
  column-gap: 5rem;
}
.gap-y-20 {
  row-gap: 5rem;
}
.gap-24 {
  gap: 6rem;
}
.gap-x-24 {
  column-gap: 6rem;
}
.gap-y-24 {
  row-gap: 6rem;
}
.gap-28 {
  gap: 7rem;
}
.gap-x-28 {
  column-gap: 7rem;
}
.gap-y-28 {
  row-gap: 7rem;
}
.gap-32 {
  gap: 8rem;
}
.gap-x-32 {
  column-gap: 8rem;
}
.gap-y-32 {
  row-gap: 8rem;
}
.gap-36 {
  gap: 9rem;
}
.gap-x-36 {
  column-gap: 9rem;
}
.gap-y-36 {
  row-gap: 9rem;
}
.gap-40 {
  gap: 10rem;
}
.gap-x-40 {
  column-gap: 10rem;
}
.gap-y-40 {
  row-gap: 10rem;
}
.gap-44 {
  gap: 11rem;
}
.gap-x-44 {
  column-gap: 11rem;
}
.gap-y-44 {
  row-gap: 11rem;
}
.gap-48 {
  gap: 12rem;
}
.gap-x-48 {
  column-gap: 12rem;
}
.gap-y-48 {
  row-gap: 12rem;
}
.gap-52 {
  gap: 13rem;
}
.gap-x-52 {
  column-gap: 13rem;
}
.gap-y-52 {
  row-gap: 13rem;
}
.gap-56 {
  gap: 14rem;
}
.gap-x-56 {
  column-gap: 14rem;
}
.gap-y-56 {
  row-gap: 14rem;
}
.gap-60 {
  gap: 15rem;
}
.gap-x-60 {
  column-gap: 15rem;
}
.gap-y-60 {
  row-gap: 15rem;
}
.gap-64 {
  gap: 16rem;
}
.gap-x-64 {
  column-gap: 16rem;
}
.gap-y-64 {
  row-gap: 16rem;
}
.gap-72 {
  gap: 18rem;
}
.gap-x-72 {
  column-gap: 18rem;
}
.gap-y-72 {
  row-gap: 18rem;
}
.gap-80 {
  gap: 20rem;
}
.gap-x-80 {
  column-gap: 20rem;
}
.gap-y-80 {
  row-gap: 20rem;
}
.gap-96 {
  gap: 24rem;
}
.gap-x-96 {
  column-gap: 24rem;
}
.gap-y-96 {
  row-gap: 24rem;
}
.click-rubber {
  &-99 {
    &:active {
      transform: scale(0.99);
    }
  }
  &-95 {
    &:active {
      transform: scale(0.95);
    }
  }
  &-90 {
    &:active {
      transform: scale(0.9);
    }
  }
  &-80 {
    &:active {
      transform: scale(0.8);
    }
  }
  &-70 {
    &:active {
      transform: scale(0.7);
    }
  }
  &-60 {
    &:active {
      transform: scale(0.6);
    }
  }
  &-50 {
    &:active {
      transform: scale(0.5);
    }
  }
  &-40 {
    &:active {
      transform: scale(0.4);
    }
  }
  &-30 {
    &:active {
      transform: scale(0.3);
    }
  }
  &-20 {
    &:active {
      transform: scale(0.2);
    }
  }
  &-10 {
    &:active {
      transform: scale(0.1);
    }
  }
  &-5 {
    &:active {
      transform: scale(0.05);
    }
  }
  &-1 {
    &:active {
      transform: scale(0.01);
    }
  }
}
</style>

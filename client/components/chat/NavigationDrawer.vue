<template>
  <v-navigation-drawer
    :class="{ 'transition-none': dragged }"
    :width="width"
    app
    v-model="drawer"
    mobile-breakpoint="800"
  >
    <div class="dragged" @mousedown="handleMousedown($event)"></div>
    <div class="relative h-full">
      <div class="py-4 px-2 d-flex">
        <v-btn
          v-if="showAllUser"
          @click="hideAllUserHandler"
          class="mr-2"
          fab
          dark
          small
          color="dark"
        >
          <v-icon dark>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-text-field
          class="no-selection-text"
          solo
          dense
          label="Search"
          @focus="showAllUserHandler"
          v-model="searchUser"
          @input="searchUserHandler"
        ></v-text-field>
      </div>
      <div class="scroll-auto" style="height:calc(100% - 56px - 96px);">
        <all-users v-show="showAllUser" :allUsers="allUsers" />
        <private-chats :users="users" v-show="!showAllUser" />
      </div>
      <bottom-nav-drawer
        @open-contact-list="$emit('open-contact-list')"
        @open-chat-list="$emit('open-chat-list')"
        @open-setting="$emit('open-setting')"
        :dragged="dragged"
        :user="user"
      />
    </div>
  </v-navigation-drawer>
</template>

<script>
import AllUsers from "./users/AllUsers.vue";
import PrivateChats from "./users/PrivateChats.vue";
import { mapState } from "vuex";
import BottomNavDrawer from "./BottomNavDrawer.vue";
export default {
  data: () => ({
    showAllUser: false,
    searchUser: "",
    allUsers: [],
    width: 300,
    dragged: false,
    dragX: 0
  }),
  components: { PrivateChats, AllUsers, BottomNavDrawer },
  computed: {
    ...mapState(["user"])
  },
  props: ["users", "drawer"],
  async created() {
    this.loading = true;
    const users = await this.$store.dispatch("users/fetchAllUsers");
    if (users.status == 200) {
      this.allUsers = this.$store.state.users.globalUsers;
    }
  },
  methods: {
    async showAllUserHandler() {
      this.showAllUser = true;
    },
    hideAllUserHandler() {
      this.showAllUser = false;
      this.$store.dispatch("getPrivateUsers", this.user._id);
    },
    async searchUserHandler() {
      const { data, status } = await this.$axios({
        method: "GET",
        url: `/user-search/?q=${this.searchUser}`
      });
      if (status == 200) {
        this.allUsers = data;
      }
    },
    handleMousedown(e) {
      this.dragged = true;
      this.$emit("dragged", true);
      this.dragX = e.clientX;
    },
    handleMouseup(e) {
      this.dragged = false;
      this.$emit("dragged", false);
    },
    handleMousemove(e) {
      if (!this.dragged) {
        return;
      }
      let minWidth = 150;
      let maxWidth = 500;
      if (e.clientX > minWidth && e.clientX < maxWidth) {
        this.width = e.clientX;
      }
      console.log(e.clientX);
      console.log(document.body.offsetWidth);
    }
  },
  mounted() {
    document.addEventListener("mouseup", this.handleMouseup);
    document.addEventListener("mousemove", this.handleMousemove);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.dragged {
  position: fixed;
  z-index: 9999;
  width: 3px;
  height: 100%;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}
.no-selection-text label::selection {
  background: transparent;
  color: currentColor;
}
</style>

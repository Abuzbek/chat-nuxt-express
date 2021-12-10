<template>
  <v-navigation-drawer
    :class="{ 'transition-none': dragged }"
    :width="width"
    right
    app
    v-model="userDrawer"
    mobile-breakpoint="800"
  >
    <div class="dragged" @mousedown="handleMousedown($event)"></div>
    <v-app-bar :class="{ 'transition-none': dragged }">
      <v-btn fab :elevation="0" @click="$emit('close:close')" class="mr-4">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title class="no-selection-text">Profile</v-toolbar-title>
    </v-app-bar>
    <div class="info-content">
      <div class="img-slider">
        <v-img max-height="350" v-if="friend.img" :src="friend.img"></v-img>
      </div>
      <div class="info-text">
        <v-list class="pa-4">
          <v-list-item
            @click.prevent
            class="rounded-lg overflow-hidden click-rubber-95 "
          >
            <v-icon large class="mr-4">
              mdi-at
            </v-icon>
            <v-list-item-content>
              <v-list-item-title v-html="friend.name"></v-list-item-title>
              <v-list-item-subtitle>Username</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click.prevent
            class="rounded-lg overflow-hidden click-rubber-95 "
          >
            <v-icon large class="mr-4">
              mdi-email-outline
            </v-icon>
            <v-list-item-content>
              <v-list-item-title v-html="friend.email"></v-list-item-title>
              <v-list-item-subtitle>E-mail</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click.prevent
            v-if="friend.phone"
            class="rounded-lg overflow-hidden click-rubber-95 "
          >
            <v-icon large class="mr-4">
              mdi-phone-outline
            </v-icon>
            <v-list-item-content>
              <v-list-item-title v-html="friend.phone"></v-list-item-title>
              <v-list-item-subtitle>Phone</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click.prevent
            v-if="friend.address"
            class="rounded-lg overflow-hidden click-rubber-95 "
          >
            <v-icon large class="mr-4">
              mdi-map-marker-outline
            </v-icon>
            <v-list-item-content>
              <v-list-item-title v-html="friend.address"></v-list-item-title>
              <v-list-item-subtitle>Address</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="friend.bio"
            @click.prevent
            class="rounded-lg overflow-hidden click-rubber-95 "
          >
            <v-icon large class="mr-4">
              mdi-information-outline
            </v-icon>
            <v-list-item-content>
              <v-list-item-title v-html="friend.bio"></v-list-item-title>
              <v-list-item-subtitle>Bio</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click.prevent="toggleNotification"
            class="rounded-lg overflow-hidden click-rubber-95 "
          >
            <v-icon large class="mr-4">
              mdi-bell-outline
            </v-icon>
            <v-list-item-content>
              <v-list-item-title>Notification</v-list-item-title>
            </v-list-item-content>
            <v-switch v-model="notification" color="#1976d2"></v-switch>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    showAllUser: false,
    width: 350,
    dragged: false,
    dragX: 0,
    isDragged: false,
    userDrawer: false,
    notification: false
  }),
  props: ["friend", "drawer"],
  computed: {
    ...mapState(["user"])
  },
  methods: {
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
      let clientWidth = document.body.offsetWidth;
      let width = clientWidth - e.clientX;
      let minWidth = 250;
      let maxWidth = 500;
      if (width > minWidth && width < maxWidth) {
        this.width = width;
      }
      console.log(width);
    },
    toggleNotification() {
      this.notification = !this.notification;
      // this.$store.dispatch("toggleNotification", {
      //   user: this.user._id,
      //   friend: this.friend._id,
      //   notification: this.notification
      // });
    }
  },
  mounted() {
    document.addEventListener("mouseup", this.handleMouseup);
    document.addEventListener("mousemove", this.handleMousemove);
  },
  created() {
    const friendNotif = this.user.contact.find(u => {
      if (u.friend == this.friend._id) {
        return true;
      }
    });
    this.notification = friendNotif.notification;
  },
  watch: {
    drawer(value) {
      console.log(value);
      this.userDrawer = value;
    }
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
  left: 0;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}
.no-selection-text label::selection {
  background: transparent;
  color: currentColor;
}
</style>

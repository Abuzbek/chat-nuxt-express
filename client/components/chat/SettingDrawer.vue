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
        <div class="d-flex flex-column">
          <div class="d-flex justify-center">
            <v-avatar size="100" class="mr-2" :src="user.avatar"></v-avatar>
            <div class="d-flex flex-column">
              <div class="d-flex justify-center">
                <div class="text-capitalize font-weight-bold">
                  {{ user.name }}
                </div>
                <div class="text-capitalize font-weight-bold">
                  {{ user.email }}
                </div>
              </div>
              <div class="d-flex justify-center">
                <v-btn color="primary" class="mt-2" @click="logout">
                  Logout
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <bottom-nav-drawer :dragged="dragged" :user="user" />
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import BottomNavDrawer from "./BottomNavDrawer.vue";
export default {
  components: { BottomNavDrawer },
  data: () => ({
    showAllUser: false,
    searchUser: "",
    allUsers: [],
    width: 300,
    dragged: false,
    dragX: 0
  }),
  computed: {
    ...mapState(["user"])
  },
  props: ["drawer"],
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

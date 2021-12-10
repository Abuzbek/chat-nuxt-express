<template>
  <div>
    <div class="overlay" v-if="active" @click="$emit('click', false)"></div>
    <div v-if="active" class="file-viewer__header d-flex justify-end">
      <v-btn icon @click="$emit('click', false)">
        <v-icon size="30">mdi-close</v-icon>
      </v-btn>
    </div>
    <transition name="fade">
      <div class="file-viewer" v-if="active">
        <div class="file-viewer__body">
          <div class="file-viewer__body-content">
            <div
              class="file-viewer__body-content-image"
              v-if="file.mimetype.startsWith('image/')"
            >
              <img :src="file.path" alt="" style="max-width:70%;" />
            </div>
            <div
              class="file-viewer__body-content-video"
              v-else-if="file.mimetype.startsWith('video/')"
            >
              <video controls>
                <source :src="file.path" :type="file.mimetype" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "FileViewer",
  data() {
    return {
      customIdx: 0
    };
  },
  computed: {
    images() {
      return this.$store.state.users.messages.filter((m, i) => {
        if (file._id === m._id) {
          this.customIdx = i;
          console.log(i);
        }
        return m.mimetype.startsWith("image/");
      });
    }
  },
  props: {
    file: {
      type: Object
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    open() {
      this.dialog = true;
    }
  },
  watch: {
    customIdx(val) {
      console.log(val);
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  z-index: 100;
}
.file-viewer {
  width: 100%;
  max-width: 100%;
  height: 100%;
  pointer-events: none;
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 101;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
img {
  max-width: 80%;
  height: auto;
}
video {
  max-width: 80%;
  height: auto;
}
.file-viewer__body {
  pointer-events: auto;
  width: auto;
}
.file-viewer__header {
  pointer-events: auto;
  width: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 102;
  left: 0;
  padding: 1rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.fade-enter,
.fade-leave-to {
  transform: translateY(20%);
  opacity: 0;
}
</style>

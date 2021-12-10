<template>
  <div>
    <div class="overlay" v-if="dialog" @click="$emit('click', false)"></div>
    <transition name="fade">
      <div class="dialog" v-show="dialog">
        <v-card class="rounded-xl">
          <v-card-title class="text-h5">
            <div class="d-flex justify-space-between" style="width: 100%;">
              <v-btn icon @click="$emit('click', false)">
                <v-icon size="30">mdi-trash-can-outline</v-icon>
              </v-btn>
              <v-btn icon @click="$emit('click', false)">
                <v-icon size="30">mdi-close-circle-outline</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <div class="upload-view">
            <div v-for="(n, i) in files" :key="i">
              <div class="pa-4" v-if="!n.file.type.includes('image')">
                <v-card class="rounded-xl" color="#303030">
                  <v-list-item three-line>
                    <v-list-item-avatar size="40" color="white">
                      <v-icon color="#2a2a2a">{{
                        n.file.type.includes("video")
                          ? "mdi-video"
                          : n.file.type.includes("audio")
                          ? "mdi-music-note-eighth"
                          : "mdi-file"
                      }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <div class="text-overline">
                        {{ n.file.name }}
                      </div>
                      <v-list-item-subtitle>
                        {{ bytesToSize(n.file.size) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </div>
              <div class="upload-img" v-else>
                <img class="rounded-xl" :src="n.src" alt="" />
              </div>
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-card-title class="fixed-bottom">
            <v-text-field
              v-model="message"
              clearable
              filled
              color="blue-grey lighten-3"
              :append-outer-icon="'mdi-send'"
              clear-icon="mdi-close-circle"
              label="Add a caption..."
              type="text"
              @click:append-outer="submitFileMessage"
            />
            <!-- <v-btn color="blue darken-2" text @click="$emit('click', false)">
              <v-icon size="30">mdi-send</v-icon>
            </v-btn> -->
          </v-card-title>
        </v-card>
      </div>
    </transition>
    <transition name="fade">
      <div class="progress" v-show="isProgress">
        <v-progress-circular
          :rotate="360"
          :size="150"
          :width="8"
          :value="valueProgress"
          color="#a3a3a3"
        >
          {{ valueProgress }}%
        </v-progress-circular>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["dialog", "files", "formFiles"],
  data: () => ({
    message: "",
    valueProgress: 0,
    isProgress: false
  }),
  computed: {
    ...mapState(["user"])
  },
  methods: {
    bytesToSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (!bytes) {
        return "0 Byte";
      }
      const i = parseInt(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
    },
    clearMessage() {
      this.message = "";
    },
    async submitFileMessage() {
      if (this.files) {
        const formData = new FormData();
        for (let i = 0; i < this.formFiles.length; i++) {
          formData.append("files", this.formFiles[i]);
        }
        const { data, status } = await this.$axios({
          url: "/files",
          method: "POST",
          data: formData,
          onUploadProgress: progressEvent => {
            console.log(
              (progressEvent.loaded / progressEvent.total) * 100 + "%"
            );
            this.isProgress = true;
            this.valueProgress =
              (progressEvent.loaded / progressEvent.total) * 100;
          }
        });
        let i = 0;
        if (status == 200) {
          if (data.length == 1) {
            data.forEach(file => {
              this.$socket.emit(
                "createMessage",
                {
                  text: this.message,
                  from_id: this.user._id,
                  user: this.user,
                  from: this.user.name,
                  room_id: this.$route.params.id,
                  mimetype: file.mimetype,
                  file_id: file._id,
                  path: file.path,
                  file_name: file.name,
                  file_size: file.size,
                  type: "media"
                },
                data => {
                  if (typeof data === "string") {
                    console.error(data);
                  } else {
                    this.clearMessage();
                  }
                }
              );
            });
          } else {
            data.forEach(file => {
              i++;
              this.$socket.emit(
                "createMessage",
                {
                  text: "",
                  from_id: this.user._id,
                  user: this.user,
                  from: this.user.name,
                  room_id: this.$route.params.id,
                  mimetype: file.mimetype,
                  path: file.path,
                  file_id: file._id,
                  file_name: file.name,
                  file_size: file.size,
                  type: "media"
                },
                data => {
                  if (typeof data === "string") {
                    console.error(data);
                  } else {
                    this.clearMessage();
                  }
                }
              );
              if (data.length - 1 === i) {
                if (this.message) {
                  this.$socket.emit(
                    "createMessage",
                    {
                      text: this.message,
                      from_id: this.user._id,
                      user: this.user,
                      from: this.user.name,
                      room_id: this.$route.params.id,
                      type: "message"
                    },
                    data => {
                      if (typeof data === "string") {
                        console.error(data);
                      } else {
                        this.clearMessage();
                      }
                    }
                  );
                }
              }
            });
          }
          this.$emit("click", false);
          this.valueProgress = 0;
          this.isProgress = false;
        }
      }
    }
  },
  mounted() {
    console.log(this.files);
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
.upload-img {
  padding: 16px;
}
.progress {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 150;
  background: #3d3d3db3;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog {
  width: 100%;
  max-width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
}
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.upload-view {
  max-height: 45vh;
  overflow: auto;
}
</style>

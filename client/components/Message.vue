<template>
  <div @contextmenu="$emit('contextmenu', $event)">
    <div v-if="name === 'admin'" class="system">
      <p class="text-xs-center">{{ text }}</p>
      <hr />
    </div>
    <div
      v-else
      :id="_id"
      class="wrap wrap-message no-selection-text"
      @dblclick="selectMessage"
      @click="hideSelectMessage"
      :class="{ owner, selecteble }"
      @mousedown="dragStart($event)"
    >
      <div class="img">
        <img v-if="user" :src="user.img" alt="" />
      </div>
      <div
        class="mes animate__animated"
        @mousedown="dragStart($event, 'mes')"
        @click="clickFile"
        @dblclick="selectMessage('mes')"
        :class="{ path }"
        :style="`transform: translate(${animation_left}px)`"
      >
        <a
          :href="`#${reply_message._id}`"
          @click.prevent="showReplyMessage(reply_message._id)"
          class="reply_message"
          v-if="reply_message"
        >
          <h3>{{ reply_message.user.name }}</h3>
          <p>{{ reply_message.text }}</p>
        </a>
        <div v-if="path" style="pointer-events: none;">
          <div
            id="media"
            :path="path"
            v-if="!file_type.includes('image')"
            style="pointer-events: none;"
          >
            <v-card
              style="pointer-events: none;"
              draggable="false"
              class="rounded-lg files-card pa-1"
            >
              <v-list-item
                three-line
                class="card-list-item"
                style="pointer-events: none;"
              >
                <v-list-item-avatar
                  style="pointer-events: none;"
                  size="40"
                  color="white"
                  class="files_avatar"
                >
                  <v-icon class="icon_files" style="pointer-events: none;">{{
                    file_type.includes("video")
                      ? "mdi-video"
                      : file_type.includes("audio")
                      ? "mdi-music-note-eighth"
                      : "mdi-file"
                  }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content
                  style="pointer-events: none;"
                  class="files_content"
                >
                  <div class="text-overline" draggable="false">
                    {{ file_name }}
                  </div>
                  <v-list-item-subtitle
                    style="pointer-events: none;"
                    class="text-subtitle"
                  >
                    {{ bytesToSize(size) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </div>
          <div
            class="mes-img"
            style="pointer-events: none;"
            :class="{ image: isImage }"
            v-else
          >
            <img
              style="pointer-events: none;"
              :src="path"
              alt=""
              draggable="false"
            />
          </div>
        </div>
        <p
          v-if="text"
          class="text-message"
          style="padding-right:35px; pointer-events: none; word-break: break-word;"
          :class="{ 'pl-2 py-1': path }"
          v-html="text"
        ></p>
        <div class="d-flex justify-end time" style="pointer-events: none;">
          <small
            style="pointer-events: none;"
            class="time"
            :class="{ path: path && isTooltipImage }"
          >
            {{ created_at }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "name",
    "text",
    "owner",
    "user",
    "date",
    "path",
    "size",
    "file_type",
    "file_name",
    "_id",
    "file_id",
    "selected",
    "reply_message"
  ],
  data: () => ({
    selecteble: false,
    isImage: false,
    isTooltipImage: false,
    notOpen: true,
    slideLeft: 0,
    isDragged: false,
    animation_left: 0
  }),
  computed: {
    created_at() {
      const options = {};
      options.hour = "numeric";
      options.minute = "numeric";
      options.hour12 = false;
      return new Intl.DateTimeFormat("ru-Ru", options)
        .format(new Date(this.date))
        .split("/")
        .join(":");
    }
  },
  created() {
    if (this.path) {
      this.isImage = this.file_type.includes("image");
    }
    if (this.path && !this.text) {
      this.isTooltipImage = this.file_type.includes("image");
    }
  },
  methods: {
    showReplyMessage(id) {
      document.getElementById(id).classList.add("show-reply-message");
      setTimeout(() => {
        document.getElementById(id).classList.remove("show-reply-message");
      }, 1000);
    },
    showMedia() {
      console.log("path");
    },
    bytesToSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (!bytes) {
        return "0 Byte";
      }
      const i = parseInt(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
    },
    openMenu(e) {
      console.log(e);
    },
    clickFile() {
      if (this.selecteble) {
        this.selecteble = false;
      } else {
        setTimeout(() => {
          if (this.path && this.notOpen) {
            this.$emit("file-open", this.file_id);
          }
        }, 100);
      }
    },
    selectMessage(isMes) {
      this.selecteble = !this.selecteble;
    },
    hideSelectMessage() {
      if (this.selecteble) {
        this.selecteble = false;
      }
    },
    dragStart(e) {
      this.isDragged = true;
      this.slideLeft = e.clientX;
    },
    dragEnd(e) {
      this.isDragged = false;
      this.animation_left = 0;
    },
    draggedMove(e) {
      if (this.isDragged) {
        if (this.slideLeft > e.clientX) {
          this.notOpen = false;
          if (e.clientX - this.slideLeft > -300) {
            this.animation_left = e.clientX - this.slideLeft;
            if (this.animation_left < -100) {
              this.$emit("reply", this._id);
            }
          }
          console.log(this.animation_left);
        } else if (this.slideLeft == e.clientX) {
          this.notOpen = true;
        } else {
          this.notOpen = false;
        }
      }
    },
    toggleSelected() {
      let selected = this.selected;
      this.$emit("toggle-selected", !selected);
    }
  },
  mounted() {
    document.addEventListener("mousemove", this.draggedMove);
    document.addEventListener("mouseup", this.dragEnd);
    // const wrapMessage = document.querySelectorAll(".wrap-message");
    // console.log(wrapMessage);
    // wrapMessage.forEach(item => {
    //   item.addEventListener("mousedown", e => {
    //     console.log(e);
    //   });
    //   item.addEventListener("mouseup", e => {
    //     console.log(e);
    //   });
    // });
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.system {
  margin-bottom: 1rem;

  p {
    margin-bottom: 1rem;
  }
}
.selecteble {
  background: rgba(25, 118, 210, 0.5);
}
.wrap {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.3rem;
  &.show-reply-message {
    animation: showReplyMessage 1.5s linear;
  }
}
.wrap.owner {
  flex-direction: row-reverse;
}
.wrap .img {
  width: 35px;
  height: 35px;
}
.wrap .img img {
  max-width: 100%;
  border-radius: 50%;
  height: auto;
}

.mes {
  padding: 2px 10px;
  width: auto;
  margin: 0 0.3rem;
  box-shadow: 0 1px 0 0 rgba(50, 50, 50, 0.3);
  border-radius: 10px;
  background: #212121;
  color: #f4f4f4;
  position: relative;
  min-width: 120px;
  max-width: 30%;
  .reply_message {
    margin-bottom: 5px;
    padding-left: 5px;
    margin-top: 5px;
    cursor: pointer;
    border-left: 2px solid #1976d2;
    color: #fff;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h3 {
      font-size: 0.9rem;
    }
    p {
      font-size: 0.8rem;
      margin-bottom: 0;
    }
  }
  &.image {
    line-height: 0;
  }
  &.path {
    padding: 0px;
    overflow: hidden;
    background: transparent;
  }
  .mes-img {
    &.image {
      line-height: 0;
    }
  }
  p {
    margin-bottom: 0;
  }
  .files-card {
    background: #212121;
    box-shadow: none !important;
    color: #f4f4f4;
  }
  .card-list-item {
    min-height: auto;
    padding-left: 5px;
  }
  .icon_files {
    color: #212121;
  }
  .text-overline {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  .text-overline,
  .text-subtitle {
    color: #f4f4f4 !important;
  }
  .files_avatar {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .files_content {
    padding-top: 10px;
    padding-bottom: 10px;
    align-self: flex-start;
  }
}
.owner .mes {
  background: #1976d2;
  color: #fff;
  align-self: flex-end;
  .reply_message {
    border-left: 2px solid #ffffff;
  }
  .files-card {
    background: #1976d2;
    box-shadow: none !important;
  }
  .icon_files {
    color: #1976d2;
  }
}
.mes {
  &:active {
    transform: scale(0.99);
  }
  .time {
    position: absolute;
    right: 5px;
    bottom: 2px;
    color: #f4f4f4;
    font-size: 0.75rem;
    line-height: 1rem;
  }
  &-img {
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
small.time.path {
  background: rgba(0, 0, 0, 0.637);
  border-radius: 10em;
  padding: 0.2em 0.5em;
  font-size: 14px;
}
@keyframes showReplyMessage {
  0% {
    background: rgba(25, 118, 210, 0);
  }
  50% {
    background: rgba(25, 118, 210, 0.6);
  }
  100% {
    background: rgba(25, 118, 210, 0);
  }
}
</style>

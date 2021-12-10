<template>
  <div>
    <transition name="slide">
      <div
        v-if="reply_info"
        class="d-flex align-center justify-space-between pt-2"
        :class="{ reply_info: reply_info }"
      >
        <div class="d-flex align-center">
          <v-icon size="30">
            mdi-reply-outline
          </v-icon>
          <a
            class="d-flex flex-column ms-2 ps-2 reply-content"
            @click="showReplyMessage(`${reply_info._id}`)"
            :href="`#${reply_info._id}`"
          >
            <h3>{{ reply_info.user.name }}</h3>
            <p
              style="display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;"
              v-html="reply_info.text"
            ></p>
          </a>
        </div>
        <v-btn icon @click="$emit('click:close', null)">
          <v-icon size="30">mdi-close-circle-outline</v-icon>
        </v-btn>
      </div>
    </transition>
    <v-flex xs12 class="outline-none relative d-flex align-end">
      <input
        ref="fileInput"
        type="file"
        style="display:none;"
        multiple
        @change="changeFiles($event)"
      />
      <transition name="fade">
        <div
          class="category-upload"
          @mouseover="showCategory"
          @mouseout="hideCategory"
          v-show="isCategory"
        >
          <div class="category-upload-inner">
            <ul class="category-list-group">
              <li class="category-list" @click="uploadFile">
                <v-icon dark>
                  mdi-file-outline
                </v-icon>
                <span>Files</span>
              </li>
              <li class="category-list" @click="getGeoLocation">
                <v-icon dark>
                  mdi-map-marker-outline
                </v-icon>
                <span>Location</span>
              </li>
            </ul>
          </div>
        </div>
      </transition>
      <!-- <v-text-field
        placeholder="Write a message..."
        clearable
        filled
        autofocus
        tag='textarea'
        color="blue-grey lighten-3"
        v-model="message"
        @keydown.enter="sendMessage"
        :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
        clear-icon="mdi-close-circle"
        label="Message"
        type="text"
        prepend-icon="mdi-paperclip"
        @click:append-outer="sendMessage"
        @click:prepend="toggleCategory"
        @click:clear="clearMessage"
        hide-details="auto"
      /> -->
      <v-btn
        class="mx-2"
        @mouseover="showCategory"
        @mouseout="hideCategory"
        :elevation="0"
        fab
        dark
        color="#212121"
      >
        <v-icon dark>
          mdi-paperclip
        </v-icon>
      </v-btn>
      <div id="message-input-text">
        <div
          id="editable-message-text"
          class="form-control custom-scroll"
          contenteditable="true"
          dir="auto"
          @input="changeMessage($event)"
          @keydown.enter="sendMessage"
          @focus="togglePlaceholder"
          @blur="togglePlaceholder"
          ref="editable_message_text"
        ></div>
        <span class="placeholder-text" v-show="!message" dir="auto"
          >Message</span
        >
      </div>
      <v-btn
        @click="sendMessage"
        class="mx-2"
        :elevation="0"
        fab
        dark
        color="#212121"
      >
        <v-icon dark>
          {{ message ? "mdi-send" : "mdi-microphone" }}
        </v-icon>
      </v-btn>
    </v-flex>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ClickOutside from "vue-click-outside";
export default {
  directives: {
    ClickOutside
  },
  props: ["reply_id"],
  data: () => ({
    text: "",
    message: "",
    dialog: false,
    files: [],
    images: [],
    formFiles: [],
    isCategory: false,
    reply_info: null,
    isPlaceholder: true
  }),
  computed: {
    ...mapState(["user", "users"])
  },
  methods: {
    changeMessage(e) {
      if (this.message == "<br>") {
        this.message = "";
      } else {
        // if (
        //   e.target.innerText.startsWith("```") &&
        //   e.target.innerText.endsWith("```")
        // ) {
        //   this.message = `<pre style="word-break: break-word;">${e.target.innerText.slice(
        //     3,
        //     e.target.innerText.length - 3
        //   )}</pre>`;
        // } else {
        this.$refs.editable_message_text
          .querySelectorAll("*")
          .forEach((el, i) => {
            if (el.tagName === "DIV") {
              el.style.wordBreak = "break-word";
              el.classList.add("pre-wrap");
            }
          });
        this.message = this.$refs.editable_message_text.innerHTML;
        console.log(this.message);
      }
      // }
    },
    sendMessage(e) {
      e.preventDefault();
      if (this.message) {
        this.$socket.emit(
          "createMessage",
          {
            text: this.message,
            from_id: this.user._id,
            user: {
              _id: this.user._id,
              name: this.user.name,
              img: this.user.img
            },
            from: this.user.name,
            room_id: this.$route.params.id,
            reply_to_message_id: this.reply_info
              ? {
                  _id: this.reply_info._id,
                  user: { name: this.reply_info.user.name },
                  text: this.reply_info.text
                }
              : "",
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
        this.reply_info ? this.$emit("click:close", null) : console.log("");
        this.$refs.editable_message_text.innerHTML = "";
        this.message = "";
      }
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    uploadFile() {
      this.$refs.fileInput.click();
    },
    changeFiles(e) {
      console.log(e);
      this.files = null;
      this.files = [];
      this.images = null;
      this.images = [];
      this.formFiles = e.target.files;
      this.files = Array.from(e.target.files);
      this.files.forEach(file => {
        if (file.type.includes("image")) {
          const reader = new FileReader();
          reader.onload = ev => {
            const src = ev.target.result;
            this.images.push({ file, src });
          };
          reader.readAsDataURL(file);
        } else {
          this.images.push({ file });
        }
      });
      this.$emit("change-files", {
        images: this.images,
        files: this.formFiles
      });
      this.$emit("show-dialog", true);
    },
    showCategory() {
      this.isCategory = true;
    },
    hideCategory() {
      this.isCategory = false;
    },
    getGeoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.$emit("get-geo-location", {
            isMap: true,
            location: position.coords
          });
        });
      }
    },
    showReplyMessage(id) {
      document.getElementById(id).classList.add("show-reply-message");
      setTimeout(() => {
        document.getElementById(id).classList.remove("show-reply-message");
      }, 1000);
    },
    focusInput() {
      this.$refs.input.focus();
    },
    togglePlaceholder() {
      this.isPlaceholder = !this.isPlaceholder;
    }
  },
  watch: {
    reply_id(val) {
      if (val) {
        this.users.messages.find((m, i) => {
          if (m._id == val) {
            this.reply_info = m;
          }
        });
      } else {
        this.reply_info = null;
      }
    },
    message(val) {
      if (val == "<br>") {
        this.message = "";
      }
    }
  },
  mounted() {
    console.log(this.users);
  }
};
</script>
<style lang="scss" scoped>
.relative {
  position: relative;
}
.reply_info {
  margin-bottom: 10px;
  .reply-content {
    cursor: pointer;
    border-left: 2px solid #1976d2;
    color: #fff;
    text-decoration: none;
  }
  h3 {
    font-size: 0.9rem;
  }
  p {
    font-size: 0.8rem;
    margin-bottom: 0;
  }
}
.category {
  &-upload {
    position: absolute;
    left: -17px;
    top: -110px;
    max-width: 220px;
    width: 100%;
    padding: 10px;
    &-inner {
      background: #212121;
      border-radius: 15px;
      overflow: hidden;
    }
  }
  &-list {
    padding: 10px 15px;
    transition: all 0.1s ease;
    cursor: pointer;
    &:hover {
      background: #1976d2;
      color: #fff;
    }
    span {
      margin-left: 5px;
    }
    &-group {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding-left: 0;
    }
  }
}
#message-input-text {
  font-weight: 400;
  line-height: 1.5;
  font-size: 16px;
  color: var(--color-text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Roboto",
    "Apple Color Emoji", "Helvetica Neue", sans-serif;
  text-align: left;
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
  .form-control {
    font-weight: 400;
    overflow-wrap: break-word;
    box-sizing: border-box;
    display: block;
    width: 100%;
    color: var(--color-text);
    outline: none;
    word-break: break-word;
    -webkit-appearance: none;
    pointer-events: auto;
    --border-width: 0;
    overflow: auto;
    unicode-bidi: plaintext;
    text-align: initial;
    font-size: var(--composer-text-size, 1rem);
    margin-bottom: 0;
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    caret-color: var(--color-text);
    min-height: 3.5rem;
    max-height: 26rem;
    line-height: 1.3125;
    padding: calc((3.5rem - var(--composer-text-size, 1rem) * 1.3125) / 2) 0;
    transition: height 100ms ease;
    padding-left: 0;
    padding-right: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Roboto",
      "Apple Color Emoji", "Helvetica Neue", sans-serif;
    transition-duration: 150ms;
  }
  .clone {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    z-index: -10;
    unicode-bidi: plaintext;
    text-align: initial;
  }
  .placeholder-text {
    font-weight: 400;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Roboto",
      "Apple Color Emoji", "Helvetica Neue", sans-serif;
    box-sizing: border-box;
    position: absolute;
    color: var(--color-placeholders);
    pointer-events: none;
    unicode-bidi: plaintext;
    text-align: initial;
    line-height: 1.3125;
    font-size: var(--composer-text-size, 1rem);
    bottom: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    top: calc((3.5rem - var(--composer-text-size, 1rem) * 1.3125) / 2);
  }
}
</style>

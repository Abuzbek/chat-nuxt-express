<template>
  <div class="c-wrap">
    <div class="c-chat" ref="block" @contextmenu.prevent>
      <!-- <div
        class="overlay-ctx"
        v-if="openCtxMenu"
        @click="openCtxMenu = false"
        @contextmenu.prevent
      ></div> -->
      <transition name="fade">
        <v-card
          v-click-outside="hideContextMenu"
          :style="
            `top: ${y}px;
            left: ${x}px;`
          "
          v-show="openCtxMenu"
          max-width="250"
          class="context-menu"
        >
          <v-list nav dense class="list">
            <ul class="list-group">
              <li v-for="(n, i) in items" :key="i">
                <a
                  class="list-link"
                  href="#!"
                  @click.prevent="hideContextMenu(i, n)"
                >
                  {{ n.text }}
                </a>
              </li>
            </ul>
          </v-list>
        </v-card>
      </transition>

      <!-- <v-card max-width="374" height="200" class="pa-4 card-emoji">
        <div
          style="display:grid;grid-template-columns: repeat(8, minmax(0, 1fr));gap:5px;"
        >
          <img
            :src="n.src"
            v-for="(n, i) in emoji"
            :key="i"
            alt=""
            style="max-width:100%; height:auto;"
          />
        </div>
      </v-card> -->
      <message
        @contextmenu="openContextMenu($event)"
        @toggle-selected="toggleSelected"
        v-for="(m, i) in messages"
        :key="i"
        :name="m.from"
        :text="m.text"
        :user="m.user"
        :path="m.path"
        :size="m.file_size"
        :file_type="m.mimetype"
        :file_name="m.file_name"
        :date="m.date"
        :_id="m._id"
        :file_id="m.file_id"
        :owner="m.from_id === user._id"
        @file-open="fileOpen"
        @reply="reply"
        :reply_message="m.reply_to_message_id"
      />
    </div>
    <FileUpload
      v-if="dialog"
      :dialog="dialog"
      @click="hideDialog"
      :files="files"
      :formFiles="formFiles"
    />
    <file-viewer :active="activeViewer" @click="hideViewer" :file="file" />
    <div class="c-form" :class="{ reply: reply_id }">
      <chat-form
        @get-geo-location="getGeoLocation"
        @change-files="changeFiles"
        @show-dialog="showDialog"
        :reply_id="reply_id"
        @click:close="emptyReply"
      />
    </div>
    <MapViewer
      @toggleMap="toggleMap"
      :lat="geoLocation.latitude"
      :lng="geoLocation.longitude"
      :zoom="zoom"
      :isMap="isMap"
    />
  </div>
</template>
<script>
import ChatForm from "../../components/chat/ChatForm.vue";
import Message from "../../components/Message.vue";
import { mapState } from "vuex";
import FileUpload from "../../components/chat/FileUpload.vue";
import FileViewer from "../../components/chat/FileViewer.vue";
import MapViewer from "../../components/chat/MapViewer.vue";
import ClickOutside from "vue-click-outside";
import _ from "lodash";
export default {
  directives: {
    ClickOutside
  },
  components: {
    ChatForm,
    Message,
    FileUpload,
    MapViewer,
    FileViewer
  },
  data: () => ({
    isMap: false,
    zoom: 20,
    openCtxMenu: false,
    selectedItem: null,
    geoLocation: {},
    x: 0,
    y: 0,
    items: [
      { text: "Reply", value: "reply" },
      { text: "Copy Text", value: "copy" },
      { text: "Edit", value: "edit" },
      { text: "Delete", value: "delete" },
      { text: "Select", value: "select" }
    ],
    message: [],
    dialog: false,
    files: [],
    formFiles: null,
    activeViewer: false,
    file: null,
    emoji: [],
    firstCount: 0,
    emojiCount: 100,
    message_id: "",
    reply_id: null
  }),
  computed: {
    messages() {
      let messages = this.$store.state.users.messages.filter(message => {
        return message.room_id === this.$route.params.id;
      });
      console.log(messages);
      return messages;
    },
    ...mapState(["user"])
  },
  methods: {
    async fileOpen(_id) {
      const file = await this.$store.dispatch("file/fetchFileById", _id);
      this.file = file;
      this.activeViewer = true;
    },
    hideViewer() {
      this.activeViewer = false;
    },
    hideDialog(dialog) {
      this.dialog = dialog;
    },
    showDialog(dialog) {
      this.dialog = dialog;
    },
    changeFiles(files) {
      this.files = files.images;
      this.formFiles = files.files;
    },
    callEmoji() {
      let status = "";
      for (let i = 0; i < this.emojiCount; i++) {
        import(
          /* webpackChunkName: "message" */ `../../assets/emoji/${this.firstCount}_${i}.png`
        )
          .then(data => {
            if (this.emoji.find(e => e.src == data.default)) {
              return;
            } else {
              status = "success";
              this.emoji.push({ src: data.default, idx: i });
              this.emoji.sort((a, b) => a.idx - b.idx);
            }
          })
          .catch(err => {
            status = "error";
          });
      }
      return status;
    },
    openContextMenu(e) {
      e.preventDefault();
      this.message_id = this.getIdFromElement(e.target);
      this.x = e.clientX;
      this.y = e.clientY;
      this.openCtxMenu = true;
    },
    hideContextMenu(i, n) {
      if (typeof i === "number") {
        this.openCtxMenu = false;
        this[n.value]();
      } else {
        this.openCtxMenu = false;
      }
    },
    getIdFromElement(el) {
      if (el.className.includes("wrap-message")) {
        return el.id;
      } else if (el.className.includes("mes") || el.className.includes("img")) {
        return el.parentElement.id;
      } else {
        return el;
      }
    },
    delete() {
      this.$socket.emit("deleteMessage", this.message_id);
      this.$store.commit("users/deleteMessage", this.message_id);
    },
    copy() {
      const el = document.getElementById(this.message_id);
      const text = el.querySelector(".text-message").innerText;
      navigator.clipboard.writeText(text);
    },
    reply(_id) {
      this.reply_id = _id ? _id : this.message_id;
    },
    edit() {
      this.$store.dispatch("users/editMessage", this.message_id);
    },
    select() {
      this.$store.dispatch("users/selectMessage", this.message_id);
    },
    toggleMap() {
      this.isMap = !this.isMap;
    },
    getGeoLocation({ isMap, location }) {
      this.geoLocation = location;
      this.isMap = isMap;
    },
    emptyReply() {
      this.reply_id = null;
    },
    toggleSelected(selected) {
      console.log(selected);
      // this.messages.forEach(message => {
      //   message.selected = selected;
      // });
    }
  },
  async mounted() {
    this.$socket.emit(
      "get-by-room-user",
      {
        room_id: this.$route.params.id,
        _id: this.user._id
      },
      data => {
        this.$store.commit("users/setFriends", data);
      }
    );

    // navigator.geolocation.getCurrentPosition(async pos => {
    //   this.geoLocation = pos.coords;
    //   this.isMap = true;
    // });
    // console.log(this.geolocation);
    this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
    // var map = L.map('map').setView([51.505, -0.09], 13);
    // this.callEmoji();
    // const scrollEmoji = document.querySelector(".card-emoji");
    // scrollEmoji.addEventListener("scroll", e => {
    //   if (
    //     e.target.scrollTop ===
    //     e.target.scrollHeight - e.target.clientHeight
    //   ) {
    //     this.emojiCount += 100;
    //     const emoji = this.callEmoji();
    //     console.log(emoji);
    //   }
    // });
  },
  watch: {
    messages(val) {
      setTimeout(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-group {
  list-style: none;
  padding: 0px;
  a {
    padding: 2px 6px;
    display: block;
    color: white;
    text-decoration: none;
    border-radius: 3px;
    transition: all 0.3s ease;
    font-size: 13px;
    font-weight: medium;
    &:hover {
      background: #1976d2;
    }
  }
}
.c-wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
}
.c-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 1rem;
  background: #212121;
  z-index: 10;
  &.reply {
    height: auto;
  }
}
.c-chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
  scroll-padding-top: 200px;
}
.card-emoji {
  overflow-y: auto;
}
.context-menu {
  position: fixed;
  z-index: 1000;
  width: 100%;
  background: rgba(56, 56, 56, 0.658);
  border: 1px solid rgba(255, 255, 255, 0.295);
  padding: 5px;
  .list {
    backdrop-filter: blur(15px);
    background: transparent;
    padding: 0px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.overlay-ctx {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>

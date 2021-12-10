<template>
  <v-list subheader class="pa-2">
    <div>
      <div v-if="loading">
        <v-skeleton-loader
          v-for="n in 8"
          :key="n"
          class="mx-auto rounded-lg"
          max-width="300"
          type="list-item-avatar-two-line"
        ></v-skeleton-loader>
      </div>
      <v-subheader v-else-if="!allUsers.length">
        There are no global users.
      </v-subheader>
      <div v-else>
        <div v-for="u in allUsers" :key="u._id">
          <v-list-item
            class="rounded-lg overflow-hidden mb-2 click-rubber-95"
            @click.prevent="addPrivateChat(u)"
            v-if="u._id !== user._id"
            
          >
            <v-list-item-avatar>
              <img :src="u.img" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="u.name"></v-list-item-title>
              <v-list-item-subtitle v-html="u.email"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
      </div>
    </div>
  </v-list>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    loading: false
  }),
  props: ["allUsers"],
  computed: mapState(["user"]),
  methods: {
    async addPrivateChat(u) {
      const dateRoom = Date.now();
      // this.$router.push("/room/" + dateRoom);
      this.$socket.emit("addRoom", { room_id: dateRoom });
      const room = await this.$axios({
        method: "PUT",
        url: "/set-private-user",
        data: {
          main: this.user._id,
          friend: u._id,
          room: dateRoom,
          notification: true
        }
      });
    }
  },
  watch: {
    allUsers(val) {
      if (val.length) {
        this.loading = false;
      }
    }
  }
};
</script>

<style></style>

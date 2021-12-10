<template>
  <v-list subheader class="pa-2">
    <div>
      <div v-if="loading">
        <v-skeleton-loader
          v-for="n in 8"
          :key="n"
          class="mx-auto rounded-0"
          max-width="300"
          type="list-item-avatar-two-line"
        ></v-skeleton-loader>
      </div>
      <v-subheader v-else-if="!users.length">
        There are no users.
      </v-subheader>
      <div v-else>
        <v-list-item class="rounded-lg overflow-hidden mb-2 click-rubber-95" v-for="u in users" :key="u._id" :to="`/room/` + u.room">
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
  </v-list>
</template>
<script>
export default {
  props: ["users"],
  data: () => ({ loading: false })
};
</script>

<style></style>

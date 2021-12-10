<template>
  <v-app-bar
    height="56px"
    class="absolute bottom-0"
    :class="{ 'transition-none': dragged }"
  >
    <div class="grid grid-cols-4 gap-2 h-full w-full">
      <div></div>
      <div
        class="d-flex justify-center align-center click-rubber-90 cursor-pointer "
        @click="$emit('open-contact-list')"
      >
        <v-icon size="30">
          mdi-contacts-outline
        </v-icon>
      </div>
      <div
        class="d-flex justify-center align-center click-rubber-90 cursor-pointer "
        @click="$emit('open-chat-list')"
      >
        <v-icon size="30" class="">
          mdi-forum-outline
        </v-icon>
      </div>
      <div
        class="d-flex justify-center align-center click-rubber-90 cursor-pointer "
        @click="$emit('open-setting')"
      >
        <v-avatar color="primary" size="38" class="">
          <v-img :src="user.img"></v-img>
        </v-avatar>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  props: ["dragged", "user"]
};
</script>

<style></style>

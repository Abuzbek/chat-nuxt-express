<template>
  <div class="c-wrap d-flex justify-center align-center">
    <v-chip></v-chip>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Комната`,
    };
  },
};
</script>

<style scoped>
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
  padding: 1rem;
  height: 80px;
  background: #212121;
}

.c-chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
}
</style>



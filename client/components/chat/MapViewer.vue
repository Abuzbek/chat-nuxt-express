<template>
  <div class="map-viewer" v-if="isMap">
    <div class="overlay-map" @click.stop="$emit('toggleMap', false)"></div>
    <v-card class="rounded-xl dialog">
      <v-card-title class="text-h5">
        <div class="d-flex justify-space-end" style="width: 100%;">
          <v-btn icon @click.stop="$emit('toggleMap', false)">
            <v-icon size="30">mdi-close-circle-outline</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <div class="upload-view">
        <div id="map" @click.stop></div>
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
          @click:append-outer.stop="submitFileMessage"
        />
        <!-- <v-btn color="blue darken-2" text @click="$emit('click', false)">
              <v-icon size="30">mdi-send</v-icon>
            </v-btn> -->
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import { Loader } from "google-maps";
export default {
  props: ["isMap", "lat", "lng", "zoom"],
  data: () => ({ message: "" }),
  methods: {
    async initMap() {
      const loader = new Loader("AIzaSyA87hHCCB5xPl-8ZnSYm8UBr0COGtNKPOs");
      const google = await loader.load();
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: this.lat, lng: this.lng },
        zoom: this.zoom
      });
      const marker = new google.maps.Marker({
        position: { lat: this.lat, lng: this.lng },
        map: map
      });
    },
    submitFileMessage() {}
  },
  async mounted() {
    const loader = new Loader("AIzaSyA87hHCCB5xPl-8ZnSYm8UBr0COGtNKPOs");
    if (this.isMap) {
      const google = await loader.load();
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: this.lat, lng: this.lng },
        zoom: this.zoom
      });
      const marker = await new google.maps.Marker({
        position: { lat: this.lat, lng: this.lng },
        map: map
      });
    }
  },
  watch: {
    isMap(val) {
      if (val) {
        this.initMap();
        console.log(this.$props);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.map-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  .overlay-map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
    z-index: 1000;
    pointer-events: auto;
  }
  #map {
    max-width: 400px;
    width: 100%;
    height: 400px;
  }
  .dialog {
    max-width: 400px;
    width: 100%;
    z-index: 1001;
    pointer-events: auto;
  }
}
</style>

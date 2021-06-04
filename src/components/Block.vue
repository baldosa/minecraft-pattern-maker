<template>
  <img
    v-bind:src="getImg(block.name)"
    :alt="block.name"
    @click="emitImgData(getImg(block.name))"
  />
</template>

<script>
const mcAssets = require("minecraft-assets")("1.16.4")

export default {
  props: {
    block: {
      type: Object,
      require: true
    }
  },
  methods: {
    getImg (name) {
      return mcAssets.textureContent[name].texture
    },
    emitImgData (data) {
      this.$emit('click', {
        block: data
      })
    }
  }
}
</script>

<style scoped>
img {
  width: 3vw;
  height: 3vw;
  margin-right: 0.3em;
  image-rendering: pixelated;
}
</style>

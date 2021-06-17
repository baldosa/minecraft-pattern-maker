<template>
  <img
    class="block"
    :src="image"
    :alt="block.name"
    draggable
    @dragstart="emitImgData(image)"
  />
    <!-- <div class="cube">
      <div :style="cssVars" class="face front"></div>
      <div :style="cssVars" class="face side"></div>
      <div :style="cssVars" class="face top"></div>
    </div> -->
</template>

<script>

export default {
  props: {
    block: {
      type: Object,
      require: true
    }
  },
  computed: {
    image () {
      return require(`@/assets/blocks/${this.block.imgPath}`)
    }
  },
  methods: {
    emitImgData (data) {
      this.$emit('dragend', data)
    }
  }
}
</script>

<style>
img {
  width: 3.1vw;
  height: 3.1vw;
  margin: 0.055vw;
  image-rendering: pixelated;
}
</style>

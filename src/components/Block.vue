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
      this.$emit('dragend', {
        block: data
      })
    }
  }
}
</script>

<style>
img {
  width: 3vw;
  height: 3vw;
  margin-right: 0.3vw;
  image-rendering: pixelated;
}
</style>

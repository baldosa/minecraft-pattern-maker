<template>
  <img
    class="block"
    v-bind:src="getImg(block.name)"
    :alt="block.name"
    draggable
    @dragstart="emitImgData(getImg(block.name))"
  />
    <!-- <div class="cube">
      <div :style="cssVars" class="face front"></div>
      <div :style="cssVars" class="face side"></div>
      <div :style="cssVars" class="face top"></div>
    </div> -->
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
  data () {
    return {
      image: null
    }
  },
  computed: {
    cssVars() {
      console.log(this.image)
      return {
        '--image': `url("${this.image}")`
      }
    }
  },
  mounted () {
    this.image = this.getImg(this.block.name)
  },
  methods: {
    getImg (name) {
      return mcAssets.textureContent[name].texture
    },
    emitImgData (data) {
      this.$emit('dragend', {
        block: data
      })
      console.log('emiting from blocks')
    },
    /**
     * Dragged block to hotbar
     */
    blockToHotbar (e) {
      console.log(e)
      console.log("test")
    }
  }
}
</script>

<style>
img {
  width: 3vw;
  height: 3vw;
  margin-right: 0.3em;
  image-rendering: pixelated;
}
</style>

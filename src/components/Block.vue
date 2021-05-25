<template>
  <img
    v-bind:src="getImg(block.name)"
    :alt="block.name"
    @click="emitImgData(getImg(block.name))"
    :class="{active: isActive}"
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
  data () {
    return {
      isActive: false
    }
   
  },
  methods: {
    getImg (name) {
      return mcAssets.textureContent[name].texture
    },
    emitImgData (data) {
      this.isActive =  !this.isActive
      this.$emit('click', {
        block: data,
        isActive: this.isActive
      })
    }
  }
}
</script>

<style scoped>
img {
  width: 32px;
  height: 32px;
  margin: 10px;
}
.active {
  border: 1px solid #555;
}
</style>

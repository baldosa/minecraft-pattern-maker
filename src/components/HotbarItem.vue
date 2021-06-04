<template>
  <div class="hotbar-item">
    <!-- <div class="cube">
      <div class="face front"></div>
      <div class="face side"></div>
      <div class="face top"></div>
    </div> -->
  </div>
</template>

<script>
export default {
  methods: {
    emitImgData (data) {
      this.$emit('click', {
        block: data
      })
    }
  }
}
</script>

<style scoped>

.hotbar-item {
  background-image: url("/imgs/hotbar-block.png");
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
}
.cube {
  width: 30px;
  height: 30px;
  overflow: hidden;
  
}
.face {
  transform-origin: 0 0;
  position: absolute;
  width: 25px;
  height: 25px;
    
  }
  .front {
    background: blue;
    -ms-transform: rotate(-30deg) skewX(-30deg) translate(130px, 172px) scaleY(0.864);
    -webkit-transform: rotate(-30deg) skewX(-30deg) translate(130px, 172px) scaleY(0.864);
    transform: rotate(-30deg) skewX(-30deg) translate(130px, 172px) scaleY(0.864);
  }
  .top {
    background: red;
    -ms-transform: rotate(210deg) skew(-30deg) translate(-200px, -60px) scaleY(0.864);
    -webkit-transform: rotate(210deg) skew(-30deg) translate(-200px, -60px) scaleY(0.864);
    transform: rotate(210deg) skew(-30deg) translate(-200px, -60px) scaleY(0.864);
  }
  .side {
    background: green;
    -ms-transform: rotate(90deg) skewX(-30deg) scaleY(0.864) translate(68px, -131px);
    -webkit-transform: rotate(90deg) skewX(-30deg) scaleY(0.864) translate(68px, -131px);
    transform: rotate(90deg) skewX(-30deg) scaleY(0.864) translate(68px, -131px);
  }
</style>

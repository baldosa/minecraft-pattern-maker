<template>
  <div class="is-full-screen" ref="canvasBox">
    <v-stage
      ref="stage"
      :config="stageSize"
      @click="handleMouseMove"
    >
      <v-layer>
        <v-rect
          v-for="(rect, index) in rects"
          v-bind:key="index"
          :config="rect"
        />
      </v-layer>
      <v-layer>
        <v-image
          v-for="(square, index) in sqrs"
          v-bind:key="index"
          :config="sqrs[index]"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
          @click="test"
        />
      </v-layer>
    </v-stage>
    <!-- <div
          v-for="(rect, index) in rects"
          v-bind:key="index"
    >
    {{rect}}
    </div> -->

  </div>
</template>

<script>
// const width = window.innerWidth;
const width = window.innerWidth-600;
const height = window.innerHeight;

export default {
  props: {
    sqrs: {
      type: Array,
      requred: true
    }
  },
  data() {
    return {
      stageSize: {
        width: width,
        height: height,
        draggable: true
      },
      isDragging: false
    }
  },
  computed: {
    rects () {
      const SQRWIDTH = 50;
      const SQRHEIGHT = 50;

      let rects = []

      const stagePos = {x: 0, y: 0}
      const startX = Math.floor((-stagePos.x - width) / SQRWIDTH) * SQRWIDTH;
      const endX =
        Math.floor((-stagePos.x + width * 2) / SQRWIDTH) * SQRWIDTH;

      const startY =
        Math.floor((-stagePos.y - height) / SQRHEIGHT) * SQRHEIGHT;
      const endY =
        Math.floor((-stagePos.y + height * 2) / SQRHEIGHT) * SQRHEIGHT;

      var i = 0;
      for (var x = startX; x < endX; x += SQRWIDTH) {
        for (var y = startY; y < endY; y += SQRHEIGHT) {
          if (i === 4) {
            i = 0;
          }

          rects.push(
            {
              x: x,
              y: y,
              width: SQRWIDTH,
              height: SQRHEIGHT,
              stroke: "grey",
              strokeWidth: 0.3
            }
          )
        }
      }
      return rects
    }
  },
  methods: {
    handleDragStart() {
      console.log('handlestart')
      this.isDragging = true;
    },
    handleDragEnd(e) {
      e.target.to({
        x: Math.round(e.target.x() / 50) * 50,
        y: Math.round(e.target.y() / 50) * 50
      })
      console.log('handleend')
      this.isDragging = false;
    },
    test (e) {
      console.log('tap', e)
    },
    handleMouseMove() {
      const mousePos = this.$refs.stage.getNode().getPointerPosition();
      const x = mousePos.x
      const y = mousePos.y
      console.log({x:x, y: y})
      this.$emit('click', {x: x, y: y});
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
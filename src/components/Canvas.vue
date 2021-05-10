<template>
  <div class="is-full-screen" ref="canvasBox">
    <v-stage :config="stageSize">
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
const width = window.innerWidth;
const height = window.innerHeight-50;

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
        height: height
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
      this.isDragging = true;
    },
    handleDragEnd(e) {
      console.log(this.$refs.canvasBox.clientHeight)
      e.target.to({
        x: Math.round(e.target.x() / 50) * 50,
        y: Math.round(e.target.y() / 50) * 50
      })
      console.log('handleend')
      this.isDragging = false;
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
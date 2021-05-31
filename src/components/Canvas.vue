<template>
  <div class="is-full-screen">
    <v-stage
      ref="stage"
      :config="stageSize"
    >
      <v-layer>
        <v-rect
          v-for="(rect, index) in rects"
          v-bind:key="index"
          :config="rect"
          @click="mouseClickOnRect"
        />
      </v-layer>
      <v-layer ref="sqrslyr">
        <v-image
          v-for="(square, index) in sqrs"
          v-bind:key="index"
          :config="sqrs[index]"
          @click="selectBlock(square.id)"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd($event, square.id)"
          @contextmenu="contextMenu($event, square.id)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
const blockSize = 16 * 3
const height = window.innerHeight;

export default {
  props: {
    sqrs: {
      type: Array,
      required: true
    },
    stageWidth: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      stageSize: {
        width: this.stageWidth,
        height: height,
        draggable: true
      },
      isDragging: false,
      sqrWidth: blockSize,
      sqrHeight: blockSize,
      showMenu: false,
      target: null,
      block: null
    }
  },
  computed: {
    rects () {

      let rects = []

      const stagePos = {x: 0, y: 0}
      const startX = Math.floor((-stagePos.x - this.stageWidth) / this.sqrWidth) * this.sqrWidth;
      const endX =
        Math.floor((-stagePos.x + this.stageWidth * 2) / this.sqrWidth) * this.sqrWidth;

      const startY =
        Math.floor((-stagePos.y - height) / this.sqrHeight) * this.sqrHeight;
      const endY =
        Math.floor((-stagePos.y + height * 2) / this.sqrHeight) * this.sqrHeight;

      var i = 0;
      for (var x = startX; x < endX; x += this.sqrWidth) {
        for (var y = startY; y < endY; y += this.sqrHeight) {
          if (i === 4) {
            i = 0;
          }

          rects.push(
            {
              x: x,
              y: y,
              width: this.sqrWidth,
              height: this.sqrHeight,
              stroke: "grey",
              strokeWidth: 0.3,
              center: {
                x: x + ((this.sqrWidth) / 2) + 0.5,
                y: y + ((this.sqrHeight) / 2) + 0.5
              }
            }
          )
        }
      }
      return rects
    }
  },
  mounted() {
    const layer = this.$refs.sqrslyr.getNode()
    const nativeCtx = layer.getContext()._context
    nativeCtx.webkitImageSmoothingEnabled = false
    nativeCtx.mozImageSmoothingEnabled = false
    nativeCtx.imageSmoothingEnabled = false
  },
  methods: {
    handleDragStart () {
      console.log('handlestart')
      this.isDragging = true;
    },
    handleDragEnd (e, blockId) {
      e.target.to({
        x: Math.round(e.target.x() / this.sqrHeight) * this.sqrWidth,
        y: Math.round(e.target.y() / this.sqrHeight) * this.sqrWidth
      })
      console.log('handleend')
      this.isDragging = false;
      this.$emit('dragend', {
        position: {
          x: Math.round(e.target.x() / this.sqrHeight) * this.sqrWidth,
          y: Math.round(e.target.y() / this.sqrHeight) * this.sqrWidth
        },
        blockId: blockId,
        center: {
          x: Math.round(e.target.x() / this.sqrHeight) * this.sqrWidth + ((this.sqrWidth) / 2) + 0.5,
          y: Math.round(e.target.y() / this.sqrHeight) * this.sqrWidth + ((this.sqrHeight) / 2) + 0.5
        }
      })
    },
    contextMenu (e, blockId) {
      if (e.evt.button === 2) {
        e.evt.preventDefault()
        this.$emit('contextmenu', {
         blockId: blockId
        })
      }
    },
    mouseClickOnRect(event) {
      if (event.target.attrs.center && event.evt.button === 0) {
        this.$emit('click', event.target.attrs.center)
      }
    },
    selectBlock (blockId) {
      this.$emit('clicked', blockId)
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

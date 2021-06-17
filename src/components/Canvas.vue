<template>
  <div>
    <v-stage
      ref="stage"
      :config="stageSize"
      @wheel="handleZoom"
    >
      <v-layer>
        <v-rect
          v-for="(rect, index) in rects"
          v-bind:key="index"
          :config="rect"
          @contextmenu="mouseClickOnRect"
        />
      </v-layer>
      <v-layer ref="sqrslyr">
        <v-image
          v-for="(square, index) in sqrs"
          v-bind:key="index"
          :config="sqrs[index]"
          @click="selectBlock($event, square.id)"
          @dragend="handleDragEnd($event, square.id)"
          @mousemove="getBlockId($event, square.id)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
const blockSize = 16 * 3
const height = window.innerHeight;
const width = window.innerWidth;

export default {
  props: {
    sqrs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      stageSize: {
        width: width,
        height: height,
        draggable: true,
        scaleX: 1,
        scaleY: 1
      },
      sqrWidth: blockSize,
      sqrHeight: blockSize,
      block: null
    }
  },
  computed: {
    rects () {

      let rects = []

      const stagePos = {x: 0, y: 0}
      const startX = Math.floor((-stagePos.x - width) / this.sqrWidth) * this.sqrWidth;
      const endX =
        Math.floor((-stagePos.x + width * 2) / this.sqrWidth) * this.sqrWidth;

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
    handleDragEnd (e, blockId) {
      // aligns block to grid
      const x = Math.round(e.target.x() / this.sqrHeight) * this.sqrWidth
      const y = Math.round(e.target.y() / this.sqrHeight) * this.sqrWidth
      e.target.to({
        x: x,
        y: y
      })
      // emits info to parent
      this.$emit('dragend', {
        position: {
          x: x,
          y: y
        },
        blockId: blockId,
        center: {
          x: x + ((this.sqrWidth) / 2) + 0.5,
          y: y + ((this.sqrHeight) / 2) + 0.5
        }
      })
    },
    mouseClickOnRect(event) {
      event.evt.preventDefault()
      if (event.target.attrs.center && event.evt.button === 2) {
        this.$emit('placeBlock', event.target.attrs.center)
      }
    },
    selectBlock (event, blockId) {
      event.evt.preventDefault()
      this.$emit('getBlock', blockId)
    },
    handleZoom (e) {
      const scaleBy = 1.15
      const newScale = e.evt.deltaY < 0 ? this.stageSize.scaleX * scaleBy : this.stageSize.scaleX / scaleBy
      this.stageSize.scaleX = newScale
      this.stageSize.scaleY = newScale
    },
    getBlockId (event, blockId) {
      event.evt.preventDefault()
      this.$emit('selBlock', blockId)
    }
  }
};
</script>


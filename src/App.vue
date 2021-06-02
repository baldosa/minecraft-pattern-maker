<template>
  <div id="app" class="row is-marginless">
    <div class="col-9 is-marginless" ref="canvas">
      <Canvas
        v-if="loaded"
        :sqrs.sync="sqrs"
        :stage-width="stageWidth"
        @click="addBlockToCanvas"
        @contextmenu="contextMenu"
        @dragend="handleBlockReposition"
        @clicked="selectBlock"
      />
    </div>
    <div class="col-3 bg-light">
      <div
        v-if="Object.keys(square).length"
        class="row"
      >
        <div class="col">
          <img
            :src="square.block"
            :style="`transform: rotate(${square.rotation}deg);`"
          />
          <div class="row">
            <div class="col">
              <button class="button icon-only" @click="previewRotate(-90)">↪</button>
              <button class="button icon-only" @click="previewRotate(90)">↩</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input
            id="search"
            type="text"
            value="glazed"
            @input="searchBlock"
          />
          <div
            class="mt-2"
            v-if="filteredBlocks"
          >
            <Block
              v-for="(block, index) in filteredBlocks"
              v-bind:key="index"
              :block="block"
              @click="getImgData"
            />
          </div>
        </div>
      </div>
      <div ref="menu" id="menu">
        <div class="row">
          <button class="col button icon-only" @click="rotateLeft">↪</button>
          <button class="col button icon-only" @click="rotateRight">↩</button>
          <button class="col button icon-only" @click="delImage">➖</button>
          <button class="col button icon-only" @click="closeMenu">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue'
import blocks from '@/assets/blocks.json'
import Block from '@/components/Block'

const blockSize = 16 * 3

export default {
  name: 'App',
  components: {
    Canvas,
    Block
  },
  data () {
    return {
      loaded: false,
      sqrs: [],
      pos: {
        x: 20,
        y: 20
      },
      square: {},
      image: null,
      blocks: blocks,
      searchVal: 'glazed',
      debounce: null,
      filteredBlocks: [],
      sqrId: 0,
      selectedSqr: null
    }
  },
  mounted () {
    this.stageWidth = this.$refs.canvas.clientWidth
    this.loaded = true
    this.filteredBlocks = this.blocks.filter((item) => (item.name.includes(this.searchVal.toLowerCase()) && item.texture))
    console.log(this.filteredBlocks)

  },
  methods: {
    /**
     * When result block is clicked loads the image
     */
    getImgData (block) {
      const image = new Image()
      image.src = block.block
      image.onload = () => {
        this.image = image
        this.square = {
          image: image,
          block: block.block,
          rotation: 0
        }
        }
    },
    /**
     * Adds selected block to canvas
     */
    addBlockToCanvas (pos) {
      this.pos = pos
      this.sqrId = this.sqrId + 1
      const square = { ...this.square }
      Object.assign(square, {
        x: Math.round((this.pos.x-1) / blockSize) * blockSize,
        y: Math.round((this.pos.y-1) / blockSize) * blockSize,
        width: blockSize,
        height: blockSize,
        draggable: true,
        shadowBlur: 0,
        center: {
          x: this.pos.x,
          y: this.pos.y
        },
        id: this.sqrId,
        rotation: 0
      })
      // do stuff to align new sqr to grid
      this.sqrs.push(square)
      if (this.square.rotation != 0) {
        let sqr = this.sqrs.find(obj => obj.id == this.sqrId)
        this.rotateAroundCenter(sqr, this.square.rotation)
      }
    },
    /**
     * search while typing
     */
    searchBlock (event) {
      this.filteredBlocks = null
      this.searchVal = null
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.searchVal = event.target.value
        if (event.target.value) {
          this.filteredBlocks = this.blocks.filter((item) => (item.name.includes(this.searchVal.toLowerCase()) && item.texture))
          this.filteredBlocks.map((obj) => {
            obj.active = false
          })
        }
      }, 600)
    },

    contextMenu (data) {
      console.log(data)
      this.selectedSqr = data.blockId
      // show menu
      let menuNode = this.$refs.menu
      menuNode.style.display = 'block'
      menuNode.style.top = data.center.y + 4 +'px'
      menuNode.style.left = data.center.x + 4 + 'px'
    },
    delImage () {
      // let blockInfo = this.sqrs.filter(block => block.id = this.selectedSqr)[0]
      this.sqrs = this.sqrs.filter((obj) => {
        return obj.id !== this.selectedSqr;
      })

      this.$refs.menu.style.display = 'none'
    },
    rotateRight () {
      let sqr = this.sqrs.find(obj => obj.id == this.selectedSqr)
      const rotation = sqr.rotation + 90
      this.rotateAroundCenter(sqr, rotation)
      console.log('end', sqr.x, sqr.y)
    },
    rotateLeft () {
      let sqr = this.sqrs.find(obj => obj.id == this.selectedSqr)
      const rotation = sqr.rotation - 90
      this.rotateAroundCenter(sqr, rotation)
    },
    closeMenu () {
      this.$refs.menu.style.display = 'none'
    },
    handleBlockReposition (data) {
      let sqr = this.sqrs.find(obj => obj.id == data.blockId)
      sqr.x = data.position.x
      sqr.y = data.position.y
      sqr.center = data.center
      console.log(sqr.center)
    },
    selectBlock (blockId) {
      console.log(blockId)
    },
    rotatePoint ({ x, y }, deg) {
    const degToRad = Math.PI / 180
    const rcos = Math.cos(deg * degToRad), rsin = Math.sin(deg * degToRad)
    return {x: x*rcos - y*rsin, y: y*rcos + x*rsin}
    },
    rotateAroundCenter (sqr, rotation) {
      const topLeft = { x: -blockSize / 2, y: -blockSize / 2 }
      const current = this.rotatePoint(topLeft, sqr.rotation)
      const rotated = this.rotatePoint(topLeft, rotation)
      const dx = rotated.x - current.x, 
        dy = rotated.y - current.y

      sqr.x = Math.round((sqr.x + dx-1) / blockSize) * blockSize
      sqr.y = Math.round((sqr.y + dy-1) / blockSize) * blockSize
      sqr.rotation = rotation
    },
    previewRotate (deg) {
      this.square.rotation = this.square.rotation + deg
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#menu {
  display: none;
  position: absolute;
}

#menu button {
  width: 100%;
  border: none;
  margin: 0;
  padding: 15px;
}
img {
  width: 48px;
  height: 48px;
  margin: 10px;
  image-rendering: pixelated;
}
</style>

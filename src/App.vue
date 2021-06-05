<template>
  <div id="app" class="row is-marginless">
    <div class="is-marginless" ref="canvas">
      <Canvas
        :sqrs.sync="sqrs"
        @click="addBlockToCanvas"
        @contextmenu="contextMenu"
        @dragend="handleBlockReposition"
        @clicked="selectBlock"
      />
    </div>
    <div
      v-if="visibleMenu"
      id="creative-modal"
    >
      <div class="creative-container">
        <div id="search-box">
          <!-- <input
            id="search"
            type="text"
            value="glazed"
            @input="searchBlock"
          /> -->
          asd
        </div>
        <div id="block-modal">
          <Block
            v-for="(block, index) in filteredBlocks"
            v-bind:key="index"
            :block="block"
            @click="getImgData"
          />
        </div>
        <div>
          HOTBAR
        </div>
      </div>
    </div>
    <div id="hotbar">
      <div class="hotbar-container">
          <div 
            v-for="n in 9"
            :key="n"
            class="hotbar-child"
          >

          </div>
      </div>
    </div>
  </div>
</template>

<script>
import blocks from '@/assets/blocks.json'
import Canvas from './components/Canvas.vue'
import Block from '@/components/Block'
// import HotBarItem from '@/components/HotbarItem.vue'

const blockSize = 16 * 3
export default {
  name: 'App',
  components: {
    Canvas,
    Block,
    // HotBarItem
  },
  data () {
    return {
      visibleMenu: true,
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
  created () {
    window.addEventListener("keydown", this.keyboardListener);
  },
  destroyed () {
    window.removeEventListener("keydown", this.keyboardListener);
  },
  mounted () {
    this.filteredBlocks = this.blocks.filter((item) => (item.name.includes(this.searchVal.toLowerCase()) && item.texture))
  },
  methods: {
    /**
     * Keydown handler
     */
    keyboardListener (event) {
      console.log('pressed', event.key)
      if (event.key === "e" || event.key === "E") {
        this.showMenu()
      }
    },
    /**
     * Shows menu
     */
    showMenu () {
      this.visibleMenu = !this.visibleMenu
    },
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
    /**
     * get blockid on right click
     */
    contextMenu (data) {
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
@font-face
{
  font-family: '1 Minecraft-Regular';
    src: url('/css/webfonts/1 Minecraft-Regular.woff') format('woff'),
      url('/css/webfonts/1 Minecraft-Regular.eot'),
      url('/css/webfonts/1 Minecraft-Regular.eot?#') format('embedded-opentype'),
      url('/css/webfonts/1 Minecraft-Regular.ttf') format('truetype');
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#hotbar {
  display: flex;
  position: absolute;
  z-index: 1; /* Sit on top */
  bottom: 0;
  margin-left: auto;
  margin-left: auto;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.hotbar-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  height: 100%
}

.hotbar-child {
  height: 3.8vw;
  width: 3.8vw;
  background-image: url("/imgs/hotbar-block.png");
  background-repeat: no-repeat;
  background-size: cover;
}

/* modal */
#creative-modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}
.creative-container {
  margin-top: 25vh;
  height: 50%;
  width: 40%;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 6.26fr 1.93fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  justify-items: center;
  align-items: center;
}
#search-box {
  background-image: url("/imgs/creative_search.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%

}
</style>

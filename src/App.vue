<template>
  <div v-hotkey="keymap" id="app" class="row is-marginless">
    <div class="is-marginless" ref="canvas">
      <Canvas
        :sqrs.sync="sqrs"
        @placeBlock="addBlockToCanvas"
        @dragend="handleBlockReposition"
        @getBlock="deleteBlock"
        @selBlock="handleBlockSelection"
      />
    </div>
    <div
      v-if="visibleMenu"
      id="creative-modal"
      v-hotkey.stop="keymap"
    >
      <div class="creative-container">
        <div id="search-box">
          <input
            id="search"
            type="text"
            @input="searchBlock"
          />
          <!-- asd -->
        </div>
        <div id="blocks-modal">
          <Block
            v-for="(block, index) in filteredBlocks"
            v-bind:key="index"
            :block="block"
            draggable
            @dragend="getImgData"
          />
        </div>
        <div id="hotbar-modal" 
            >
          <div 
            class="hotbar-modal-child"
            v-for="item in hotbar"
            :key="item.slot"
            @drop="blockToHotbar(item.slot)"
            @dragenter.prevent @dragover.prevent
          >
            <img v-if="item.image"
              v-bind:src="item.image.src"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="hotbar">
      <div class="hotbar-container">
          <div 
            v-for="item in hotbar"
            :key="item.slot"
            class="hotbar-child"
          >
            <img v-if="item.image"
              v-bind:src="item.image.src"
            />
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import blocks from '@/assets/blocks.json'
import Canvas from './components/Canvas.vue'
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
      visibleMenu: false,
      hotbar: [
        {
          slot: 1,
          image: null,
        },
        {
          slot: 2,
          image: null,
        },
        {
          slot: 3,
          image: null,
        },
        {
          slot: 4,
          image: null,
        },
        {
          slot: 5,
          image: null,
        },
        {
          slot: 6,
          image: null,
        },
        {
          slot: 7,
          image: null,
        },
        {
          slot: 8,
          image: null,
        },
        {
          slot: 9,
          image: null,
        },
      ],
      sqrs: [],
      pos: {
        x: 20,
        y: 20
      },
      square: {},
      image: null,
      blocks: blocks,
      debounce: null,
      filteredBlocks: [],
      sqrId: 0,
      selectedSqr: null
    }
  },
  computed: {
    keymap () {
      return {
        // 'esc+ctrl' is OK.
        'e': this.showModal,
        '1': this.handleHotbarKey,
        '2': this.handleHotbarKey,
        '3': this.handleHotbarKey,
        '4': this.handleHotbarKey,
        '5': this.handleHotbarKey,
        '6': this.handleHotbarKey,
        '7': this.handleHotbarKey,
        '8': this.handleHotbarKey,
        '9': this.handleHotbarKey,
        'a': this.rotateLeft,
        'd': this.rotateRight
      }
    }
  },
  mounted () {
    this.filteredBlocks = this.blocks.filter((item) => (item.name.includes('glazed') && item.texture))
  },
  methods: {
    /**
     * Shows menu
     */
    showModal () {
      this.visibleMenu = !this.visibleMenu
    },
    /**
     * Dragged block to hotbar
     */
    blockToHotbar (slot) {
      this.hotbar.find(obj => obj.slot == slot).image = this.image
    },
    /**
     * select item in hotbar
     */
    handleHotbarKey (e) {
      this.selectHotbar(e.key)
    },
    selectHotbar (slot) {
      this.image = this.hotbar.find(obj => obj.slot == slot).image
      this.square = {
          image: this.image,
          rotation: 0
        }
    },
    /**
     * When result block is dragend loads the image
     */
    getImgData (block) {
      const image = new Image()
      image.src = block.block
      image.onload = () => {
        this.image = image
      }
    },
    /**
     * Adds selected block to canvas
     */
    addBlockToCanvas (pos) {
      this.pos = pos
      this.sqrId = this.sqrId + 1
      this.selectedSqr = this.sqrId
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
    rotateRight () {
      let sqr = this.sqrs.find(obj => obj.id == this.selectedSqr)
      const rotation = sqr.rotation + 90
      this.rotateAroundCenter(sqr, rotation)
    },
    rotateLeft () {
      let sqr = this.sqrs.find(obj => obj.id == this.selectedSqr)
      const rotation = sqr.rotation - 90
      this.rotateAroundCenter(sqr, rotation)
    },
    handleBlockReposition (data) {
      let sqr = this.sqrs.find(obj => obj.id == data.blockId)
      sqr.x = data.position.x
      sqr.y = data.position.y
      sqr.center = data.center
    },
    deleteBlock (blockId) {
      this.sqrs = this.sqrs.filter((obj) => {
        return obj.id !== blockId;
      })
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
    handleBlockSelection (data) {
      this.selectedSqr = data
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
img {
  image-rendering: pixelated;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/** hotbar **/
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
  overflow: hidden;
  position: relative;
}
.hotbar-child img {
    position: absolute;
    left: -1000%;
    right: -1000%;
    top: -1000%;
    bottom: -1000%;
    margin: auto;
    min-height: 80%;
    min-width: 80%;
}

/* modal */
#creative-modal {
  display: block;
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}
.creative-container {
  margin-top: 5vw;
  height: 25vw;
  width: 35vw;
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
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-image: url("/imgs/creative_search.png");
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  
}
#search-box input[type="text"] {
  background: transparent;
  border: none;
  text-align: right;
  padding-right: 2vw;
  font-family: "1 Minecraft-Regular";
}

#blocks-modal {
  width: 100%;
  height: 100%;
  background-image: url("/imgs/block-grid.png");
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  padding-top: 1vw;
}

#hotbar-modal {
  width: 100%;
  height: 100%;
  background-image: url("/imgs/hotbar-search.png");
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

}
.hotbar-modal-child {
  height: 3.5vw;
  width: 3.5vw;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  position: relative;
}
</style>

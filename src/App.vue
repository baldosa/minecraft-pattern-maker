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
          <ul class="blocks">
            <li
              v-for="(block, index) in filteredBlocks"
              v-bind:key="index"
            >
              <Block
                :block="block"
                draggable
                @dragend="getImgData"
              />
            </li>
          </ul>
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
    <div id="help">
      <button
        class="btn-help"
        @click="help"
        v-if="!showHelp"
      >
        <mdicon name="help" /> 
      </button>
      <div
       v-if="showHelp"
       class="help-menu"
      >
        <div class="row">
          <div class="col-4">
            <button
              @click="save"
            >
              <mdicon name="content-save" /> 
            </button>
          </div>
          <div class="col-4">
            <label class="button">
                <input
                  ref="file"
                  type="file"
                  @change="load"
                />
                <mdicon name="upload" /> 
            </label>

          </div>
          <div class="col-4">
            <button
              @click="exportJson"

            >
              <mdicon name="download" /> 
            </button>
          </div>
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
      selectedSqr: null,
      showHelp: false,
      downloadUrl: null
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
    // filter glazed for start
    this.filteredBlocks = this.blocks.filter((item) => (item.blockName.includes('glazed')))

    // reads localstorage
    if (localStorage.sqrs) {
      const localStorageSqrs = JSON.parse(localStorage.sqrs)
      localStorageSqrs.forEach((el) => {
        el.image = this.getImgData(el.img)
      })
      this.sqrs = localStorageSqrs
      this.sqrId = localStorageSqrs.reduce((max, p) => p.id > max ? p.id : max, localStorageSqrs[0].id)+1
    }

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
          img: this.image.src,
          rotation: 0
        }
    },
    /**
     * When result block is dragend loads the image
     */
    getImgData (base64Img) {
      const image = new Image()
      image.src = base64Img
      image.onload = () => {
        this.image = image
      }
      return image
    },
    /**
     * Adds selected block to canvas
     */
    addBlockToCanvas (pos) {
      if (this.image) {
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
          this.filteredBlocks = this.blocks.filter((item) => (item.blockName.includes(this.searchVal.toLowerCase())))
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
    },
    help () {
      this.showHelp = !this.showHelp
    },
    save () {
      this.sqrs = this.sqrs.filter((item) => {
          return (item.image !== null && this.img !== null)
      })
      localStorage.removeItem('sqrs')
      localStorage.sqrs = JSON.stringify(this.sqrs)
      // console.log(this.sqrs)
    },
    load () {
      if (this.$refs.file.files[0]) {
        console.log(this.$refs.file.files[0])
        let importedFile = this.$refs.file.files[0]
        const vm = this
        let reader = new FileReader();
        reader.onload = function() {
          let fileContent = JSON.parse(reader.result);

          fileContent.forEach((el) => {
            el.image = vm.getImgData(el.img)
          })
          vm.sqrs = fileContent
          vm.sqrId = fileContent.reduce((max, p) => p.id > max ? p.id : max, fileContent[0].id)+1
        };
        reader.readAsText(importedFile)

      }
    },
    exportJson () {
      let contentType = 'application/json'
      let dData = JSON.stringify(this.sqrs, null, 2)
      let blob = new Blob([dData], { type: contentType })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'mc-pattern.json'
      document.body.appendChild(link);
      link.click()
      document.body.removeChild(link);
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
  font-family: "1 Minecraft-Regular";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

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
    ::-webkit-scrollbar {
      width: 10px;
    }
    #blocks-modal {
      width: 100%;
      height: 100%;
      background-image: url("/imgs/block-grid.png");
      background-repeat: no-repeat;
      background-size: cover;
      image-rendering: pixelated;
      padding-top: 0.15vw;
      padding-left: 1.1vw;
      padding-right: 1.3vw;
      overflow: auto;
    }

    ul.blocks {
      list-style: none;
      margin: 0;
      padding: 0;
    }
      ul.blocks li {
        display: inline;
        margin: 0.2vw;
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
      padding-top: 1.1vw;
      padding-left: 1.3vw;
      padding-right: 1.1vw;
      column-gap: 0.05vw;

    }
    .hotbar-modal-child {
      height: 3.5vw;
      width: 3.5vw;
      background-repeat: no-repeat;
      background-size: cover;
      overflow: hidden;
      position: relative;
    }

/* help */
#help {
  display: flex;
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  margin-top: 1vw;
  margin-right: 1vw;
}
.btn-help {
  background: orange;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
}
.help-menu {
  background: #CCC;
  width: 30vw;
  height: 100%;
  padding: 3em;
}


input[type="file"] {
    display: none!important;;
}
.custom-file-upload {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}
</style>

<template>
  <div id="app" class="row is-marginless">
    <div class="col-9 is-marginless">
      <Canvas
        :sqrs="sqrs"
        @click="setPos"
      />
    </div>
    <div class="col-3 bg-light is-marginless">
      {{ pos }}
      <Menu
        @click="getBlock"
      />
    </div>
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue'
import Menu from './components/Menu.vue'
export default {
  name: 'App',
  components: {
    Canvas,
    Menu
  },
  data () {
    return {
      sqrs: [],
      pos: {
        x: 20,
        y: 20
      },
      newSqr: {},
      image: null
    }
  },
  methods: {
    add () {
      console.log('add img')
      this.sqrs.push(
        {
          x: 20,
          y: 20,
          width: 50,
          height: 50,
          // fill: 'red',
          draggable: true,
          shadowBlur: 0,
          image: this.image
        }
      )
    },
    getBlock (val) {
      const image = new Image()
      image.src = val
      image.onload = () => {
        this.image = image
      }
    },
    setPos (pos) {
      this.pos = pos
      this.newSqr = {
        x: this.pos.x,
        y: this.pos.y,
        width: 50,
        height: 50,
        draggable: true,
        shadowBlur: 0,
        image: this.image
      }
      this.sqrs.push(this.newSqr)
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
</style>

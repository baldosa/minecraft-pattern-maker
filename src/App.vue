<template>
  <div id="app" class="row is-marginless">
    <div class="col-9 is-marginless">
      <Canvas
        :sqrs="sqrs"
      />
    </div>
    <div class="col-3 bg-light is-marginless">
      Menu
      <button @click="add">ADD!</button>
      <button @click="rotate">ROTATE!</button>
    </div>
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue'
export default {
  name: 'App',
  components: {
    Canvas
  },
  data () {
    return {
      sqrs: [
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
      ],
      image: null
    }
  },
  created() {
    console.log('create img')
    const image = new window.Image();
    image.src = "https://raw.githubusercontent.com/ZtechNetwork/MCBVanillaResourcePack/master/textures/blocks/glazed_terracotta_black.png";
    // image.src = "../assets/glazed_terracotta_black.png"
    image.style.transform = 'rotate(45deg)'
    image.onload = () => {
      // set image only when it is loaded
      this.image = image
      console.log(this.image)
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
    rotate () {
      console.log('rotate')
      this.sqrs[0].rotation = 90
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

<template>
  <div>
    <!-- <button @click="add">ADD!</button> -->
    <button @click="getImgs('terracotta')">TEST!</button>
    <label for="search">
      Search blocks
    </label>
    <input
      id="search"
      type="text"
      placeholder="Text Input"
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
        :is-active="false"
        @click="getImgData"
      />
    </div>
    {{ typing }}
  </div>
</template>

<script>
import blocks from '@/assets/blocks.json'
import Block from '@/components/Block'

export default {
  components: {
    Block
  },
  data() {
    return {
      blocks: blocks,
      searchVal: null,
      typing: false,
      debounce: null,
      filteredBlocks: null
    }
  },
  methods: {
    searchBlock (event) {
      this.filteredBlocks = null
      this.searchVal = null
      this.typing = true
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.typing = false
        this.searchVal = event.target.value
        if (event.target.value) {
          this.filteredBlocks = this.blocks.filter((item) => item.name.includes(this.searchVal.toLowerCase()))
        }
      }, 600)
    },
    getImgData (value) {
      this.$emit('click', value.block)
    }
  }
}
</script>


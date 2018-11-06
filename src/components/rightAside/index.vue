<template lang="pug">
  .con(v-show="showAside")
    .bg(@click='hide', :style='{"background": bg}')
    .content(:style='{width: width + "px", right: -asideWidth + "px"}')
      slot 123
</template>
<script>
export default {
  props: {
    width: {
      default: 400
    }
  },
  data () {
    return {
      showAside: false,
      asideWidth: this.width,
      bg: 'rgba(0,0,0,0)'
    }
  },
  methods: {
    show () {
      this.showAside = true
      clearTimeout(this.hidetime)
      this.showtime = setTimeout(() => {
        this.asideWidth = 0
        this.bg = 'rgba(0,0,0,0.3)'
      }, 10)
    },
    hide () {
      this.asideWidth = this.width
      this.bg = 'rgba(0,0,0,0)'
      clearTimeout(this.showtime)
      this.hidetime = setTimeout(() => {
        this.showAside = false
      }, 300)
    }
  }
}
</script>

<style lang="stylus" scoped>
.con
  width 100vw
  height 100vh
  position fixed
  left 0
  top 0
  z-index 99
.bg
  width 100%
  height 100%
  position absolute
  z-index -1
  transition all 0.3s ease
.content
  position absolute
  right 0
  top 0
  z-index 2
  height 100vh
  background white
  transition all 0.3s ease
</style>

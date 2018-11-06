<template lang="pug">
  //- .pagecontent
  .content
    .img
      img(:src="titlePageUrl")
    .fayaobody
      .bodygroup
        img(:src="dispensingfeesUrl")
        .title(:class="[$store.state.userAgent ? 'paddingTop10' : 'paddingTop20']") 门诊列表
        span 挂号、诊疗
        span 开药一步到位

      .bodygroup
        img(:src="doctorvisitsUrl")
        .title(:class="[$store.state.userAgent ? 'paddingTop10' : 'paddingTop20']") 收费发药
        span 多种方式收费
        span 便捷快速发药

      .bodygroup
        img(:src="druginventoryUrl")
        .title(:class="[$store.state.userAgent ? 'paddingTop10' : 'paddingTop20']") 药品进销存
        span 采购入库
        span 盘点审核流程化操作

      .bodygroup
        img(:src="statisticsUrl")
        .title(:class="[$store.state.userAgent ? 'paddingTop10' : 'paddingTop20']") 数据统计
        span 多维度
        span 多方面提供管理统计

</template>
<script>
const titlePage = require('@/assets/img/firstpage/titlepage.png')
const pageOne = require('@/assets/img/firstpage/dispensingfees.png')
const pageTwo = require('@/assets/img/firstpage/doctorvisits.png')
const pageThe = require('@/assets/img/firstpage/druginventory.png')
const pageFor = require('@/assets/img/firstpage/statistics.png')
export default {
  data () {
    return {
      titlePageUrl: titlePage,
      dispensingfeesUrl: pageOne,
      doctorvisitsUrl: pageTwo,
      druginventoryUrl: pageThe,
      statisticsUrl: pageFor
    }
  },
  created () {
    this.$store.commit('jump', {type: 1})
  }
}
</script>
<style lang="stylus" scoped>
.content
  height calc(100vh - 70px)
  background #00daff
  .img
    width 100%
    // height 360px
    img 
      width 100%
      // height 650px
  .fayaobody
    // padding 20px 0
    display flex
    flex-direction row
    .bodygroup
      flex 1
      display flex
      flex-direction column
      align-items center
      .title
        color #FFF
        font-size 18px
        &.paddingTop10
          padding 10px 0
        &.paddingTop20
          padding 20px 0 10px 0
      span 
        font-size 14px
        color #FFF
        font-weight normal
        padding-bottom 5px
</style>

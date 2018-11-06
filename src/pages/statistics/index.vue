<template lang="pug">
  .pagecontent
    router-view
</template>

<script>
import Vue from 'vue'
import ECharts from 'vue-echarts'

// 注册组件后即可使用
Vue.component('chart', ECharts)
export default {
}
</script>

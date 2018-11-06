<template lang="pug">
  router-view
</template>


<script>
import router from './router'
import store from './store'
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (!store.state.userToken) {
      next({path: '/login', query: {hostory: router.currentRoute.fullPath}})
    } else {
      next()
    }
  }
})
export default {
  name: 'app'
}
</script>

<style lang='stylus'>
@import './assets/css/init'
</style>

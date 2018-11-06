<template lang="pug">
  .logonbody
    .bgimg
    .content
      .logo
      .info —— 基层智慧医疗服务平台 ——
      .formbody
        .title 账号登录
        .lists
          .line
            i.icon.user
            input(type="text", v-model="user.loginName", placeholder="请输入用户名")
          .line
            i.icon.pwd
            input(type="password", v-model="user.passwd", placeholder="请输入密码", @keyup.enter="login")
        .bm
          .btn(@click='login') 登录
          .right
            el-checkbox.loginck(label="记住密码", v-model="jzpwd")
            // router-link.wj(to="")  &nbsp;/&nbsp; 忘记密码
    .bottom ©️ 2016 Acmedcare.com All Rights Reserved.
</template>
<script>
export default {
  data () {
    return {
      user: {
        loginName: '',
        passwd: ''
      },
      jzpwd: false
    }
  },
  methods: {
    login () {
      if (this.jzpwd) {
        this.user.jzpwd = this.jzpwd
        this.$setStore('loginUser', this.user)
      } else {
        this.$setStore('loginUser', {
          loginName: this.user.loginName
        })
      }
      if (this.user.loginName === '') {
        this.$message.error('登陆名不能为空！')
        return false
      }
      if (this.user.passwd === '') {
        this.$message.error('请填写密码！')
        return false
      }
      this.$store.commit('login', this.user)
    }
  },
  created () {
    let user = this.$getStore('loginUser')
    if (user && user.loginName) {
      this.user.loginName = user.loginName
    }
    if (user && user.passwd) {
      this.user.passwd = user.passwd
    }
    if (user && user.jzpwd) {
      this.jzpwd = user.jzpwd
    }
    if (this.$store.state.userToken) {
      if (this.$router.currentRoute.query && this.$router.currentRoute.query.hostory) {
        this.$router.push({path: this.$router.currentRoute.query.hostory})
      } else {
        this.$router.push({path: '/'})
      }
    }
  }
}
</script>

<style lang="stylus">
@import './../../assets/css/var.styl'
.loginck
  margin-left 30px
  &.is-checked
    .el-checkbox__label
      color $elBlack
  .el-checkbox__label
    padding-left 5px
    font-size 12px
    color $elBlack
</style>

<style lang="stylus" scoped>
@import './../../assets/css/var.styl'
.logonbody
  width 100vw
  height 100vh
  margin 0
  padding 0
  overflow hidden
  position relative
  .bgimg
    width 100vw
    height 100vh
    position absolute
    left 0
    top 0
    overflow hidden
    background url('./img/bg.jpg') center center no-repeat
    background-size cover
    img
      min-width 100%
      min-height 100%
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)

  .content
    width 100vw
    height 100vh
    position absolute
    z-index 10
    left 0
    top 0
    box-sizing border-box
    padding-bottom 130px
    display flex
    flex-flow column nowrap
    align-items center
    justify-content center
    .logo
      width 260px
      height 80px
      background url('./img/logo.png') 0 0 no-repeat
    .info
      margin-top 10px
      color $White
      font-size 12px
    .formbody
      margin-top 40px
      width 370px
      background $White
      border-radius 5px
      padding 40px
      box-sizing border-box
      .title
        font-size 16px
      .lists
        margin-top 10px
        .line
          margin-top 25px
          height 36px
          display flex
          flex-flow row nowrap
          justify-content flex-start
          align-items center
          border-bottom 1px solid $elSilver
          i.icon
            flex 0 0 30px
            width 30px
            height 30px
            position relative
            left -6px
            &.user
              background url('./img/user.png') 0 0 no-repeat
              background-size 30px 30px
            &.pwd
              background url('./img/pwd.png') 0 0 no-repeat
              background-size 30px 30px
          input
            flex 1
            height 30px
            line-height 30px
            font-size 13px
      .bm
        margin-top 40px
        display flex
        justify-content flex-start
        align-items center
        .wj
          color $elBlack
          cursor pointer
        .btn
          width 110px
          border-radius 20px
          height 40px
          cursor pointer
          text-align center
          line-height 40px
          background $Blue
          color $White
          font-size 15px
  .bottom
    position absolute
    bottom 0
    width 100%
    text-align center
    line-height 40px
    font-size 11px
    color rgba(255,255,255, .7)

</style>

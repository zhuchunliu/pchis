<template lang="pug">
  el-container
    el-aside.aside(:width="asideWidth")
      leftnav(:asideWidth= 'asideWidth')
    el-container.main
      .sz_icon(:class='{"active": asideWidth == "70px"}', @click='changeSilbar')
        .img
          img(src='./../assets/img/sidebar_icon.png')
      el-header.header
        .left
          .topicon
            img(src='./../assets/img/top_icon/top-1.png', v-if="$route.path == '/doctorvisits/admissions' || $route.path == '/doctorvisits/addtreatment' || $route.path == '/doctorvisits/treatment'")
            img(src='./../assets/img/top_icon/top-2.png', v-if="$route.path == '/doctorvisits/scheduling'")
            img(src='./../assets/img/top_icon/top-3.png', v-if="$route.path == '/doctorvisits/registrationlist' || $route.path == '/doctorvisits/addguahao'")
            img(src='./../assets/img/top_icon/top-4.png', v-if="$route.path == '/doctorvisits/patientslibrary' || $route.path == '/doctorvisits/editpatient'")

            img(src='./../assets/img/top_icon/top-5.png', v-if="$route.path == '/dispensingfees/dispensefee'")
            img(src='./../assets/img/top_icon/top-29.png', v-if="$route.path == '/dispensingfees/sellfees'")
            img(src='./../assets/img/top_icon/top-6.png', v-if="$route.path == '/druginventory/informationmaintenance'")
            img(src='./../assets/img/top_icon/top-7.png', v-if="$route.path == '/druginventory/supplier'")
            img(src='./../assets/img/top_icon/top-8.png', v-if="$route.path == '/druginventory/purchase'")
            img(src='./../assets/img/top_icon/top-9.png', v-if="$route.path == '/druginventory/storageaudit'")
            img(src='./../assets/img/top_icon/top-10.png', v-if="$route.path == '/druginventory/instock'")

            img(src='./../assets/img/top_icon/top-11.png', v-if="$route.path == '/statistics/balanceofpayments'")
            img(src='./../assets/img/top_icon/top-12.png', v-if="$route.path == '/statistics/drug'")
            img(src='./../assets/img/top_icon/top-13.png', v-if="$route.path == '/statistics/inspection'")
            img(src='./../assets/img/top_icon/top-14.png', v-if="$route.path == '/statistics/yearmonth'")
            img(src='./../assets/img/top_icon/top-15.png', v-if="$route.path == '/statistics/work'")

            img(src='./../assets/img/top_icon/top-16.png', v-if="$route.path == '/system/doctor'")
            img(src='./../assets/img/top_icon/top-17.png', v-if="$route.path == '/system/departments'")
            img(src='./../assets/img/top_icon/top-18.png', v-if="$route.path == '/system/stencil' || $route.path == '/system/addstenciltemplate' || $route.path == '/system/checkchufangmodel'")
            img(src='./../assets/img/top_icon/top-19.png', v-if="$route.path == '/system/cost'")
            img(src='./../assets/img/top_icon/top-20.png', v-if="$route.path == '/system/dictionary'")
            img(src='./../assets/img/top_icon/top-21.png', v-if="$route.path == '/system/clinic'")

            img(src='./../assets/img/top_icon/top-22.png', v-if="$route.path == '/system/addmanufactured'")
            img(src='./../assets/img/top_icon/top-23.png', v-if="$route.path == '/system/addsupplier'")
            img(src='./../assets/img/top_icon/top-24.png', v-if="$route.path == '/system/permission'")
            img(src='./../assets/img/top_icon/top-25.png', v-if="$route.path == '/system/organization'")
            img(src='./../assets/img/top_icon/top-26.png', v-if="$route.path == '/druginventory/stockcheck'")
            img(src='./../assets/img/top_icon/top-27.png', v-if="$route.path == '/druginventory/stockcheckpurchase'")
            img(src='./../assets/img/top_icon/top-28.png', v-if="$route.path == '/system/drugdic'")
            img(src='./../assets/img/top_icon/firstpage.png', v-if="$route.path == '/firstpage'")
          span {{$route.name}}
          p 
        el-dropdown.right
          .title
            .img
              img(src='./../assets/img/triangle.png')
            span {{$store.state.userInfo.userName}}
            // .icon
              img(src='./../assets/img/triangle.png')
          el-dropdown-menu(slot="dropdown")
            // el-dropdown-item(@click.native='$router.push({path: "/system/personal", query: {tab: 1}})')
              i.iconme.info
              span 个人中心
            el-dropdown-item(@click.native='showEditPwd')
              i.iconme.pwd
              span 修改密码
            el-dropdown-item(@click.native='$store.commit("logout")')
              i.iconme.out
              span 退出登录
      el-main.bodymain
        el-scrollbar.scrollContainer(ref='bodyMain')
          router-view

    el-dialog(
      :visible.sync="editPwdDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 修改密码
      .daorubody
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="原密码")
            el-input(size='medium', placeholder='请输入原密码', v-model="oldpwd", type="password")
          el-form-item(label="新密码")
            el-input(size='medium', placeholder='请输入新密码', v-model="newpwd1", type="password")
          el-form-item(label="确认密码")
            el-input(size='medium', placeholder='请确认新密码', v-model="newpwd2", type="password")
        .bigbtn(@click='editPwdOk') 确认修改
</template>

<script>
import leftnav from './../components/leftnav'
export default {
  components: {
    leftnav
  },
  data () {
    return {
      asideWidth: '70px',
      editPwdDialogVisible: false,

      oldpwd: '',
      newpwd1: '',
      newpwd2: ''
    }
  },
  methods: {
    showEditPwd () {
      this.editPwdDialogVisible = true
    },
    editPwdOk () {
      if (this.newpwd1 !== this.newpwd2) {
        this.$message.error('新密码不一致，请重新输入！')
        return false
      }
      if (this.newpwd1.length < 8) {
        this.$message.error('新密码长度不低于8位！')
        return false
      }

      this.$api.userpasswd({
        oldPasswd: this.oldpwd,
        newPasswd: this.newpwd1
      }).then(res => {
        if (res.success) {
          this.$message.success('密码修改成功！请重新登陆。')
          this.$store.commit('logout')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeSilbar () {
      this.asideWidth = this.asideWidth === '180px' ? '70px' : '180px'
      this.$setStore('asideWidth', {
        width: this.asideWidth
      })
    },
    setAsideWidth () {
      this.asideWidth = this.$getStore('asideWidth') ? this.$getStore('asideWidth').width : '180px'
    }
  },
  created () {
    this.setAsideWidth()
    this.$nextTick(() => {
      let setBodyHeight = () => {
        this.$refs.bodyMain.$el.style.height = (window.innerHeight - 70) + 'px'
      }
      setBodyHeight()
      window.onresize = function () {
        setBodyHeight()
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
@import './../assets/css/var.styl'
.daorubody
  .bigbtn
    text-align center
    padding 6px 0
    margin-top 20px
    background $Blue
    width 100%
    border-radius 4px
    color $White
    transition all .2s ease
    cursor pointer
    &:hover
      background lighten($Blue, 20%)
.el-dropdown-menu__item
  display flex
  justify-content center
  align-items center
  padding-left 12px
  span
    color $lBlack
  .iconme
    width 30px
    height 30px
    display inline-block
    &.info
      background url('./../assets/img/me_changeinfo.png') 0 0 no-repeat
      background-size 30px 30px
    &.pwd
      background url('./../assets/img/me_changepwd.png') 0 0 no-repeat
      background-size 30px 30px
    &.out
      background url('./../assets/img/me_loginout.png') 0 0 no-repeat
      background-size 30px 30px

.aside
  overflow-x hidden
  position relative
  transition all .3s ease

.main
  min-width 1020px
  position relative
  padding 0
  background $elSilver
  .bodymain
    overflow hidden
    height calc(100vh - 70px)
    padding 0
    box-sizing border-box

.header
  height $topheight !important
  background $White
  display flex
  padding 0 30px
  flex-flow row nowrap
  align-items center
  justify-content space-between
  .left
    height 24px
    flex 1
    display flex
    flex-flow row nowrap
    align-items center
    .topicon
      width 24px
      height 24px
      position relative
      img
        width 100%
        height 100%
    span
      margin-left 10px
      font-size 20px
    p
      font-size 18px
      margin-left 25px
  .right
    cursor pointer
  .title
    display flex
    flex-flow row nowrap
    align-items center
    height 60px
    .img
      width 36px
      height 36px
      border-radius 50%
      background $Silver
      overflow hidden
      img
        width 100%
        height 100%
    span
      margin-left 10px

.scrollContainer
  width 100%
  height 100%
  overflow hidden
  padding 0
  box-sizing border-box

.sz_icon
  position absolute
  top $topheight + 15px
  left 0
  width 20px
  height 35px
  background $dWhite
  z-index 9
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  border-top-right-radius 4px
  border-bottom-right-radius 4px
  cursor pointer
  &.active
    .img
      transform rotate(180deg)
  .img
    width 20px
    height 30px
    line-height 0
    transition all 0.2s ease
    img
      width 100%
      height 100%
</style>

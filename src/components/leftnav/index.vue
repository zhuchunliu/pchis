<template lang="pug">
  .content
    .logo(:class="asideWidth == '180px' ? 'bigNav': 'miniNav'")
      router-link(to="/firstpage", @click.native='jump(1)')
        img(src='./../../assets/img/logo.png', v-if="asideWidth == '180px'")
        i.icon-his-logo(v-if="asideWidth == '70px'")
    //- el-scrollbar(tag='ul').nv
    el-scrollbar.nv(:class="asideWidth == '180px' ? 'bigNav': 'miniNav'")
      // el-menu(default-active="1", background-color="#343C47", :unique-opened='true', v-if="asideWidth == '180px'")
        el-menu-item.firstpage(index="1", @click.native='jumpstate(1)')
          template(slot="title")
            span.title(:class="[$store.state.activeIndex == '1' ? 'active' : '']") 首页
        el-submenu.nvlist(index="2", v-if="new RegExp('医生门诊|医生排班|挂号列表|患者库').test(pathAll)", @click.native='jumpstate(2, $event)')
          template(slot="title")
            // span.title(:class="[$store.state.submenuType == 2 ? 'submenuactive' : '']") 看病就诊
            span.title 看病就诊
          el-menu-item.item(:class="[$store.state.activeIndex == 'i2' ? 'active' : '']", data-index="i2", index="i2", v-if="new RegExp('医生排班').test(pathAll)")
            i.i2(data-index="i2")
            span(data-index="i2") 医生排班
          el-menu-item.item(:class="[$store.state.activeIndex == 'i3' ? 'active' : '']", data-index="i3", index="i3", v-if="new RegExp('挂号列表').test(pathAll)")
            i.i3(data-index="i3")
            span(data-index="i3") 挂号列表
          el-menu-item.item(:class="[$store.state.activeIndex == 'i1' ? 'active' : '']", data-index="i1", index="i1", v-if="new RegExp('医生门诊').test(pathAll)")
            i.i1(data-index="i1")
            span(data-index="i1") 医生门诊
          el-menu-item.item(:class="[$store.state.activeIndex == 'i4' ? 'active' : '']", data-index="i4", index="i4", v-if="new RegExp('患者库').test(pathAll)")
            i.i4(data-index="i4")
            span(data-index="i4") 患者库
        el-submenu.nvlist(index='3', v-if="new RegExp('收费发药|药品零售').test(pathAll)", @click.native='jumpstate(3, $event)')
          template(slot="title")
            span.title 收费发药
          el-menu-item.item(:class="[$store.state.activeIndex == 'i5' ? 'active' : '']", data-index="i5", index="i5", v-if="new RegExp('收费发药').test(pathAll)")
            i.i5(data-index="i5")
            span(data-index="i5") 收费发药
          el-menu-item.item(:class="[$store.state.activeIndex == 'i29' ? 'active' : '']", data-index="i29", index="i29", v-if="new RegExp('药品零售').test(pathAll)")
            i.i29(data-index="i29")
            span(data-index="i29") 药品零售
        el-submenu.nvlist(index='4', v-if="new RegExp('药品信息维护|新增厂商|新增供应商|供应商维护|采购入库|入库审核|库存盘点|盘点审核|库存查询').test(pathAll)", @click.native='jumpstate(4, $event)')
          template(slot="title")
            span.title 药品进销存
          el-menu-item.item(:class="[$store.state.activeIndex == 'i6' ? 'active' : '']", data-index="i6", index="i6", v-if="new RegExp('药品信息维护').test(pathAll)")
            i.i6(data-index="i6")
            span(data-index="i6") 药品信息维护
          el-menu-item.item(:class="[$store.state.activeIndex == 'i7' ? 'active' : '']", data-index="i7", index="i7", v-if="new RegExp('供应商维护').test(pathAll)")
            i.i7(data-index="i7")
            span(data-index="i7") 供应商维护
          el-menu-item.item(:class="[$store.state.activeIndex == 'i8' ? 'active' : '']", data-index="i8", index="i8", v-if="new RegExp('采购入库').test(pathAll)")
            i.i8(data-index="i8")
            span(data-index="i8") 采购入库
          el-menu-item.item(:class="[$store.state.activeIndex == 'i9' ? 'active' : '']", data-index="i9", index="i9", v-if="new RegExp('入库审核').test(pathAll)")
            i.i9(data-index="i9")
            span(data-index="i9") 入库审核
          el-menu-item.item(:class="[$store.state.activeIndex == 'i26' ? 'active' : '']", data-index="i26", index="i26", v-if="new RegExp('库存盘点').test(pathAll)")
            i.i26(data-index="i26")
            span(data-index="i26") 库存盘点
          el-menu-item.item(:class="[$store.state.activeIndex == 'i27' ? 'active' : '']", data-index="i27", index="i27", v-if="new RegExp('盘点审核').test(pathAll)")
            i.i27(data-index="i27")
            span(data-index="i27") 盘点审核
          el-menu-item.item(:class="[$store.state.activeIndex == 'i10' ? 'active' : '']", data-index="i10", index="i10", v-if="new RegExp('库存查询').test(pathAll)")
            i.i10(data-index="i10")
            span(data-index="i10") 库存查询
        el-submenu.nvlist(index='5', v-if="new RegExp('诊所收支统计|药品销售统计|检查项目统计|年月报表统计|工作量统计').test(pathAll)", @click.native='jumpstate(5, $event)')
          template(slot="title")
            span.title 数据统计
          el-menu-item.item(:class="[$store.state.activeIndex == 'i11' ? 'active' : '']", data-index="i11", index="i11", v-if="new RegExp('诊所收支统计').test(pathAll)")
            i.i11(data-index="i11")
            span(data-index="i11") 诊所收支统计
          el-menu-item.item(:class="[$store.state.activeIndex == 'i12' ? 'active' : '']", data-index="i12", index="i12", v-if="new RegExp('药品销售统计').test(pathAll)")
            i.i12(data-index="i12")
            span(data-index="i12") 药品销售统计
          el-menu-item.item(:class="[$store.state.activeIndex == 'i13' ? 'active' : '']", data-index="i13", index="i13", v-if="new RegExp('检查项目统计').test(pathAll)")
            i.i13(data-index="i13")
            span(data-index="i13") 检查项目统计
          el-menu-item.item(:class="[$store.state.activeIndex == 'i14' ? 'active' : '']", data-index="i14", index="i14", v-if="new RegExp('年月报表统计').test(pathAll)")
            i.i14(data-index="i14")
            span(data-index="i14") 年月报表统计
          el-menu-item.item(:class="[$store.state.activeIndex == 'i15' ? 'active' : '']", data-index="i15", index="i15", v-if="new RegExp('工作量统计').test(pathAll)")
            i.i15(data-index="i15")
            span(data-index="i15") 工作量统计
        el-submenu.nvlist(index='6', v-if="new RegExp('员工管理|权限管理|机构管理|科室管理|模板维护|费用管理|字典表维护|药品字典维护|生产商管理|供应商管理|诊所信息|个人中心').test(pathAll)", @click.native='jumpstate(6, $event)')
          template(slot="title")
            span.title 系统设置
          el-menu-item(:class="[$store.state.activeIndex == 'i16' ? 'active' : '']", data-index="i16", index="i16", v-if="new RegExp('员工管理').test(pathAll)").item
            i.i16(data-index="i16")
            span(data-index="i16") 员工管理
          el-menu-item(:class="[$store.state.activeIndex == 'i24' ? 'active' : '']", data-index="i24", index="i24", v-if="new RegExp('权限管理').test(pathAll)").item
            i.i24(data-index="i24")
            span(data-index="i24") 权限管理
          el-menu-item(:class="[$store.state.activeIndex == 'i25' ? 'active' : '']", data-index="i25", index="i25", v-if="new RegExp('机构管理').test(pathAll)").item
            i.i25(data-index="i25")
            span(data-index="i25") 机构管理
          el-menu-item(:class="[$store.state.activeIndex == 'i17' ? 'active' : '']", data-index="i17", index="i17", v-if="new RegExp('科室管理').test(pathAll)").item
            i.i17(data-index="i17")
            span(data-index="i17") 科室管理
          el-menu-item(:class="[$store.state.activeIndex == 'i18' ? 'active' : '']", data-index="i18", index="i18", v-if="new RegExp('模板维护').test(pathAll)").item
            i.i18(data-index="i18")
            span(data-index="i18") 模板维护
          el-menu-item(:class="[$store.state.activeIndex == 'i19' ? 'active' : '']", data-index="i19", index="i19", v-if="new RegExp('费用管理').test(pathAll)").item
            i.i19(data-index="i19")
            span(data-index="i19") 费用管理
          el-menu-item(:class="[$store.state.activeIndex == 'i20' ? 'active' : '']", data-index="i20", index="i20", v-if="new RegExp('字典表维护').test(pathAll)").item
            i.i20(data-index="i20")
            span(data-index="i20") 字典表维护
          el-menu-item(:class="[$store.state.activeIndex == 'i28' ? 'active' : '']", data-index="i28", index="i28", v-if="new RegExp('药品字典维护').test(pathAll)").item
            i.i28(data-index="i28")
            span(data-index="i28") 药品字典维护
          el-menu-item(:class="[$store.state.activeIndex == 'i22' ? 'active' : '']", data-index="i22", index="i22", v-if="new RegExp('生产商管理').test(pathAll)").item
            i.i22(data-index="i22")
            span(data-index="i22") 生产商管理
          el-menu-item(:class="[$store.state.activeIndex == 'i23' ? 'active' : '']", data-index="i23", index="i23", v-if="new RegExp('供应商管理').test(pathAll)").item
            i.i23(data-index="i23")
            span(data-index="i23") 供应商管理
          el-menu-item(:class="[$store.state.activeIndex == 'i21' ? 'active' : '']", data-index="i21", index="i21", v-if="new RegExp('诊所信息').test(pathAll)").item
            i.i21(data-index="i21")
            span(data-index="i21") 诊所信息
          el-menu-item(:class="[$store.state.activeIndex == 'iper' ? 'active' : '']", data-index="iper", index="iper", v-if="new RegExp('个人中心').test(pathAll)").item
            i.i21(data-index="iper")
            span(data-index="iper") 个人中心
        // 新增就医北上广
        // , v-if="new RegExp('渠道|市场|平台').test(pathAll)"
        // , v-if="new RegExp('渠道').test(pathAll)"
        el-submenu.nvlist(index='7', v-if="new RegExp('渠道|市场|平台').test(pathAll)", @click.native='jumpstate(7, $event)')
          template(slot="title")
            span.title 就医北上广
          el-menu-item(:class="[$store.state.activeIndex == 'i30' ? 'active' : '']", data-index="i30", index="i30", v-if="new RegExp('渠道').test(pathAll)").item
            i.i16(data-index="i30")
            span(data-index="i30") 医院管理
      leftnavbig(v-if="asideWidth == '180px'", :pathAll="pathAll", :menuItemlists="menuItemlists")
      // leftnavmini(v-if="asideWidth == '70px'", :pathAll="pathAll")
      leftnavminiNew(v-if="asideWidth == '70px'", :pathAll="pathAll")
</template>

<script>
// import leftnavmini from '../leftnavmini'
import leftnavbig from '../leftnavbig'
import leftnavminiNew from '../leftnavminiNew'
export default {
  props: ['asideWidth'],
  components: { leftnavminiNew, leftnavbig },
  data () {
    return {
      pathAll: '',
      menuItemlists: []
      // activeIndex: '',
      // submenuType: 0
    }
  },
  methods: {
    userMenu () {
      this.$api.userMenu().then(res => {
        if (res.success) {
          let str = ''
          // console.log(res.result)
          for (let i = 0; i < res.result.length; i++) {
            // console.log(res.result[i])
            str += res.result[i].menuName
            this.menuItemlists.push(res.result[i].menuName)
          }
          this.pathAll = str
          if (this.$route.name !== '首页' && !new RegExp(this.$route.name).test(str)) {
            // if (new RegExp('门诊列表').test(str)) {
            //   this.$router.push('/doctorvisits/admissions')
            // } else {
            if (new RegExp('医生门诊').test(str)) {
              // this.$router.push('/doctorvisits/admissions')
              this.$router.push('/firstpage')
            } else {
              // this.$router.push('/')
              this.$router.push('/firstpage')
              this.$notify({
                title: '提示',
                message: '用户权限不足，已返回首页。',
                duration: 0
              })
            }
          } else {
            this.$router.push('/firstpage')
          }
          // if (new RegExp('门诊列表').test(str)) {
          //   this.$router.push('/doctorvisits/admissions')
          // }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // jump (type, e) {
    //   this.submenuType = type || 0
    //   if (this.submenuType == 1) {
    //     this.activeIndex = 0
    //   } else {
    //     let t = e.target.dataset.index
    //     if (t) {
    //       this.activeIndex = t
    //     }
    //   }
    // },
    jumpstate (type, e) {
      console.log(type)
      if (type == '1') {
        let json = {
          type: type
        }
        this.$router.push('/firstpage')
        this.$store.commit('jump', json)
      } else {
        let t = e.target.dataset.index
        console.log(t)
        if (t) {
          let json = {
            type: type,
            t: t
          }
          switch (t) {
            case 'i1': this.$router.push('/doctorvisits/admissions')
              break
            case 'i2': this.$router.push('/doctorvisits/scheduling')
              break
            case 'i3': this.$router.push('/doctorvisits/registrationlist')
              break
            case 'i4': this.$router.push('/doctorvisits/patientslibrary')
              break
            case 'i5': this.$router.push('/dispensingfees/dispensefee')
              break
            case 'i29': this.$router.push('/dispensingfees/sellfees')
              break
            case 'i6': this.$router.push('/druginventory/informationmaintenance')
              break
            case 'i7': this.$router.push('/druginventory/supplier')
              break
            case 'i8': this.$router.push('/druginventory/purchase')
              break
            case 'i9': this.$router.push('/druginventory/storageaudit')
              break
            case 'i26': this.$router.push('/druginventory/stockcheck')
              break
            case 'i27': this.$router.push('/druginventory/stockcheckpurchase')
              break
            case 'i10': this.$router.push('/druginventory/instock')
              break
            case 'i11': this.$router.push('/statistics/balanceofpayments')
              break
            case 'i12': this.$router.push('/statistics/drug')
              break
            case 'i13': this.$router.push('/statistics/inspection')
              break
            case 'i14': this.$router.push('/statistics/yearmonth')
              break
            case 'i15': this.$router.push('/statistics/work')
              break
            case 'i16': this.$router.push('/system/doctor')
              break
            case 'i24': this.$router.push('/system/permission')
              break
            case 'i25': this.$router.push('/system/organization')
              break
            case 'i17': this.$router.push('/system/departments')
              break
            case 'i18': this.$router.push('/system/stencil')
              break
            case 'i19': this.$router.push('/system/cost')
              break
            case 'i20': this.$router.push('/system/dictionary')
              break
            case 'i28': this.$router.push('/system/drugdic')
              break
            case 'i22': this.$router.push('/system/addmanufactured')
              break
            case 'i23': this.$router.push('/system/addsupplier')
              break
            case 'i21': this.$router.push('/system/clinic')
              break
            case 'iper': this.$router.push('/system/personal')
              break
            case 'i30': this.$router.push('/bsg/hospitallist')
              break
          }
          this.$store.commit('jump', json)
        }
      }
    }
  },
  created () {
    this.userMenu()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../assets/css/var.styl'
.content
  height 100vh
  overflow hidden
  width 100%
  background #343C47
  position relative
  box-sizing border-box
  padding-top $topheight

.logo
  height $topheight
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  border-bottom 1px solid #3A4350
  background #343C47
  position absolute
  z-index 9
  top 0
  left 0

.el-menu
  border-right 0

// 二级菜单选中时，增加背景色
.el-submenu .el-menu-item
  &:hover, &.active
    background-color #1f2d3d!important
    border-left 4px solid #1BD4ED!important

.nv
  position absolute
  top $topheight
  left 0
  bottom 0
  .firstpage
    border-bottom 1px solid #3A4350
    .title
      height 40px
      line-height 40px
      font-size 13px
      padding 0 10% 0 0
      color #FFF
      &.active
        color $Blue
  .nvlist
    border-bottom 1px solid #3A4350
    &:hover
      font-size 20px
      font-weight 800
    &.nvlistactive
      background-color red
    .title
      height 40px
      line-height 40px
      font-size 13px
      padding 0 10% 0 0
      color #FFF
      &.submenuactive
        font-size 15px
        font-weight 600
    .item
      height 55px
      padding 0 10px
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      border-left 4px solid rgba(0,0,0,0)
      color $White
      cursor pointer
      i
        display inline-block
        width 30px
        height 30px
        // margin-left 10px
        margin-right 10px
        background-size 30px
        &.i1
          background url('./img/1.png')
        &.i2
          background url('./img/2.png')
        &.i3
          background url('./img/3.png')
        &.i4
          background url('./img/4.png')
        &.i5
          background url('./img/5.png')
        &.i6
          background url('./img/6.png')
        &.i7
          background url('./img/7.png')
        &.i8
          background url('./img/8.png')
        &.i9
          background url('./img/9.png')
        &.i10
          background url('./img/10.png')
        &.i11
          background url('./img/11.png')
        &.i12
          background url('./img/12.png')
        &.i13
          background url('./img/13.png')
        &.i14
          background url('./img/14.png')
        &.i15
          background url('./img/15.png')
        &.i16
          background url('./img/16.png')
        &.i17
          background url('./img/17.png')
        &.i18
          background url('./img/18.png')
        &.i19
          background url('./img/19.png')
        &.i20
          background url('./img/20.png')
        &.i21
          background url('./img/21.png')
        &.i22
          background url('./img/22.png')
        &.i23
          background url('./img/23.png')
        &.i24
          background url('./img/24.png')
        &.i25
          background url('./img/25.png')
        &.i26
          background url('./img/26.png')
        &.i27
          background url('./img/27.png')
        &.i28
          background url('./img/28.png')
        &.i29
          background url('./img/29.png')
        &.i30
          background url('./img/21.png')
      &.active
        border-left 4px solid #1BD4ED
        background-color #545F6F
        color $Blue
        .i1
          background url('./img/1-active.png')
        .i2
          background url('./img/2-active.png')
        .i3
          background url('./img/3-active.png')
        .i4
          background url('./img/4-active.png')
        .i5
          background url('./img/5-active.png')
        .i6
          background url('./img/6-active.png')
        .i7
          background url('./img/7-active.png')
        .i8
          background url('./img/8-active.png')
        .i9
          background url('./img/9-active.png')
        .i10
          background url('./img/10-active.png')
        .i11
          background url('./img/11-active.png')
        .i12
          background url('./img/12-active.png')
        .i13
          background url('./img/13-active.png')
        .i14
          background url('./img/14-active.png')
        .i15
          background url('./img/15-active.png')
        .i16
          background url('./img/16-active.png')
        .i17
          background url('./img/17-active.png')
        .i18
          background url('./img/18-active.png')
        .i19
          background url('./img/19-active.png')
        .i20
          background url('./img/20-active.png')
        .i21
          background url('./img/21-active.png')
        .i22
          background url('./img/22-active.png')
        .i23
          background url('./img/23-active.png')
        .i24
          background url('./img/24-active.png')
        .i25
          background url('./img/25-active.png')
        .i26
          background url('./img/26-active.png')
        .i27
          background url('./img/27-active.png')
        .i28
          background url('./img/28-active.png')
        .i29
          background url('./img/29-active.png')
        .i30
          background url('./img/21-active.png')
.bigNav
  width 180px
.miniNav
  width 70px
.icon-his-logo
  font-size 32px
</style>

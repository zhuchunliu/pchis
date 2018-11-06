<template lang="pug">
  ul
    li.nvlist
      router-link(to="/firstpage", tag="div", @click.native="openMenuItem('1')").title
        span(:class="isopenMenuItem == '1' ? 'col-B' : 'col-W'") 首页
    li.nvlist(v-if="new RegExp('医生门诊|医生排班|挂号列表|患者库').test(pathAll)")
      .title(@click="openMenuItem('2')")
        span(:class="isopenMenuItem == '2' ? 'spanactive' : ''") 看病就诊
        i.icon-his-more_unflod(:class="isopenMenuItem == '2' ? 'icon_active' : ''")
      ul.ul-inline(:style="menuItemActive[0]")
        li(v-if="new RegExp('医生排班').test(pathAll)")
          router-link(to="/doctorvisits/scheduling", tag="div").item
            i.i2
            span 医生排班
        li(v-if="new RegExp('挂号列表').test(pathAll)")
          router-link(to="/doctorvisits/registrationlist", tag="div").item
            i.i3
            span 挂号列表
        li(v-if="new RegExp('医生门诊').test(pathAll)")
          router-link(to="/doctorvisits/admissions", tag="div").item
            i.i1
            span 医生门诊
        li(v-if="new RegExp('患者库').test(pathAll)")
          router-link(to="/doctorvisits/patientslibrary", tag="div").item
            i.i4
            span 患者库
    li.nvlist(v-if="new RegExp('收费发药|药品零售').test(pathAll)")
      .title(@click="openMenuItem('3')")
        span(:class="isopenMenuItem == '3' ? 'spanactive' : ''") 收费发药
        i.icon-his-more_unflod(:class="isopenMenuItem == '3' ? 'icon_active' : ''")
      ul.ul-inline(:style="menuItemActive[1]")
        li(v-if="new RegExp('收费发药').test(pathAll)")
          router-link(to="/dispensingfees/dispensefee", tag="div").item
            i.i5
            span 收费发药
        li(v-if="new RegExp('药品零售').test(pathAll)")
          router-link(to="/dispensingfees/sellfees", tag="div").item
            i.i29
            span 药品零售
    li.nvlist(v-if="new RegExp('药品信息维护|新增厂商|新增供应商|供应商维护|采购入库|入库审核|库存盘点|盘点审核|库存查询').test(pathAll)")
      .title(@click="openMenuItem('4')")
        span(:class="isopenMenuItem == '4' ? 'spanactive' : ''") 药品进销存
        i.icon-his-more_unflod(:class="isopenMenuItem == '4' ? 'icon_active' : ''")
      ul.ul-inline(:style="menuItemActive[2]")
        li(v-if="new RegExp('药品信息维护').test(pathAll)")
          router-link(to="/druginventory/informationmaintenance", tag="div").item
            i.i6
            span 药品信息维护
        li(v-if="new RegExp('供应商维护').test(pathAll)")
          router-link(to="/druginventory/supplier", tag="div").item
            i.i7
            span 供应商维护
        li(v-if="new RegExp('采购入库').test(pathAll)")
          router-link(to="/druginventory/purchase", tag="div").item
            i.i8
            span 采购入库
        li(v-if="new RegExp('入库审核').test(pathAll)")
          router-link(to="/druginventory/storageaudit", tag="div").item
            i.i9
            span 入库审核
        li(v-if="new RegExp('库存盘点').test(pathAll)")
          router-link(to="/druginventory/stockcheck", tag="div").item
            i.i26
            span 库存盘点
        li(v-if="new RegExp('盘点审核').test(pathAll)")
          router-link(to="/druginventory/stockcheckpurchase").item
            i.i27
            span 盘点审核
        li(v-if="new RegExp('库存查询').test(pathAll)")
          router-link(to="/druginventory/instock", tag="div").item
            i.i10
            span 库存查询
    li.nvlist(v-if="new RegExp('诊所收支统计|药品销售统计|检查项目统计|年月报表统计|工作量统计').test(pathAll)")
      .title(@click="openMenuItem('5')")
        span(:class="isopenMenuItem == '5' ? 'spanactive' : ''") 数据统计
        i.icon-his-more_unflod(:class="isopenMenuItem == '5' ? 'icon_active' : ''")
      ul.ul-inline(:style="menuItemActive[3]")
        li(v-if="new RegExp('诊所收支统计').test(pathAll)")
          router-link(to="/statistics/balanceofpayments", tag="div").item
            i.i11
            span 诊所收支统计
        li(v-if="new RegExp('药品销售统计').test(pathAll)")
          router-link(to="/statistics/drug", tag="div").item
            i.i12
            span 药品销售统计
        li(v-if="new RegExp('检查项目统计').test(pathAll)")
          router-link(to="/statistics/inspection", tag="div").item
            i.i13
            span 检查项目统计
        li(v-if="new RegExp('年月报表统计').test(pathAll)")
          router-link(to="/statistics/yearmonth", tag="div").item
            i.i14
            span 年月报表统计
        li(v-if="new RegExp('工作量统计').test(pathAll)")
          router-link(to="/statistics/work", tag="div").item
            i.i15
            span 工作量统计
    li.nvlist(v-if="new RegExp('员工管理|权限管理|机构管理|科室管理|模板维护|费用管理|字典表维护|药品字典维护|生产商管理|供应商管理|诊所信息|个人中心').test(pathAll)")
      .title(@click="openMenuItem('6')")
        span(:class="isopenMenuItem == '6' ? 'spanactive' : ''") 系统设置
        i.icon-his-more_unflod(:class="isopenMenuItem == '6' ? 'icon_active' : ''")
      ul.ul-inline(:style="menuItemActive[4]")
        li(v-if="new RegExp('员工管理').test(pathAll)")
          router-link(to="/system/doctor", tag="div").item
            i.i16
            span 员工管理
        li(v-if="new RegExp('权限管理').test(pathAll)")
          router-link(to="/system/permission", tag="div").item
            i.i24
            span 权限管理
        li(v-if="new RegExp('机构管理').test(pathAll)")
          router-link(to="/system/organization", tag="div").item
            i.i25
            span 机构管理
        li(v-if="new RegExp('科室管理').test(pathAll)")
          router-link(to="/system/departments", tag="div").item
            i.i17
            span 科室管理
        li(v-if="new RegExp('模板维护').test(pathAll)")
          router-link(to="/system/stencil", tag="div").item
            i.i18
            span 模板维护
        li(v-if="new RegExp('费用管理').test(pathAll)")
          router-link(to="/system/cost", tag="div").item
            i.i19
            span 费用管理
        li(v-if="new RegExp('字典表维护').test(pathAll)")
          router-link(to="/system/dictionary", tag="div").item
            i.i20
            span 字典表维护
        li(v-if="new RegExp('药品字典维护').test(pathAll)")
          router-link(to="/system/drugdic", tag="div").item
            i.i28
            span 药品字典维护
        li(v-if="new RegExp('生产商管理').test(pathAll)")
          router-link(to="/system/addmanufactured").item
            i.i22
            span 生产商管理
        li(v-if="new RegExp('供应商管理').test(pathAll)")
          router-link(to="/system/addsupplier", tag="div").item
            i.i23
            span 供应商管理
        li(v-if="new RegExp('诊所信息').test(pathAll)")
          router-link(to="/system/clinic", tag="div").item
            i.i21
            span 诊所信息
        li(v-if="new RegExp('个人中心').test(pathAll)")
          router-link(to="/system/personal", tag="div").item
            i.i21
            span 个人中心
    li.nvlist(v-if="new RegExp('渠道|市场|平台').test(pathAll)")
      .title(@click="openMenuItem('7')")
        span(:class="isopenMenuItem == '7' ? 'spanactive' : ''") 就医北上广
        i.icon-his-more_unflod(:class="isopenMenuItem == '7' ? 'icon_active' : ''")
      ul.ul-inline(:style="menuItemActive[5]")
        li(v-if="new RegExp('渠道').test(pathAll)")
          router-link(to="/bsg/hospitallist", replace, tag="div").item
            i.i16
            span 医院管理

</template>
<script>
export default {
  props: ['pathAll', 'menuItemlists'],
  data () {
    return {
      isopenMenuItem: '1',
      menuItemActive: [{height: 0}, {height: 0}, {height: 0}, {height: 0}, {height: 0}, {height: 0}],
      itemlists: [
        ['医生门诊', '医生排班', '挂号列表', '患者库'],
        ['收费发药', '药品零售'],
        ['药品信息维护', '新增厂商', '新增供应商', '供应商维护', '采购入库', '入库审核', '库存盘点', '盘点审核', '库存查询'],
        ['诊所收支统计', '药品销售统计', '检查项目统计', '年月报表统计', '工作量统计'],
        ['员工管理', '权限管理', '机构管理', '科室管理', '模板维护', '费用管理', '字典表维护', '药品字典维护', '生产商管理', '供应商管理', '诊所信息', '个人中心'],
        ['渠道', '市场', '平台']
      ]
    }
  },
  methods: {
    openMenuItem (key) {
      if (key == '1') {
        this.isopenMenuItem = '1'
        this.menuItemActive.map((item, value) => {
          this.menuItemActive[value].height = 0
        })
        return
      }
      let index = Number(key) - 2
      let lists = this.itemlists[index]
      let listlength = []
      if (this.isopenMenuItem == key) {
        this.isopenMenuItem = ''
        this.menuItemActive[index].height = 0
      } else {
        this.isopenMenuItem = key
        this.menuItemActive.map((item, value) => {
          if (value == index) {
            this.menuItemlists.map(_item => {
              lists.map(its => {
                if (_item == its) {
                  listlength.push(_item)
                }
              })
            })
            item.height = 55 * listlength.length + 'px'
          } else {
            item.height = 0
          }
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import './../../assets/css/var.styl'
.icon-his-more_unflod
  color #909399
  font-size 10px
  transform rotateZ(0)
  transition all 0.5s ease
  &.icon_active
    transform rotateZ(180deg)
.ul-inline
  overflow hidden
  height 0
  background rgba(42, 48, 57, .8)
  transition height 0.3s ease
.col-B
  color $Blue
.col-W
  color $White
.nvlist
  border-bottom 1px solid #3A4350
  user-select none
  .title
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    height 55px
    font-size 13px
    padding 0 20px 0 20px
    color #FFF
    cursor pointer
    transition all 0.5s ease
    &:hover
      font-size 15px
      font-weight 800
      background rgb(42, 48, 57)
  .spanactive
    font-size 15px
    font-weight 800
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
    transition all 0.5s ease
    i
      display inline-block
      width 30px
      height 30px
      margin-left 20px
      margin-right 10px
      background-size 30px
      &.i1
        background url('../leftnav/img/1.png')
      &.i2
        background url('../leftnav/img/2.png')
      &.i3
        background url('../leftnav/img/3.png')
      &.i4
        background url('../leftnav/img/4.png')
      &.i5
        background url('../leftnav/img/5.png')
      &.i6
        background url('../leftnav/img/6.png')
      &.i7
        background url('../leftnav/img/7.png')
      &.i8
        background url('../leftnav/img/8.png')
      &.i9
        background url('../leftnav/img/9.png')
      &.i10
        background url('../leftnav/img/10.png')
      &.i11
        background url('../leftnav/img/11.png')
      &.i12
        background url('../leftnav/img/12.png')
      &.i13
        background url('../leftnav/img/13.png')
      &.i14
        background url('../leftnav/img/14.png')
      &.i15
        background url('../leftnav/img/15.png')
      &.i16
        background url('../leftnav/img/16.png')
      &.i17
        background url('../leftnav/img/17.png')
      &.i18
        background url('../leftnav/img/18.png')
      &.i19
        background url('../leftnav/img/19.png')
      &.i20
        background url('../leftnav/img/20.png')
      &.i21
        background url('../leftnav/img/21.png')
      &.i22
        background url('../leftnav/img/22.png')
      &.i23
        background url('../leftnav/img/23.png')
      &.i24
        background url('../leftnav/img/24.png')
      &.i25
        background url('../leftnav/img/25.png')
      &.i26
        background url('../leftnav/img/26.png')
      &.i27
        background url('../leftnav/img/27.png')
      &.i28
        background url('../leftnav/img/28.png')
      &.i29
        background url('../leftnav/img/29.png')
      &.i30
        background url('../leftnav/img/21.png')
    &.active, &:hover
      border-left 4px solid #1BD4ED
      background-color #545F6F
      color $Blue
      .i1
        background url('../leftnav/img/1-active.png')
      .i2
        background url('../leftnav/img/2-active.png')
      .i3
        background url('../leftnav/img/3-active.png')
      .i4
        background url('../leftnav/img/4-active.png')
      .i5
        background url('../leftnav/img/5-active.png')
      .i6
        background url('../leftnav/img/6-active.png')
      .i7
        background url('../leftnav/img/7-active.png')
      .i8
        background url('../leftnav/img/8-active.png')
      .i9
        background url('../leftnav/img/9-active.png')
      .i10
        background url('../leftnav/img/10-active.png')
      .i11
        background url('../leftnav/img/11-active.png')
      .i12
        background url('../leftnav/img/12-active.png')
      .i13
        background url('../leftnav/img/13-active.png')
      .i14
        background url('../leftnav/img/14-active.png')
      .i15
        background url('../leftnav/img/15-active.png')
      .i16
        background url('../leftnav/img/16-active.png')
      .i17
        background url('../leftnav/img/17-active.png')
      .i18
        background url('../leftnav/img/18-active.png')
      .i19
        background url('../leftnav/img/19-active.png')
      .i20
        background url('../leftnav/img/20-active.png')
      .i21
        background url('../leftnav/img/21-active.png')
      .i22
        background url('../leftnav/img/22-active.png')
      .i23
        background url('../leftnav/img/23-active.png')
      .i24
        background url('../leftnav/img/24-active.png')
      .i25
        background url('../leftnav/img/25-active.png')
      .i26
        background url('../leftnav/img/26-active.png')
      .i27
        background url('../leftnav/img/27-active.png')
      .i28
        background url('../leftnav/img/28-active.png')
      .i29
        background url('../leftnav/img/29-active.png')
      .i30
        background url('../leftnav/img/21-active.png')
</style>

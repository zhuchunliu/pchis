<template lang="pug">
  div
    el-tooltip(effect="dark", placement="left", content="医生排班", v-if="new RegExp('医生排班').test(pathAll)")
      router-link(to="/doctorvisits/scheduling", tag="div").menu
        i.i2
    el-tooltip(effect="dark", placement="left", content="挂号列表", v-if="new RegExp('挂号列表').test(pathAll)")
      router-link(to="/doctorvisits/registrationlist", tag="div").menu
        i.i3
    el-tooltip(effect="dark", placement="left", content="医生门诊", v-if="new RegExp('医生门诊').test(pathAll)")
      router-link(to="/doctorvisits/admissions", tag="div").menu
        i.i1
    el-tooltip(effect="dark", placement="left", content="患者库", v-if="new RegExp('患者库').test(pathAll)")
      router-link(to="/doctorvisits/patientslibrary", tag="div").menu
        i.i4

    el-tooltip(effect="dark", placement="left", content="收费发药", v-if="new RegExp('收费发药').test(pathAll)")
      router-link(to="/dispensingfees/dispensefee", tag="div").menu
        i.i5
    el-tooltip(effect="dark", placement="left", content="药品零售", v-if="new RegExp('药品零售').test(pathAll)")
      router-link(to="/dispensingfees/sellfees", tag="div").menu
        i.i29

    el-tooltip(effect="dark", placement="left", content="药品信息维护", v-if="new RegExp('药品信息维护').test(pathAll)")
      router-link(to="/druginventory/informationmaintenance", tag="div").menu
        i.i6
    el-tooltip(effect="dark", placement="left", content="供应商维护", v-if="new RegExp('供应商维护').test(pathAll)")
      router-link(to="/druginventory/supplier", tag="div").menu
        i.i7
    el-tooltip(effect="dark", placement="left", content="采购入库", v-if="new RegExp('采购入库').test(pathAll)")
      router-link(to="/druginventory/purchase", tag="div").menu
        i.i8
    el-tooltip(effect="dark", placement="left", content="入库审核", v-if="new RegExp('入库审核').test(pathAll)")
      router-link(to="/druginventory/storageaudit", tag="div").menu
        i.i9
    el-tooltip(effect="dark", placement="left", content="库存盘点", v-if="new RegExp('库存盘点').test(pathAll)")
      router-link(to="/druginventory/stockcheck", tag="div").menu
        i.i26
    el-tooltip(effect="dark", placement="left", content="盘点审核", v-if="new RegExp('盘点审核').test(pathAll)")
      router-link(to="/druginventory/stockcheckpurchase", tag="div").menu
        i.i27
    el-tooltip(effect="dark", placement="left", content="库存查询", v-if="new RegExp('库存查询').test(pathAll)")
      router-link(to="/druginventory/instock", tag="div").menu
        i.i10

    el-tooltip(effect="dark", placement="left", content="诊所收支统计", v-if="new RegExp('诊所收支统计').test(pathAll)")
      router-link(to="/statistics/balanceofpayments", tag="div").menu
        i.i11
    el-tooltip(effect="dark", placement="left", content="药品销售统计", v-if="new RegExp('药品销售统计').test(pathAll)")
      router-link(to="/statistics/drug", tag="div").menu
        i.i12
    el-tooltip(effect="dark", placement="left", content="检查项目统计", v-if="new RegExp('检查项目统计').test(pathAll)")
      router-link(to="/statistics/inspection", tag="div").menu
        i.i13
    el-tooltip(effect="dark", placement="left", content="年月报表统计", v-if="new RegExp('年月报表统计').test(pathAll)")
      router-link(to="/statistics/yearmonth", tag="div").menu
        i.i14
    el-tooltip(effect="dark", placement="left", content="工作量统计", v-if="new RegExp('工作量统计').test(pathAll)")
      router-link(to="/statistics/work", tag="div").menu
        i.i15

    el-tooltip(effect="dark", placement="left", content="员工管理", v-if="new RegExp('员工管理').test(pathAll)")
      router-link(to="/system/doctor", tag="div").menu
        i.i16
    el-tooltip(effect="dark", placement="left", content="权限管理", v-if="new RegExp('权限管理').test(pathAll)")
      router-link(to="/system/permission", tag="div").menu
        i.i24
    el-tooltip(effect="dark", placement="left", content="机构管理", v-if="new RegExp('机构管理').test(pathAll)")
      router-link(to="/system/departments", tag="div").menu
        i.i25
    el-tooltip(effect="dark", placement="left", content="科室管理", v-if="new RegExp('科室管理').test(pathAll)")
      router-link(to="/system/departments", tag="div").menu
        i.i17
    el-tooltip(effect="dark", placement="left", content="模板维护", v-if="new RegExp('模板维护').test(pathAll)")
      router-link(to="/system/stencil", tag="div").menu
        i.i18
    el-tooltip(effect="dark", placement="left", content="费用管理", v-if="new RegExp('费用管理').test(pathAll)")
      router-link(to="/system/cost", tag="div").menu
        i.i19
    el-tooltip(effect="dark", placement="left", content="字典表维护", v-if="new RegExp('字典表维护').test(pathAll)")
      router-link(to="/system/dictionary", tag="div").menu
        i.i20
    el-tooltip(effect="dark", placement="left", content="药品字典维护", v-if="new RegExp('药品字典维护').test(pathAll)")
      router-link(to="/system/drugdic", tag="div").menu
        i.i28
    el-tooltip(effect="dark", placement="left", content="生产商管理", v-if="new RegExp('生产商管理').test(pathAll)")
      router-link(to="/system/addmanufactured", tag="div").menu
        i.i22
    el-tooltip(effect="dark", placement="left", content="供应商管理", v-if="new RegExp('供应商管理').test(pathAll)")
      router-link(to="/system/addsupplier", tag="div").menu
        i.i23
    el-tooltip(effect="dark", placement="left", content="诊所信息", v-if="new RegExp('诊所信息').test(pathAll)")
      router-link(to="/system/clinic", tag="div").menu
        i.i21
    el-tooltip(effect="dark", placement="left", content="个人中心", v-if="new RegExp('个人中心').test(pathAll)")
      router-link(to="/system/personal", tag="div").menu
        i.i21

    el-tooltip(effect="dark", placement="left", content="渠道", v-if="new RegExp('渠道').test(pathAll)")
      router-link(to="/bsg/hospitallist", tag="div").menu
        i.i16
</template>
<script>

export default {
  props: ['pathAll']
}
</script>
<style lang="stylus" scoped>
@import './../../assets/css/var.styl'
.menu
  height 60px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  border-bottom 1px solid #3A4350
  cursor pointer
  transition all 0.5s ease
  &:hover
    background-color #545F6F
  i
    display flex
    justify-content center
    align-items center
    width 30px
    height 30px
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

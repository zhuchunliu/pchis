<template lang="pug">
  div
    .menu(v-if="new RegExp('医生排班').test(pathAll)", @click="jumpstate(2, $event)")
      el-tooltip(effect="dark", placement="left", content="医生排班")
        img.img(:src="$store.state.activeIndex == 'i2' ? two_active : two", data-index="i2")
    .menu(v-if="new RegExp('挂号列表').test(pathAll)", @click="jumpstate(2, $event)")
      el-tooltip(effect="dark", placement="left", content="挂号列表")
        img.img(:src="$store.state.activeIndex == 'i3' ? three_active : three", data-index="i3")
    .menu(v-if="new RegExp('医生门诊').test(pathAll)", @click="jumpstate(2, $event)")
      el-tooltip(effect="dark", placement="left", content="医生门诊")
        img.img(:src="$store.state.activeIndex == 'i1' ? one_active : one", data-index="i1")
    .menu(v-if="new RegExp('患者库').test(pathAll)", @click="jumpstate(2, $event)")
      el-tooltip(effect="dark", placement="left", content="患者库")
        img.img(:src="$store.state.activeIndex == 'i4' ? four_active : four", data-index="i4")

    .menu(v-if="new RegExp('收费发药').test(pathAll)", @click="jumpstate(3, $event)")
      el-tooltip(effect="dark", placement="left", content="收费发药")
        img.img(:src="$store.state.activeIndex == 'i5' ? five_active : five", data-index="i5")
    .menu(v-if="new RegExp('药品零售').test(pathAll)", @click="jumpstate(3, $event)")
      el-tooltip(effect="dark", placement="left", content="药品零售")
        img.img(:src="$store.state.activeIndex == 'i29' ? twentyNine_active : twentyNine", data-index="i29")

    .menu(v-if="new RegExp('药品信息维护').test(pathAll)", @click="jumpstate(4, $event)")
      el-tooltip(effect="dark", placement="left", content="药品信息维护")
        img.img(:src="$store.state.activeIndex == 'i6' ? six_active : six", data-index="i6")
    .menu(v-if="new RegExp('供应商维护').test(pathAll)", @click="jumpstate(4, $event)")
      el-tooltip(effect="dark", placement="left", content="供应商维护")
        img.img(:src="$store.state.activeIndex == 'i7' ? seven_active : seven", data-index="i7")   
    .menu(v-if="new RegExp('采购入库').test(pathAll)", @click="jumpstate(4, $event)")
      el-tooltip(effect="dark", placement="left", content="采购入库")
        img.img(:src="$store.state.activeIndex == 'i8' ? eight_active : eight", data-index="i8")
    .menu(v-if="new RegExp('入库审核').test(pathAll)", @click="jumpstate(4, $event)")
      el-tooltip(effect="dark", placement="left", content="入库审核")
        img.img(:src="$store.state.activeIndex == 'i9' ? nine_active : nine", data-index="i9") 
    .menu(v-if="new RegExp('库存盘点').test(pathAll)", @click="jumpstate(4, $event)")
      el-tooltip(effect="dark", placement="left", content="库存盘点")
        img.img(:src="$store.state.activeIndex == 'i26' ? twentySix_active : twentySix", data-index="i26")   
    .menu(v-if="new RegExp('盘点审核').test(pathAll)", @click="jumpstate(4, $event)")
      el-tooltip(effect="dark", placement="left", content="盘点审核")
        img.img(:src="$store.state.activeIndex == 'i27' ? twentySeven_active : twentySeven", data-index="i27")
    .menu(v-if="new RegExp('库存查询').test(pathAll)", @click="jumpstate(4, $event)")
      el-tooltip(effect="dark", placement="left", content="库存查询")
        img.img(:src="$store.state.activeIndex == 'i10' ? ten_active : ten", data-index="i10")

    .menu(v-if="new RegExp('诊所收支统计').test(pathAll)", @click="jumpstate(5, $event)")
      el-tooltip(effect="dark", placement="left", content="诊所收支统计")
        img.img(:src="$store.state.activeIndex == 'i11' ? eleven_active : eleven", data-index="i11")
    .menu(v-if="new RegExp('药品销售统计').test(pathAll)", @click="jumpstate(5, $event)")
      el-tooltip(effect="dark", placement="left", content="药品销售统计")
        img.img(:src="$store.state.activeIndex == 'i12' ? twelve_active : twelve", data-index="i12") 
    .menu(v-if="new RegExp('检查项目统计').test(pathAll)", @click="jumpstate(5, $event)")
      el-tooltip(effect="dark", placement="left", content="检查项目统计")
        img.img(:src="$store.state.activeIndex == 'i13' ? thirteen_active : thirteen", data-index="i13")   
    .menu(v-if="new RegExp('年月报表统计').test(pathAll)", @click="jumpstate(5, $event)")
      el-tooltip(effect="dark", placement="left", content="年月报表统计")
        img.img(:src="$store.state.activeIndex == 'i14' ? fourteen_active : fourteen", data-index="i14")
    .menu(v-if="new RegExp('工作量统计').test(pathAll)", @click="jumpstate(5, $event)")
      el-tooltip(effect="dark", placement="left", content="工作量统计")
        img.img(:src="$store.state.activeIndex == 'i15' ? fifteen_active : fifteen", data-index="i15")

    .menu(v-if="new RegExp('员工管理').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="员工管理")
        img.img(:src="$store.state.activeIndex == 'i16' ? sixteen_active : sixteen", data-index="i16")
    .menu(v-if="new RegExp('权限管理').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="权限管理")
        img.img(:src="$store.state.activeIndex == 'i24' ? twentyFour_active : twentyFour", data-index="i24") 
    .menu(v-if="new RegExp('机构管理').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="机构管理")
        img.img(:src="$store.state.activeIndex == 'i25' ? twentyFive_active : twentyFive", data-index="i25")   
    .menu(v-if="new RegExp('科室管理').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="科室管理")
        img.img(:src="$store.state.activeIndex == 'i17' ? seventeen_active : seventeen", data-index="i17")
    .menu(v-if="new RegExp('模板维护').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="模板维护")
        img.img(:src="$store.state.activeIndex == 'i18' ? eighteen_active : eighteen", data-index="i18")
    .menu(v-if="new RegExp('费用管理').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="费用管理")
        img.img(:src="$store.state.activeIndex == 'i19' ? nineteen_active : nineteen", data-index="i19")
    .menu(v-if="new RegExp('字典表维护').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="字典表维护")
        img.img(:src="$store.state.activeIndex == 'i20' ? twenty_active : twenty", data-index="i20") 
    .menu(v-if="new RegExp('药品字典维护').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="药品字典维护")
        img.img(:src="$store.state.activeIndex == 'i28' ? twentyEight_active : twentyEight", data-index="i28")   
    .menu(v-if="new RegExp('生产商管理').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="生产商管理")
        img.img(:src="$store.state.activeIndex == 'i22' ? twentyTwo_active : twentyTwo", data-index="i22")
    .menu(v-if="new RegExp('供应商管理').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="供应商管理")
        img.img(:src="$store.state.activeIndex == 'i23' ? twentyThree_active : twentyThree", data-index="i23")
    .menu(v-if="new RegExp('诊所信息').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="诊所信息")
        img.img(:src="$store.state.activeIndex == 'i21' ? twentyOne_active : twentyOne", data-index="i21")
    .menu(v-if="new RegExp('个人中心').test(pathAll)", @click="jumpstate(6, $event)")
      el-tooltip(effect="dark", placement="left", content="个人中心")
        img.img(:src="$store.state.activeIndex == 'iper' ? twentyOne_active : twentyOne", data-index="iper")

    .menu(v-if="new RegExp('医院管理').test(pathAll)", @click="jumpstate(7, $event)")
      el-tooltip(effect="dark", placement="left", content="医院管理")
        img.img(:src="$store.state.activeIndex == 'i30' ? twentyOne_active : twentyOne", data-index="i30")
</template>
<script>
import iOne from '../leftnav/img/1.png'
import iOneActive from '../leftnav/img/1-active.png'
import iTwo from '../leftnav/img/2.png'
import iTwoActive from '../leftnav/img/2-active.png'
import iThree from '../leftnav/img/3.png'
import iThreeActive from '../leftnav/img/3-active.png'
import iFour from '../leftnav/img/4.png'
import iFourActive from '../leftnav/img/4-active.png'
import iFive from '../leftnav/img/5.png'
import iFiveActive from '../leftnav/img/5-active.png'
import iSix from '../leftnav/img/6.png'
import iSixActive from '../leftnav/img/6-active.png'
import iSeven from '../leftnav/img/7.png'
import iSevenActive from '../leftnav/img/7-active.png'
import iEight from '../leftnav/img/8.png'
import iEightActive from '../leftnav/img/8-active.png'
import iNine from '../leftnav/img/9.png'
import iNineActive from '../leftnav/img/9-active.png'
import iTen from '../leftnav/img/10.png'
import iTenActive from '../leftnav/img/10-active.png'
import iEleven from '../leftnav/img/11.png'
import iElevenActive from '../leftnav/img/11-active.png'
import iTwelve from '../leftnav/img/12.png'
import iTwelveActive from '../leftnav/img/12-active.png'
import iThirteen from '../leftnav/img/13.png'
import iThirteenActive from '../leftnav/img/13-active.png'
import iFourteen from '../leftnav/img/14.png'
import iFourteenActive from '../leftnav/img/14-active.png'
import iFifteen from '../leftnav/img/15.png'
import iFifteenActive from '../leftnav/img/15-active.png'
import iSixteen from '../leftnav/img/16.png'
import iSixteenActive from '../leftnav/img/16-active.png'
import iSeventeen from '../leftnav/img/17.png'
import iSeventeenActive from '../leftnav/img/17-active.png'
import iEighteen from '../leftnav/img/18.png'
import iEighteenActive from '../leftnav/img/18-active.png'
import iNineteen from '../leftnav/img/19.png'
import iNineteenActive from '../leftnav/img/19-active.png'
import iTwenty from '../leftnav/img/20.png'
import iTwentyActive from '../leftnav/img/20-active.png'
import iTwentyOne from '../leftnav/img/21.png'
import iTwentyOneActive from '../leftnav/img/21-active.png'
import iTwentyTwo from '../leftnav/img/22.png'
import iTwentyTwoActive from '../leftnav/img/22-active.png'
import iTwentyThree from '../leftnav/img/23.png'
import iTwentyThreeActive from '../leftnav/img/23-active.png'
import iTwentyFour from '../leftnav/img/24.png'
import iTwentyFourActive from '../leftnav/img/24-active.png'
import iTwentyFive from '../leftnav/img/25.png'
import iTwentyFiveActive from '../leftnav/img/25-active.png'
import iTwentySix from '../leftnav/img/26.png'
import iTwentySixActive from '../leftnav/img/26-active.png'
import iTwentySeven from '../leftnav/img/27.png'
import iTwentySevenActive from '../leftnav/img/27-active.png'
import iTwentyEight from '../leftnav/img/28.png'
import iTwentyEightActive from '../leftnav/img/28-active.png'
import iTwentyNine from '../leftnav/img/29.png'
import iTwentyNineActive from '../leftnav/img/29-active.png'
export default {
  props: ['pathAll'],
  data () {
    return {
      one: iOne,
      one_active: iOneActive,
      two: iTwo,
      two_active: iTwoActive,
      three: iThree,
      three_active: iThreeActive,
      four: iFour,
      four_active: iFourActive,
      five: iFive,
      five_active: iFiveActive,
      six: iSix,
      six_active: iSixActive,
      seven: iSeven,
      seven_active: iSevenActive,
      eight: iEight,
      eight_active: iEightActive,
      nine: iNine,
      nine_active: iNineActive,
      ten: iTen,
      ten_active: iTenActive,
      eleven: iEleven,
      eleven_active: iElevenActive,
      twelve: iTwelve,
      twelve_active: iTwelveActive,
      thirteen: iThirteen,
      thirteen_active: iThirteenActive,
      fourteen: iFourteen,
      fourteen_active: iFourteenActive,
      fifteen: iFifteen,
      fifteen_active: iFifteenActive,
      sixteen: iSixteen,
      sixteen_active: iSixteenActive,
      seventeen: iSeventeen,
      seventeen_active: iSeventeenActive,
      eighteen: iEighteen,
      eighteen_active: iEighteenActive,
      nineteen: iNineteen,
      nineteen_active: iNineteenActive,
      twenty: iTwenty,
      twenty_active: iTwentyActive,
      twentyOne: iTwentyOne,
      twentyOne_active: iTwentyOneActive,
      twentyTwo: iTwentyTwo,
      twentyTwo_active: iTwentyTwoActive,
      twentyThree: iTwentyThree,
      twentyThree_active: iTwentyThreeActive,
      twentyFour: iTwentyFour,
      twentyFour_active: iTwentyFourActive,
      twentyFive: iTwentyFive,
      twentyFive_active: iTwentyFiveActive,
      twentySix: iTwentySix,
      twentySix_active: iTwentySixActive,
      twentySeven: iTwentySeven,
      twentySeven_active: iTwentySevenActive,
      twentyEight: iTwentyEight,
      twentyEight_active: iTwentyEightActive,
      twentyNine: iTwentyNine,
      twentyNine_active: iTwentyNineActive
    }
  },
  methods: {
    jumpstate (type, e) {
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
  }
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
  &:hover
    background-color #545F6F
  .img
    cursor pointer
</style>

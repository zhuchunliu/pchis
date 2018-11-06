<template lang="pug">
  .pagecontent
    .page-left
      .headimg
        //- img(v-if="patientinfo.avatar", :src='patientinfo.avatar')
        img(v-if="!patientinfo.avatar&&patientinfo.gender == 1", :src='women')
        img(v-if="!patientinfo.avatar&&patientinfo.gender == 0", :src='men')
      .name {{patientinfo.userName}}
      .item
        .l 性别：
        .r {{patientinfo.gender == 1 ? '女' : '男'}}
      .item
        .l 年龄：
        .r {{patientinfo.age}}
      .item
        .l 身份证：
        .r {{patientinfo.idCard}}
      .item
        .l 出生日期：
        .r {{patientinfo.dateOfBirth}}
      .item
        .l 社保号：
        .r {{patientinfo.socialCard}}
      .item
        .l 手机号：
        .r {{patientinfo.mobile}}
      .item
        .l 住址：
        .r {{patientinfo.address}}
      .item
        .l 过敏史：
        .r {{patientinfo.anaphylaxis}}
    .page-right
      .card
        .title 病历详情
        .card-body
          el-row.elrow
            el-col.col(:lg="8", :sm='8', :xs="8")
              .lable 发病日期 
              .card-content {{record.onSetDate ? record.onSetDate.slice(0, 10) : ''}}
            el-col.col(:lg="6", :sm='7', :xs="7")
              .lable 接诊类型 
              .card-content {{record.isFirst === '0' ? '复诊' : (record.isFirst === '1' ? '初诊' : '')}}
          .row
            .lable.lable 主诉
            .card-content {{record.chiefComplaint}}
          .row
            .lable 诊断详情
            .card-content
              span(v-for="item, i in diagnosisTags", :key="i", v-if="i==0") {{item}}
              span(v-else) , {{item}}
      .card(v-if="dynamicTableData.length > 0")
        .title 处方详情
        .card-body
          .table(v-for="tag, index in dynamicTableData", :key="'0' + index", v-show="tag.type != -2")
            el-table(
              stripe,
              :data='tag.itemList',
              size='medium',
              border,
              style="width: 100%"
            )
              el-table-column(label="药品名称", prop='drugName', align='center')
              el-table-column(label="生产厂商", prop='manufacturerName', align='center')
              el-table-column(label="单次剂量", align='center')
                template(slot-scope="scope")
                  span {{scope.row.singleDose}}{{scope.row.singleDoseUnitName}}
              el-table-column(label="使用频次", prop="frequencyName", align='center')
              el-table-column(label="数量", align='center')
                template(slot-scope="scope")
                  span {{scope.row.num}}
                  span(v-if="scope.row.unitType == 1") {{scope.row.unitName}}
                  span(v-if="scope.row.minPriceUnitType == 1 && scope.row.unitType == 2") {{scope.row.minUnitName}}
                  span(v-if="scope.row.minPriceUnitType == 2 && scope.row.unitType == 2") {{scope.row.doseUnitName}}

      .card(v-if="inspectList.length > 0")
        .title 检查检验
        .card-body
          .table(v-for="tag, index in inspectList", :key="index + '1'")
            el-table(
              stripe,
              :data='tag',
              size='medium',
              border,
              style="width: 100%"
            )
              el-table-column(label="检查类型", prop='categoryName', align='center')
              el-table-column(label="检查目的", prop='aim', align='center')
              el-table-column(label="检查部位", prop='part', align='center')
      .card(v-if="FjfData.length > 0")
        .title 附加费
        .card-body
          el-table.table(
            stripe,
            :data='FjfData',
            size='medium',
            border,
            style="width: 100%"
          )
            el-table-column(label="名称", prop='categoryName', align='center')
            el-table-column(label="价格", prop='fee', align='center')
      
      .card(v-if="injectList.length > 0")
        .title 注射单
        .card-body
          .table(v-for="tag, index in injectList", :key="index")
            el-table(
              stripe,
              :data='tag',
              size='medium',
              border,
              style="width: 100%"
            )
              el-table-column(label="药品名称", prop='drugName', align='center')
              el-table-column(label="生产厂商", prop='manufacturerName', align='center')
              el-table-column(label="单次剂量", align='center')
                template(slot-scope="scope")
                  span {{scope.row.singleDose}}{{scope.row.singleDoseUnitName}}
              el-table-column(label="使用频次", prop="frequencyName", align='center')
              el-table-column(label="备注", prop="memo")
</template>
<script>
const men = require('@/assets/img/men.png')
const women = require('@/assets/img/women.png')
export default {
  data () {
    return {
      men: men,
      women: women,
      dynamicTableData: [], // 药品处方
      FjfData: [], // 附加费
      injectList: [], // 注射单
      patientinfo: {}, // 患者信息
      inspectList: [], // 检验检查
      record: {},  // 病历
      diagnosisTags: []
    }
  },
  methods: {
    getPre (id) {
      this.$api.getPre({
        applyId: id
      }).then(res => {
        if (res.success) {
          // 患者信息
          this.patientinfo = res.result.patient
          // 病历详情
          this.record = res.result.record
          if (this.record.diagnosis && !this.record.diagnosis.includes('&&|&&')) {
            this.diagnosisTags[0] = this.record.diagnosis
          }
          if (this.record.diagnosis && this.record.diagnosis.includes('&&|&&')) {
            this.diagnosisTags = this.record.diagnosis.split('&&|&&')
          }
          // 处方解析
          res.result.preList.map(item => {
            // 附加费
            item.chargeList.map(fjfdata => {
              this.FjfData.push(fjfdata)
            })
            // 药品处方
            if (item.itemList.length > 0) {
              this.dynamicTableData.push({
                type: '',
                itemList: item.itemList // 药品集合
              })
            }
            // 检查集合
            if (item.inspectList.length > 0) {
              this.inspectList.push(item.inspectList)
            }
          })
          // 注射单
          if (res.result.injectList) {
            this.injectList = res.result.injectList
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    let id = this.$route.query.id
    this.getPre(id)
  }
}
</script>
<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.pagecontent
  position relative
  height calc(100vh - 110px)
  .page-left
    box-sizing border-box
    position absolute
    left 20px
    top 20px
    width 300px
    display flex
    flex-direction column
    background #f8f8f8
    height 100%
    padding-top 30px
    .headimg
      margin 0 auto
      img 
        width 60px
        height 60px
        border-radius 50%
    .name
      margin 20px auto
      font-size 18px
    .item
      display flex
      flex-direction row
      justify-content space-between
      line-height 34px
      color $elBlack
      padding 0 20px
      .r
        color #333
  .page-right
    box-sizing border-box
    position absolute
    left 320px
    top 20px
    width calc(100% - 340px)
    height 100%
    overflow-y auto
    // flex 1
    min-height 630px
    background $White
    padding 20px
    .card
      box-sizing border-box
      width 100%
      border 1px solid $dWhite
      border-radius 5px
      box-shadow 0 0 3px $elSilver
      margin-bottom 20px
      background $White
      padding-bottom 5px
      .title
        font-size 18px
        color $lBlack
        font-weight bold
        padding 10px
        background rgba(160,217,246,.5)
        border-bottom 1px solid $elSilver
      .card-body
        padding 0 20px
        .row, .elrow
          padding 13px 0
          border-bottom 1px solid $dWhite
          .col
            display flex
            flex-flow row nowrap
          .lable
            width 80px
            font-size 14px
            font-weight bold
            color #666
          .card-content
            color $eleBlacktext
        .row
          display flex
          flex-flow row wrap
          &:last-child
            border-bottom 0
          .card-content
            flex 1
            letter-spacing 1px
            line-height 18px
        .table
          margin 10px 0 20px 0
.page-right::-webkit-scrollbar 
  width 8px
  height 8px
  background-color $White

.page-right::-webkit-scrollbar-track 
  -webkit-box-shadow inset 0 0 6px $White
          box-shadow inset 0 0 6px $White
  border-radius 5px
  background-color $White

.page-right::-webkit-scrollbar-thumb 
  -webkit-box-shadow inset 0 0 6px #e5e5e5
          box-shadow inset 0 0 6px #e5e5e5
  border-radius 5px
  background-color rgba(128,128,128,0.5)

.page-right::-webkit-scrollbar-thumb:hover
  background-color rgba(128,128,128,1)
</style>

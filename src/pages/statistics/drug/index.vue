<template lang="pug">
  .conchart
    .my-row
      // .my-col-input
        el-input(placeholder="请输入药品名称", size='small', v-model="searchval")
          el-button(slot="append", icon="el-icon-search")
      // .my-col-input
        el-select(placeholder="药品分类", v-model="select" size='small')
          el-option(value='1', label='全部')

      .my-col1
        el-date-picker(v-model="date", size='small',
          type="daterange",
          align="right",
          unlink-panels,
          :editable= 'false',
          range-separator="至",
          start-placeholder="开始日期",
          end-placeholder="结束日期",
          :picker-options="dateOption",
          @change='dateChange')

    .moneycard
      .right
        .top
          .title 收支概况
          .item
            .money ¥{{profit}}
            .line
            .info 总利润
          .item
            .money ¥{{purchaseFee}}
            .line
            .info 批发总价
          .item
            .money ¥{{saleFee}}
            .line
            .info 销售总价

            //- id (integer, optional): 主键 ,
            //- orgCode (integer, optional): 医疗机构编码 ,
            //- retailFee (number, optional): 采购处方总额 ,
    el-tabs(type="card")
      el-tab-pane(label='药品出库明细')
        el-table(
          :data="chukuPage.data",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="category", label="药品分类", align='center')
            template(slot-scope="scope")
              span(v-if="scope.row.category == 0") 西药
              span(v-if="scope.row.category == 1") 中成药
              span(v-if="scope.row.category == 2") 中药
              span(v-if="scope.row.category == 3") 血液制品
              span(v-if="scope.row.category == 4") 诊断试剂
          el-table-column(prop="drugcode", label="药品编码", align='center')
          el-table-column(prop="drugName", label="药品名称", align='center')
          el-table-column(prop="storeNum", label="库存数量", align='center')
          el-table-column(prop="bid", label="进价", align='center')
          el-table-column(prop="retailPrice", label="零售价", align='center')
          el-table-column(prop="profitFee", label="利润", align='center')
          el-table-column(prop="salenum", label="销售数量", align='center')
          el-table-column(prop="unit", label="计价单位", align='center')
        .pagination
          el-pagination(
            background,
            :page-size="chukuPage.pageSize",
            layout="total, prev, pager, next, jumper",
            :current-page.sync="chukuPage.pageNum",
            :total="chukuPage.total",
            @current-change='reportsalepage')

      el-tab-pane(label='药品出库排行')
        el-table(
          :data="chukuList",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(label="排行", align='center')
            template(slot-scope="scope")
              div.paiming
                img(src='./img/1.png', v-if="scope.$index == 0")
                img(src='./img/2.png', v-else-if="scope.$index == 1")
                img(src='./img/3.png', v-else-if="scope.$index == 2")
                span(v-else) {{scope.$index + 1}}
          el-table-column(prop="category", label="药品分类", align='center')
            template(slot-scope="scope")
              span(v-if="scope.row.category == 0") 西药
              span(v-if="scope.row.category == 1") 中成药
              span(v-if="scope.row.category == 2") 中药
              span(v-if="scope.row.category == 3") 血液制品
              span(v-if="scope.row.category == 4") 诊断试剂
          el-table-column(prop="drugcode", label="药品编码", align='center')
          el-table-column(prop="drugName", label="药品名称", align='center')
          el-table-column(prop="storeNum", label="库存数量", align='center')
          el-table-column(prop="bid", label="进价", align='center')
          el-table-column(prop="retailPrice", label="零售价", align='center')
          el-table-column(prop="profitFee", label="利润", align='center')
          el-table-column(prop="salenum", label="销售数量", align='center')
          el-table-column(prop="unit", label="计价单位", align='center')

      el-tab-pane(label='药品入库明细')
        el-table(
          :data="rukuPage.data",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="drugCode", label="药品编码", align='center')
          el-table-column(prop="drugName", label="药品名称", align='center')
          el-table-column(prop="storeNum", label="库存数量", align='center')
          el-table-column(prop="bid", label="进价", align='center')
          el-table-column(prop="retailPrice", label="零售价", align='center')
          el-table-column(prop="num", label="采购数量", align='center')
          el-table-column(prop="bidFee", label="采购批发总额", align='center')
          el-table-column(prop="retailFee", label="采购处方总额", align='center')
        .pagination
          el-pagination(
            background,
            :page-size="rukuPage.pageSize",
            layout="total, prev, pager, next, jumper",
            :current-page.sync="rukuPage.pageNum",
            :total="rukuPage.total",
            @current-change='reportpurchasepage')

      el-tab-pane(label='药品入库排行')
        el-table(
          :data="rukuList",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(label="排行", align='center')
            template(slot-scope="scope")
              div.paiming
                img(src='./img/1.png', v-if="scope.$index == 0")
                img(src='./img/2.png', v-else-if="scope.$index == 1")
                img(src='./img/3.png', v-else-if="scope.$index == 2")
                span(v-else) {{scope.$index + 1}}
          el-table-column(prop="drugCode", label="药品编码", align='center')
          el-table-column(prop="drugName", label="药品名称", align='center')
          el-table-column(prop="storeNum", label="库存数量", align='center')
          el-table-column(prop="bid", label="进价", align='center')
          el-table-column(prop="retailPrice", label="零售价", align='center')
          el-table-column(prop="num", label="采购数量", align='center')
          el-table-column(prop="bidFee", label="采购批发总额", align='center')
          el-table-column(prop="retailFee", label="采购处方总额", align='center')


          //- category (string, optional): 药品分类 0:西药；1：中成药；2：中药；3：血液制品；4：诊断试剂 ,
          //- profitFee (number, optional): 利润 ,
          //- salenum (number, optional): 销售数量 ,
          //- unit (string, optional): 计价单位
</template>

<script>
export default {
  data () {
    return {
      purchaseFee: 0,
      saleFee: 0,
      profit: 0,
      date: [],
      dateOption: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 86400000
        },
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 91)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      rukuPage: {
        pageSize: this.$store.state.userAgent ? 8 : 20,
        pageNum: 1,
        total: 0,
        data: []
      },
      rukuList: [],
      chukuPage: {
        pageSize: this.$store.state.userAgent ? 8 : 20,
        pageNum: 1,
        total: 0,
        data: []
      },
      chukuList: []
    }
  },
  methods: {
    // 药品  入库明细
    reportpurchasepage () {
      this.$api.reportpurchasepage({
        pageNum: this.rukuPage.pageNum,
        pageSize: this.rukuPage.pageSize,
        param: {
          startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
        }
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.rukuPage.data = res.result.data
          this.rukuPage.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 入库排行
    reportpurchaselist () {
      this.$api.reportpurchaselist({
        startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.rukuList = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 药品  出库明细
    reportsalepage () {
      this.$api.reportsalepage({
        pageNum: this.chukuPage.pageNum,
        pageSize: this.chukuPage.pageSize,
        param: {
          startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
        }
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.chukuPage.data = res.result.data
          this.chukuPage.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 出库排行
    reportsalelist () {
      this.$api.reportsalelist({
        startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.chukuList = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    reportdrugsurvey () {
      this.$api.reportdrugsurvey({
        startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.purchaseFee = res.result.purchaseFee
          this.saleFee = res.result.saleFee
          this.profit = res.result.profit
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    dateChange () {
      if (!this.date || !this.date[0]) {
        this.$message.error('请选择日期范围！')
        return false
      }
      this.chukuPage.pageNum = 1
      this.rukuPage.pageNum = 1
      this.reportdrugsurvey()
      this.reportpurchasepage()
      this.reportpurchaselist()
      this.reportsalepage()
      this.reportsalelist()
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
    this.date = [start, end]
    this.reportdrugsurvey()
    this.reportpurchasepage()
    this.reportpurchaselist()
    this.reportsalepage()
    this.reportsalelist()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.paiming
  display flex
  justify-content center
  align-items center
.pagination
  margin-top 20px
  text-align center
.el-tabs
  margin-top 20px
.moneycard
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
  margin-top 20px
  .right
    flex 3
    display flex
    flex-flow column nowrap
    .top, .bottom
      width 100%
      height 70px
      background #51cd9d
      display flex
      .title
        flex 0 0 100px
        padding-left 15px
        line-height 70px
        color $White
        font-size 17px
        text-align center
      .item
        flex 0 0
        display flex
        flex-flow column nowrap
        justify-content center
        align-items center
        margin-right 10px
        .money
          color $White
          font-size 15px
        .line
          border-bottom 1px solid rgba(255, 255, 255, 0.6)
          width 60px
          height 0
          margin 7px
        .info
          color $White
.conchart
  padding 20px 15px
  background $White
.my-row
  display flex
  flex-flow row nowrap
  align-items center
  justify-content flex-start
  .my-col-input
    flex 0 0 200px
    margin-right 15px
  .my-col1
    flex 0 0 160px
    margin-right 15px
  .my-col
    flex 1
    text-align right
</style>

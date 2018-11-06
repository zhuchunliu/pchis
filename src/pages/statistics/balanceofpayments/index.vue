<template lang="pug">
  .conchart
    .my-row
      // .my-col-input
        el-select(placeholder="收支分类", v-model="select" size='small')
          el-option(value='1', label='全部')
        el-input(placeholder="请输入内容", size='small', v-model="searchval")
          el-button(slot="append", icon="el-icon-search")

      // .my-col1
        el-select(placeholder="交易状态", v-model="select" size='small')
          el-option(value='1', label='全部')
      .my-col1
        el-date-picker(v-model="date", size='small',
          type="daterange",
          align="right",
          unlink-panels,
          range-separator="至",
          :editable= 'false',
          start-placeholder="开始日期",
          end-placeholder="结束日期",
          :picker-options="dateOption",
          @change='dateChange')
      // .my-col 
        el-button(size="small", type="primary") 导出
    .moneycard
      .left
        .allMoney ¥ 
          span {{allMoney}}
        .line
        .info 累计收入
      .right
        .top
          .title 收支分类
          .item
            .money ¥ {{(all.appendMoney + all.drugMoney + all.prescriptionMoney).toFixed(2)}}
            .line
            .info 就诊收入
          .item
            .money ¥ {{all.applyMoney}}
            .line
            .info 挂号收入
          .item
            .money ¥ {{(all.appendRefundMoney + all.drugRefundMoney + all.prescriptionRefundMoney).toFixed(2)}}
            .line
            .info 就诊退款
          .item
            .money ¥ {{all.applyRefundMoney}}
            .line
            .info 挂号退款
        .bottom
          .title 收支渠道
          .item
            .money ¥ {{all.cashMoney}}
            .line
            .info 现金收入
          .item
            .money ¥ {{all.aliPayMoney}}
            .line
            .info 支付宝收入
          .item
            .money ¥ {{all.wxPayMoney}}
            .line
            .info 微信收入
          .item
            .money ¥ {{all.cashRefundMoney}}
            .line
            .info 现金退款
          .item
            .money ¥ {{all.aliPayRefundMoney}}
            .line
            .info 支付宝退款
          .item
            .money ¥ {{all.wxPayRefundMoney}}
            .line
            .info 微信退款
    .chartcon
      .left
        .title 收支分类：
        .list
          .item
            i.icon.jz
            span 就诊收入
          .item
            i.icon.gh
            span 挂号收入
          .item
            i.icon.jztk
            span 处方退款
          .item
            i.icon.ghtk
            span 挂号退款
      .right
        chart.chart(:options="shouzhi")
        chart.chart(:options="shouzhiTk")
    .chartcon
      .left
        .title 收支渠道：
        .list
          .item
            i.icon.xjpay
            span 现金收入
          .item
            i.icon.alipay
            span 支付宝收入
          .item
            i.icon.wxpay
            span 微信收入
          .item
            i.icon.xjpaytk
            span 现金退款
          .item
            i.icon.alipaytk
            span 支付宝退款
          .item
            i.icon.wxpaytk
            span 微信退款
      .right
        chart.chart(:options="qudao")
        chart.chart(:options="qudaoTk")
    el-row.mt
      el-table(:data="tableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
        el-table-column(label="类型", prop="isInStr")
        // el-table-column(label="交易状态")
        el-table-column(label="患者姓名", prop='patientName')
        el-table-column(label="年龄", prop='age')
        // el-table-column(label="应收")
        el-table-column(label="支付方式", prop='feeTypeStr')
        el-table-column(label="分类", prop='sourceStr')
        el-table-column(label="金额", prop='balanceStr')
        el-table-column(label="创建日期", prop='time')
        // el-table-column(label="收费员", width='100')
    .pagination
      el-pagination(
        background,
        :page-size="pageSize",
        :current-page.sync="pageNum",
        layout="total, prev, pager, next, jumper",
        :total="total",
        @current-change='getWaterDaydetailList')
</template>

<script>
export default {
  data () {
    return {
      select: '',
      date: [],
      tableData: [],
      pageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      total: 0,
      all: {
        aliPayMoney: 0,
        aliPayRefundMoney: 0,
        cashMoney: 0,
        cashRefundMoney: 0,
        wxPayMoney: 0,
        wxPayRefundMoney: 0,
        appendMoney: 0,
        appendRefundMoney: 0,
        applyMoney: 0,
        applyRefundMoney: 0,
        drugMoney: 0,
        drugRefundMoney: 0,
        prescriptionMoney: 0,
        prescriptionRefundMoney: 0
      },
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
      }
    }
  },
  computed: {
    allMoney () {
      return (this.all.aliPayMoney + this.all.cashMoney + this.all.wxPayMoney - (this.all.aliPayRefundMoney + this.all.cashRefundMoney + this.all.wxPayRefundMoney)).toFixed(2)
    },
    shouzhi () {
      return {
        tooltip: {
          trigger: 'item',
          // formatter: '{a}<br/>{b}: ¥{c} <br/>占比：{d}%'
          formatter: '{b}：{c} <br/>所占比例：{d}%'
        },
        series: [
          {
            name: '收支分类',
            type: 'pie',
            selectedMode: 'single',
            radius: ['40%', '65%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            color: ['#51cd9d', '#ccd7d3'],
            data: [
              {name: '就诊收入', value: (this.all.appendMoney + this.all.drugMoney + this.all.prescriptionMoney).toFixed(2)},
              {name: '挂号收入', value: (this.all.applyMoney).toFixed(2)}
            ]
          }
        ]
      }
    },
    shouzhiTk () {
      return {
        tooltip: {
          trigger: 'item',
          // formatter: '{a}<br/>{b}: ¥{c} <br/>占比：{d}%'
          formatter: '{b}：{c} <br/>所占比例：{d}%'
        },
        series: [
          {
            name: '收支分类',
            type: 'pie',
            selectedMode: 'single',
            radius: ['40%', '65%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            color: ['#f85e5f', '#f59597'],
            data: [
              {name: '就诊退款', value: (this.all.appendRefundMoney + this.all.drugRefundMoney + this.all.prescriptionRefundMoney).toFixed(2)},
              {name: '挂号退款', value: (this.all.applyRefundMoney).toFixed(2)}
            ]
          }
        ]
      }
    },
    qudao () {
      return {
        tooltip: {
          trigger: 'item',
          // formatter: '{a}<br/>{b}: ¥{c} <br/>占比：{d}%'
          formatter: '{b}：{c} <br/>所占比例：{d}%'
        },
        series: [
          {
            name: '收支渠道',
            type: 'pie',
            selectedMode: 'single',
            radius: ['40%', '65%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            color: ['#fcb965', '#5ec6f3', '#9aeacb'],
            data: [
              {name: '现金支付', value: this.all.cashMoney},
              {name: '支付宝支付', value: this.all.aliPayMoney},
              {name: '微信支付', value: this.all.wxPayMoney}
            ]
          }
        ]
      }
    },
    qudaoTk () {
      return {
        tooltip: {
          trigger: 'item',
          // formatter: '{a}<br/>{b}: ¥{c} <br/>占比：{d}%'
          formatter: '{b}：{c} <br/>所占比例：{d}%'
        },
        series: [
          {
            name: '收支渠道',
            type: 'pie',
            selectedMode: 'single',
            radius: ['40%', '65%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            color: ['#eb4143', '#f85e5f', '#f59597'],
            data: [
              {name: '现金退款', value: this.all.cashRefundMoney},
              {name: '支付宝退款', value: this.all.aliPayRefundMoney},
              {name: '微信退款', value: this.all.wxPayRefundMoney}
            ]
          }
        ]
      }
    }
  },
  methods: {
    getWaterDaydetailList () {
      this.$api.waterDaydetailList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          this.tableData = res.result.data
          this.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getwaterDayZhensuoShouzhiCount () {
      this.$api.waterDayZhensuoShouzhiCount({
        startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          // console.log(res)
          this.all = res.result
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
      this.getWaterDaydetailList()
      this.getwaterDayZhensuoShouzhiCount()
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
    this.date = [start, end]
    this.getWaterDaydetailList()
    this.getwaterDayZhensuoShouzhiCount()
  }
}
</script>


<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.pagination
  margin-top 20px
  text-align center
.echarts.chart
  width 100%
  height 100%
.moneycard
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items center
  margin-top 20px
  .left
    height 150px
    margin-right 15px
    background #feb257
    flex 1
    display flex
    justify-content center
    align-items center
    flex-flow column nowrap
    .allMoney
      font-size 14px
      color $White
      border-bottom 1px solid $White
      margin-bottom 10px
      padding-bottom 15px
      span
        font-size 22px
    // .line
    //   width 30px
    //   height 0
    //   margin 15px 0 10px
    //   border-bottom 1px solid $White
    .info
      color $White
      font-size 15px
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
        flex 0 0 80px
        padding-left 15px
        line-height 70px
        color $White
        font-size 17px
        text-align center
      .item
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
    .bottom
      margin-top 10px
      background #fb7d54
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
.chartcon
  display flex
  margin-top 20px
  height 300px
  .left
    flex 0 0 150px
    .title
      font-size 15px
    .list
      margin-top 30px
      .item
        display flex
        justify-content flex-start
        align-items center
        font-size 12px
        margin-top 5px
        color $lBlack
        i.icon
          margin-right 5px
          border-radius 2px
          display inline-block
          width 20px
          height 15px
          background $Silver
          &.jz
            background #51cd9d
          &.gh
            background #ccd7d3
          &.jztk
            background #f85e5f
          &.ghtk
            background #f59597
          &.xjpay
            background #fcb965
          &.alipay
            background #5ec6f3
          &.wxpay
            background #9aeacb
          &.xjpaytk
            background #eb4143
          &.alipaytk
            background #f85e5f
          &.wxpaytk
            background #f59597
  .right
    flex 1
    display flex
    .chart
      flex 1
</style>

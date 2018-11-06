<template lang="pug">
  el-tabs(type="border-card")
    el-tab-pane(label='挂号门诊统计')
      .my-row
        .my-col-input
          el-input(placeholder="请输入内容", size='small', v-model="menzhenSearchval", @keyup.enter.native='getMenzhenTable')
            el-button(slot="append", icon="el-icon-search", @click='getMenzhenTable')
        .my-col1
          el-date-picker(
            v-model="menzhenDate", size='small',
            type="daterange",
            align="right",
            unlink-panels,
            :editable= 'false',
            range-separator="至",
            start-placeholder="开始日期",
            end-placeholder="结束日期",
            :picker-options="dateOption",
            @change='menzhenDateChange')
      el-row.mt
        el-table(:data="menzhenTable",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          //- applyFee (number, optional): 挂号金额 ,
          //- applyNum (integer, optional): 总预约量 ,
          //- applyRefundFee (number, optional): 挂号退款金额 ,
          //- breachNum (integer, optional): 违约量 ,
          //- cancelNum (integer, optional): 取消量 ,
          //- chargeFee (number, optional): 附加金额 ,
          //- chargeRefundFee (number, optional): 附加退款金额 ,
          //- date (string, optional): 报表日期 ,
          //- diagnoseNum (integer, optional): 就诊量 ,
          //- drugFee (number, optional): 药品金额 ,
          //- drugRefundFee (number, optional): 药品退款金额 ,
          //- id (integer, optional): 主键 ,
          //- incomeFee (number, optional): 净收入,挂号费+处方费-退款费 ,
          //- inspectFee (number, optional): 检查金额 ,
          //- inspectRefundFee (number, optional): 检查退款金额 ,
          //- orgCode (integer, optional): 医疗机构编码 ,
          //- prescriptionFee (number, optional): 处方金额 包含：药品/检查/附加 ,
          //- prescriptionNum (integer, optional): 处方量 ,
          //- prescriptionRefundFee (number, optional): 处方退款金额 包含：药品/检查/附加 ,
          //- userId (integer, optional): 用户主键
          el-table-column(prop="userName", label="姓名", align='center')
          el-table-column(prop="incomeFee", label="净收入", align='center')
          el-table-column(prop="applyFee", label="挂号金额", align='center')
          el-table-column(prop="applyRefundFee", label="挂号退款金额", align='center')
          el-table-column(prop="drugFee", label="药品金额", align='center')
          el-table-column(prop="drugRefundFee", label="药品退款金额", align='center')
          el-table-column(prop="inspectFee", label="检查金额", align='center')
          el-table-column(prop="inspectRefundFee", label="检查退款金额", align='center')
          el-table-column(prop="prescriptionFee", label="处方金额", align='center')
          el-table-column(prop="prescriptionRefundFee", label="处方退款金额", align='center')
          el-table-column(prop="chargeFee", label="附加金额", align='center')
          el-table-column(prop="chargeRefundFee", label="附加退款金额", align='center')
      // .pagination
        el-pagination(
          background,
          :page-size="100",
          layout="total, prev, pager, next, jumper",
          :total="1000")
    el-tab-pane(label='预约统计')
      .my-row
        // .my-col-input
          el-input(placeholder="请输入内容", size='small', v-model="yuyueSearchval")
            el-button(slot="append", icon="el-icon-search")
        .my-col1
          el-date-picker(
            v-model="yuyueDate",
            size='small',
            type="daterange",
            align="right",
            unlink-panels,
            :editable= 'false',
            range-separator="至",
            start-placeholder="开始日期",
            end-placeholder="结束日期",
            :picker-options="dateOption",
            @change='yuyueDateChange')
      .chartcon
        .left
          .title 预约统计：
          .list
            .item
              i.icon.yjz
              span 已就诊
            .item
              i.icon.yqx
              span 已取消
            .item
              i.icon.sy
              span 失约
        .right
          chart.chart(:options="yuyue")
      el-row.mt
        el-table(:data="yuyueTable",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          //- applyFee (number, optional): 挂号金额 ,
          //- applyNum (integer, optional): 总预约量 ,
          //- applyRefundFee (number, optional): 挂号退款金额 ,
          //- breachNum (integer, optional): 违约量 ,
          //- cancelNum (integer, optional): 取消量 ,
          //- chargeFee (number, optional): 附加金额 ,
          //- chargeRefundFee (number, optional): 附加退款金额 ,
          //- date (string, optional): 报表日期 ,
          //- diagnoseNum (integer, optional): 就诊量 ,
          //- drugFee (number, optional): 药品金额 ,
          //- drugRefundFee (number, optional): 药品退款金额 ,
          //- id (integer, optional): 主键 ,
          //- incomeFee (number, optional): 净收入,挂号费+处方费-退款费 ,
          //- inspectFee (number, optional): 检查金额 ,
          //- inspectRefundFee (number, optional): 检查退款金额 ,
          //- orgCode (integer, optional): 医疗机构编码 ,
          //- prescriptionFee (number, optional): 处方金额 包含：药品/检查/附加 ,
          //- prescriptionNum (integer, optional): 处方量 ,
          //- prescriptionRefundFee (number, optional): 处方退款金额 包含：药品/检查/附加 ,
          //- userId (integer, optional): 用户主键
          el-table-column(prop="date", label="日期", align='center')
          el-table-column(prop="incomeFee", label="净收入", align='center')
          el-table-column(prop="applyNum", label="总预约量", align='center')
          el-table-column(prop="cancelNum", label="取消量", align='center')
          el-table-column(prop="breachNum", label="违约量", align='center')
          el-table-column(prop="diagnoseNum", label="就诊量", align='center')
          // el-table-column(prop="prescriptionNum", label="处方量", align='center')
      // .pagination
        el-pagination(
          background,
          :page-size="100",
          layout="total, prev, pager, next, jumper",
          :total="1000")
    // el-tab-pane(label='收费员统计')
      .my-row
        .my-col-input
          el-input(placeholder="请输入内容", size='small', v-model="shoufeiSearchval")
            el-button(slot="append", icon="el-icon-search")
        .my-col1
          el-date-picker(v-model="shoufeiDate", size='small',
            type="daterange",
            align="right",
            unlink-panels,
            range-separator="至",
            start-placeholder="开始日期",
            end-placeholder="结束日期",
            :picker-options="dateOption")
      .chartcon
        .left
          .title 收费员统计：
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
        .right
          chart.chart(:options="qudao")
      el-row.mt
        el-table(
            :data="shoufeiTable",
            stripe,
            border,
            size='small',
            style="width: 100%"
          )
          el-table-column(prop="date", label="日期")
          el-table-column(label="操作", width='130')
      .pagination
        el-pagination(
          background,
          :page-size="100",
          layout="total, prev, pager, next, jumper",
          :total="1000")
</template>
<script>
export default {
  data () {
    return {
      menzhenSearchval: '',
      menzhenDate: [],
      menzhenTable: [],

      yuyueSearchval: '',
      yuyueDate: [],
      yuyueTable: [],
      yyl: 0, // 预约量
      qql: 0, // 取消量
      wyl: 0, // 违约量

      shoufeiSearchval: '',
      shoufeiDate: [],
      shoufeiTable: [],

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
      qudao: {
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
              {name: '现金支付', value: 5},
              {name: '支付宝支付', value: 2},
              {name: '微信支付', value: 1}
            ]
          }
        ]
      }
    }
  },
  computed: {
    yuyue () {
      return {
        tooltip: {
          trigger: 'item',
          // formatter: '{a}<br/>{b}: ¥{c} <br/>占比：{d}%'
          formatter: '{b}：{c} <br/>所占比例：{d}%'
        },
        series: [
          {
            name: '预约统计',
            type: 'pie',
            selectedMode: 'single',
            radius: ['40%', '65%'],
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            color: ['#51cd9d', '#feb257', '#f85e5f'],
            data: [
              {name: '已就诊', value: this.yyl},
              {name: '已取消', value: this.qql},
              {name: '失约', value: this.wyl}
            ]
          }
        ]
      }
    }
  },
  methods: {
    getMenzhenTable () {
      this.$api.reportlist({
        name: this.menzhenSearchval ? this.menzhenSearchval : null,
        startTime: this.$formatTime(this.menzhenDate[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.menzhenDate[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.menzhenTable = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getYuyueTable () {
      this.$api.reportyuyuelist({
        startTime: this.$formatTime(this.yuyueDate[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.yuyueDate[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.yuyueTable = res.result
          this.yyl = 0
          this.qql = 0
          this.wyl = 0
          for (let i = 0; i < res.result.length; i++) {
            this.yyl += res.result[i].diagnoseNum
            this.qql += res.result[i].cancelNum
            this.wyl += res.result[i].breachNum
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    menzhenDateChange () {
      if (!this.menzhenDate || !this.menzhenDate[0]) {
        this.$message.error('请选择日期范围！')
        return false
      }
      this.getMenzhenTable()
    },
    yuyueDateChange () {
      if (!this.yuyueDate || !this.yuyueDate[0]) {
        this.$message.error('请选择日期范围！')
        return false
      }
      this.getYuyueTable()
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
    this.menzhenDate = [start, end]
    this.yuyueDate = [start, end]
    this.shoufeiDate = [start, end]
    this.getMenzhenTable()
    this.getYuyueTable()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.echarts.chart
  min-width 300px
  height 300px
  display flex
  justify-content center
  align-items center
.mt
  margin-top 20px
.pagination
  margin-top 20px
  text-align center
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
          &.xjpay
            background #fcb965
          &.alipay
            background #5ec6f3
          &.wxpay
            background #9aeacb
          &.yqx
            background #feb257
          &.yjz
            background #51cd9d
          &.sy
            background #f85e5f
  .right
    flex 1
    display flex
    justify-content center
    align-items center
    .chart
      flex 1
</style>

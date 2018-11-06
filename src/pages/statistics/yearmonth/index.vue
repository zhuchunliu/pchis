<template lang="pug">
  .conchart
    .my-row
      .my-col-input
        el-select(placeholder="年度统计", v-model="select" size='small', @change='getWaterDayYear')
          el-option(value='1', label='年度统计')
          el-option(value='2', label='月度统计')
      .my-col-input(v-if="select == 1")
        el-select(placeholder="选择年份", v-model="year" size='small', @change='waterDayYear')
          el-option(:value='item', v-for="item, index in yearArr", :key='index')
      .my-col-input(v-if="select == 2")
        el-select(placeholder="选择月份", v-model="mouth" size='small', @change='waterDayMonth')
          el-option(:value='item', v-for="item, index in monthArr", :key='index')

    // .moneycard
      .right
        .top
          .title 收支概况
          .item
            .money ¥8000.0
            .line
            .info 总利润
          .item
            .money ¥52001.03
            .line
            .info 项目检查数量
          .item
            .money ¥6532.01
            .line
            .info 退款金额

    chart.chart(:options="chart")
    //- aliPayMoney (number, optional): 支付宝支付金额 ,
    //- aliPayNum (integer, optional): 支付宝支付次数 ,
    //- aliPayRefundMoney (number, optional): 支付宝退款金额 ,
    //- aliPayRefundNum (integer, optional): 支付宝退款次数 ,
    //- appendMoney (number, optional): 附加费支付金额 ,
    //- appendNum (integer, optional): 附加费支付次数 ,
    //- appendRefundMoney (number, optional): 附加费退款金额 ,
    //- appendRefundNum (integer, optional): 附加费退款次数 ,
    //- cash (number, optional): 现金支付金额 ,
    //- cashNum (integer, optional): 现金支付次数 ,
    //- cashRefundMoney (number, optional): 现金退款金额 ,
    //- cashRefundNum (integer, optional): 现金退款次数 ,
    //- date (string, optional): 报表日期 ,
    //- drugMoney (number, optional): 药支付金额 ,
    //- drugNum (integer, optional): 药支付次数 ,
    //- drugRefundMoney (number, optional): 药退款金额 ,
    //- drugRefundNum (integer, optional): 药退款次数 ,
    //- id (integer, optional): id ,
    //- orgCode (integer, optional): 机构编码 ,
    //- payMoney (number, optional): 总支付金额 ,
    //- payNum (integer, optional): 总支付次数 ,
    //- prescriptionMoney (number, optional): 检查金额 ,
    //- prescriptionNum (integer, optional): 检查次数 ,
    //- prescriptionRefundMoney (number, optional): 检查退款金额 ,
    //- prescriptionRefundNum (integer, optional): 检查退款次数 ,
    //- refundMoney (number, optional): 退款金额 ,
    //- refundNum (integer, optional): 退款次数 ,
    //- registeredMoney (number, optional): 挂号金额 ,
    //- registeredNum (integer, optional): 挂号次数 ,
    //- registeredRefundMoney (number, optional): 挂号退款金额 ,
    //- registeredRefundNum (integer, optional): 挂号退款次数 ,
    //- wxPayMoney (number, optional): 微信支付金额 ,
    //- wxPayNum (integer, optional): 微信支付次数 ,
    //- wxPayRefundMoney (number, optional): 微信退款金额 ,
    //- wxPayRefundNum (integer, optional): 微信退款次数
    el-table.table(
      :data="data",
      stripe,
      border,
      size='medium',
      style="width: 100%"
    )
      el-table-column(prop="date", label="日期", align='center')
      el-table-column(prop="payMoney", label="总支付金额", align='center')
      el-table-column(prop="refundMoney", label="退款金额", align='center')
      el-table-column(prop="drugMoney", label="药支付金额", align='center')
      el-table-column(prop="prescriptionMoney", label="检查金额", align='center')
      el-table-column(prop="appendMoney", label="附加费支付金额", align='center')
      el-table-column(prop="drugRefundMoney", label="药退款金额", align='center')
      el-table-column(prop="prescriptionRefundMoney", label="检查退款金额", align='center')
      el-table-column(prop="appendRefundMoney", label="附加费退款金额", align='center')
</template>

<script>
export default {
  data () {
    return {
      select: '2',
      year: '2018',
      mouth: '2018-01',
      yearArr: [],
      monthArr: [],
      data: [],
      x: [],
      y: []
    }
  },
  computed: {
    chart () {
      return {
        color: ['#ccd7d3'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.x,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        itemStyle: {
          // 鼠标悬停时：
          emphasis: {
            color: '#51cd9d'
          }
        },
        series: [
          {
            name: '金额',
            type: 'bar',
            barWidth: '60%',
            data: this.y
          }
        ]
      }
    }
  },
  methods: {
    toTwoStr (i) {
      if (i < 10) {
        return '0' + i
      } else {
        return i.toString()
      }
    },
    getYearMonthList (start = '2017-03-04 00:00:00') {
      let startYear = +start.slice(0, 7).split('-')[0]
      let startMonth = +start.slice(0, 7).split('-')[1]
      let now = new Date()
      let nowYear = now.getFullYear()
      let nowMonth = now.getMonth() + 1
      console.log(startYear, startMonth, nowYear, nowMonth)

      let yearArr = []
      let monthArr = []

      if (nowYear > startYear) {
        // console.log('不同年')
        for (let i = startYear; i <= nowYear; i++) {
          yearArr.push(i.toString())
          // 设置 月份
          if (i === startYear) {
            for (let n = startMonth; n <= 12; n++) {
              monthArr.push(i + '-' + this.toTwoStr(n))
            }
          } else if (i < nowYear) {
            for (let n = 1; n <= 12; n++) {
              monthArr.push(i + '-' + this.toTwoStr(n))
            }
          } else {
            for (let n = 1; n <= nowMonth; n++) {
              monthArr.push(i + '-' + this.toTwoStr(n))
            }
          }
        }
      } else {
        // console.log('同年')
        yearArr.push(nowYear.toString())
        for (let n = startMonth; n <= nowMonth; n++) {
          monthArr.push(nowYear + '-' + this.toTwoStr(n))
        }
        // if (nowMonth > startMonth) {
        //   // console.log('同年不同月')
        // } else {
        //   // console.log('同年同月')
        //   monthArr.push(nowYear + '-' + this.toTwoStr(nowMonth))
        // }
      }
      this.monthArr = monthArr
      this.yearArr = yearArr
      this.year = nowYear.toString()
      this.mouth = monthArr[monthArr.length - 1]
      // console.log(monthArr)
      // console.log(yearArr)
    },
    waterDayMonth () {
      this.$api.waterDayyearMonthBaobiao({
        month: this.mouth
      }).then(res => {
        if (res.success) {
          // console.log(res)
          this.x = []
          this.y = []
          for (let i = 0; i < res.result.length; i++) {
            res.result[i].date = res.result[i].date.slice(0, 10)
            this.x.push(res.result[i].date)
            this.y.push(+res.result[i].payMoney - +res.result[i].refundMoney)
          }
          this.data = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    waterDayYear () {
      this.$api.waterDayyearMonthBaobiao({
        year: this.year
      }).then(res => {
        if (res.success) {
          this.x = []
          this.y = []
          for (let i = 0; i < res.result.length; i++) {
            res.result[i].date = res.result[i].date.slice(0, 10)
            this.x.push(res.result[i].date)
            this.y.push(+res.result[i].payMoney - +res.result[i].refundMoney)
          }
          this.data = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getWaterDayYear (i) {
      console.log(i)
      if (i === '1') {
        this.waterDayYear()
      } else if (i === '2') {
        this.waterDayMonth()
      }
    },
    getFirstWaterDay () {
      this.$api.waterDayfirstWaterDay().then(res => {
        if (res.success) {
          // console.log(res)
          if (!res.result) {
            this.$message.error('暂无数据！')
          }
          this.getYearMonthList(res.result.date)
          this.waterDayMonth()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    // this.getYearMonthList()
    this.getFirstWaterDay()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.pagination,.table
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
        flex 0 0 120px
        display flex
        flex-flow column nowrap
        justify-content center
        align-items center
        .money
          color $White
          font-size 15px
        .line
          border-bottom 1px solid rgba(255, 255, 255, 0.6)
          width 30px
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
.chart
  margin-top 20px
  width 100%
</style>

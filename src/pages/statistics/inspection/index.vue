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
            .money ¥ {{fee}}
            .line
            .info 总利润
          .item
            .money ¥{{num}}
            .line
            .info 项目检查数量
          // .item
            .money ¥6532.01
            .line
            .info 退款金额

    chart.chart(:options="jiancha")
    chart.chart(:options="jianchaDayFee")

    el-table.table(
        :data="data",
        stripe,
        border,
        size='medium',
        style="width: 100%"
      )
      el-table-column(prop="date", label="检查时间", align='center')
      el-table-column(prop="fee", label="收费金额", align='center')
      el-table-column(prop="inspectName", label="检查项目", align='center')
      el-table-column(prop="num", label="检查次数", align='center')
    .pagination
      el-pagination(
        background,
        :page-size="pageSize",
        layout="total, prev, pager, next, jumper",
        :total="total",
        :current-page.sync="pageNum",
        @current-change='reportinspectdetail')
</template>

<script>
export default {
  data () {
    return {
      fee: 0,
      num: 0,
      searchval: '',
      select: '',
      totalFee: 0,
      date: [],
      dayFeeList: [],
      dayFeeListX: [],
      dayFeeListY: [],
      inspectListYnum: [],
      inspectList: [],
      inspectListX: [],
      inspectListY: [],
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
      data: [],
      pageSize: this.$store.state.userAgent ? 8 : 20,
      pageNum: 1,
      total: 0
    }
  },
  computed: {
    jiancha () {
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
            data: this.inspectListX,
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
            name: '收入',
            type: 'bar',
            barWidth: '30%',
            data: this.inspectListY
          },
          {
            name: '数量',
            type: 'bar',
            barWidth: '30%',
            data: this.inspectListYnum
          }
        ]
      }
    },
    jianchaDayFee () {
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
            data: this.dayFeeListX,
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
            name: '收入',
            type: 'bar',
            barWidth: '60%',
            data: this.dayFeeListY
          }
        ]
      }
    }
  },
  methods: {
    getjiancha () {
      this.$api.reportinspectlist({
        startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd'),
        num: 20
      }).then(res => {
        if (res.success) {
          this.dayFeeList = res.result.dayFeeList
          this.inspectList = res.result.inspectList
          this.inspectListX = []
          this.inspectListY = []
          this.inspectListYnum = []
          for (let i = 0; i < this.inspectList.length; i++) {
            this.inspectListX.push(this.inspectList[i].inspectName)
            this.inspectListY.push(+this.inspectList[i].fee)
            this.inspectListYnum.push(+this.inspectList[i].num)
          }
          this.dayFeeListX = []
          this.dayFeeListY = []
          for (let i = 0; i < this.dayFeeList.length; i++) {
            this.dayFeeListX.push(this.dayFeeList[i].date)
            this.dayFeeListY.push(+this.dayFeeList[i].fee)
          }
          this.totalFee = res.result.totalFee
          console.log(res)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    reportinspectdetail () {
      this.$api.reportinspectdetail({
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
        }
      }).then(res => {
        if (res.success) {
          this.data = res.result.data
          this.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    reportinspectsurvey () {
      this.$api.reportinspectsurvey({
        startTime: this.$formatTime(this.date[0], 'yyyy-MM-dd'),
        endTime: this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.fee = res.result.fee
          this.num = res.result.num
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
      this.reportinspectsurvey()
      this.getjiancha()
      this.reportinspectdetail()
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
    this.date = [start, end]
    this.reportinspectsurvey()
    this.getjiancha()
    this.reportinspectdetail()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.pagination
  margin-top 20px
  text-align center
.table
  margin-top 40px
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
        display flex
        flex-flow column nowrap
        justify-content center
        align-items center
        margin-right 10px
        .money
          color $White
          font-size 15px
          margin-bottom 7px
          padding-bottom 7px
          border-bottom 1px solid rgba(255, 255, 255, 0.6)
        // .line
        //   border-bottom 1px solid rgba(255, 255, 255, 0.6)
        //   width 30px
        //   height 0
        //   margin 7px
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

<template lang="pug">
  .pagecontent
    .top
      el-button(size='mini', type="info", plain, @click='prevWeek') 上一周
      span {{dates[0].date}} 至 {{dates[6].date}}
      el-button(size='mini', type="info", plain, @click='nextWeek') 下一周
    .content
      .my-row
        .my-col1
          el-select(placeholder="请选择科室", v-model="deptId" size='small', @change='getscheduleList')
            el-option(value='', label='全部科室')
            el-option(:value='item.id', :label='item.dept', v-for="item, index in $store.state.deptLists", :key='index')
        // .my-col1
          el-select(placeholder="请选择人员", v-model="doc" size='small', @change='changeDoc')
            el-option(value='0', label='全部医生')
        //- .my-col(v-show="dates[6].date.getTime() >= new Date().getTime()")
        .my-col
          el-button(size="small", @click='copyPrevWeek') 复制上周排班
      el-table(
        :data='scheduleLists',
        border, style="width: 100%",
        v-loading="loading").table

        el-table-column(label="头像", align='center', width='100')
          template(slot-scope="scope")
            .headimg
              img(:src='scope.row.avatar ? scope.row.avatar : (scope.row.gender == 1 ? women : men)')

        el-table-column(label="姓名", prop='userName', align='center')

        el-table-column(:label="item.date", align='center', v-for="item, index in dates", :key='index')
          el-table-column(:label="item.nowday ? item.week + '（今天）' : item.week", align='center')
            template(slot-scope="scope")
              // 设置排班
              el-select(placeholder="请选择", clearable, v-model="scope.row[item.key]", size='small', @change='scheduleSave(item.date, scope, scope.row[item.key])', :disabled='+$formatTime(item.date, "yyyyMMdd") < +$formatTime(new Date(), "yyyyMMdd") ')
                el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in $store.state.scheduleDicLists", :key='index')

</template>

<script>
import { getWeekDay } from '@/assets/js/utils'
const men = require('@/assets/img/men.png')
const women = require('@/assets/img/women.png')
export default {
  data () {
    return {
      men: men,
      women: women,
      dep: '0',
      doc: '0',
      date: '',
      dates: [
        {date: '2018/01/08', week: '周一', key: 'monday'},
        {date: '2018/01/08', week: '周二', key: 'tuesday'},
        {date: '2018/01/08', week: '周三', key: 'wednesday'},
        {date: '2018/01/08', week: '周四', key: 'thursday'},
        {date: '2018/01/08', week: '周五', key: 'friday'},
        {date: '2018/01/08', week: '周六', key: 'saturday'},
        {date: '2018/01/08', week: '周日', key: 'sunday'}
      ],
      isShowDay: true,
      deptId: '',
      scheduleLists: [],
      loading: true
    }
  },
  methods: {
    getPaiban (date) {
      let weekday = getWeekDay(date)
      // console.log(weekday)
      for (let i = 0; i < 7; i++) {
        // this.dates[i].date = weekday[i]
        this.dates[i].date = this.$formatTime(weekday[i], 'yyyy/MM/dd')
        if (this.dates[i].date === this.$formatTime(new Date(), 'yyyy/MM/dd')) {
          // console.log(this.$formatTime(weekday[i], 'yyyy/MM/dd'))
          this.dates[i].nowday = true
        } else {
          this.dates[i].nowday = false
        }
      }
      // this.$store.commit('getScheduleList', {time: this.$formatTime(date, 'yyyy-MM-dd'), deptId: +this.deptId ? +this.deptId : null})
      this.getscheduleList(date)
    },
    getscheduleList (date) {
      this.loading = true
      this.$api.scheduleList({
        deptId: this.deptId,
        time: this.$formatTime(date, 'yyyy-MM-dd')
      }).then(res => {
        if (res.success) {
          this.scheduleLists = []
          this.scheduleLists = res.result
          this.loading = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    prevWeek () {
      let date = this.date - 24 * 60 * 60 * 1000 * 7
      this.getPaiban(date)
      this.date = date
    },
    nextWeek () {
      let date = this.date + 24 * 60 * 60 * 1000 * 7
      this.getPaiban(date)
      this.date = date
    },
    // 给医生设置排班
    scheduleSave (date, scope, val) {
      console.log(date, scope.row, val)
      this.$api.scheduleSave({
        circle: 0,
        date: this.$formatTime(date, 'yyyy-MM-dd'),
        userid: scope.row.userid,
        type: val
      }).then(res => {
        if (res.success) {
          this.$message.success('设置成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 选择科室 筛选
    changeDep (val) {
      // console.log(val)
      this.deptId = val
      if (+val) {
        this.$store.commit('getScheduleList', {time: this.$formatTime(this.date, 'yyyy-MM-dd'), deptId: val})
      } else {
        this.$store.commit('getScheduleList', {time: this.$formatTime(this.date, 'yyyy-MM-dd')})
      }
    },
    // 选择人员 筛选
    changeDoc (val) {
      // console.log(val)
      if (+val) {
        this.$store.commit('getScheduleList', {time: this.$formatTime(this.date, 'yyyy-MM-dd'), userId: val})
      } else {
        this.$store.commit('getScheduleList', {time: this.$formatTime(this.date, 'yyyy-MM-dd')})
      }
    },
    // 复制上周排班
    copyPrevWeek () {
      if (new Date(this.dates[6].date).getTime() < new Date().getTime()) {
        this.$message.info('本周已全部排班，无法复制。')
        return false
      }
      this.$confirm('复制后不可恢复，是否继续?', '确定复制', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userIds = ''
        for (let i = 0; i < this.$store.state.scheduleLists.length; i++) {
          userIds += this.$store.state.scheduleLists[i].userid + ','
        }
        userIds = userIds.substr(0, userIds.length - 1)
        console.log(userIds)
        this.$api.scheduleCopy({
          deptId: +this.deptId ? +this.deptId : null,
          date: this.$formatTime(this.date, 'yyyy-MM-dd')
        }).then(res => {
          if (res.success) {
            this.$message.success('复制成功')
            this.getscheduleList(this.date)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消复制！'
        })
      })
    }
  },
  created () {
    this.$store.commit('getScheduleDicLists')
    this.$store.commit('getDeptLists')
    // 获取日历排班
    this.date = new Date().getTime()
    this.getPaiban(this.date)
  },
  beforeDestroy () {
    this.$store.commit('delScheduleDicLists')
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.top
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  span
    font-size 18px
    margin 0 20px
    color $lBlack
.content
  margin-top 20px
  min-height 300px
  padding 20px 15px
  background $White
.my-row
  display flex
  flex-flow row nowrap
  align-items center
  justify-content flex-start
  .my-col1
    flex 0 0 160px
    margin-right 15px
  .my-col
    flex 1
    text-align right
.table
  margin-top 20px
.headimg
  display inline-block
  width 50px
  height 50px
  border-radius 50%
  background $elSilver
  overflow hidden
  img
    width 100%
    height 100%
</style>

<template lang="pug">
  .pagecontent
    .content
      .my-row
        .my-col-input
          el-input(placeholder="患者拼音首字母", size='small', v-model="searchval", @keyup.enter.native='search')
            el-button(slot="append", icon="el-icon-search", @click='search')

        .my-col1
          el-select(placeholder="请选择科室", v-model="dep" size='small', @change='changeDep')
            el-option(value='0', label='全部科室')
            el-option(:value='item.id', :label='item.dept', v-for="item, index in $store.state.deptLists", :key='index')
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
        .my-col
          el-button(size="small", icon="el-icon-plus", @click='$router.push("/doctorvisits/addguahao")') 新开挂号
      el-row.table
        el-table(
            :data="ghList.data",
            stripe,
            size='medium',
            border,
            style="width: 100%"
          )
          el-table-column(prop="clinicNo", label="门诊编号", align='center')
          el-table-column(prop="deptName", label="就诊科室", align='center')
          el-table-column(prop="patientName", label="患者姓名", align='center')
          el-table-column(label="性别", align='center', width='60')
            template(slot-scope="scope")
              span(v-if="scope.row.gender == '0'") 男
              span(v-if="scope.row.gender == '1'") 女
          el-table-column(prop="age", label="年龄", align='center', width='80')
          el-table-column(prop="appointmentTime", label="预约时间", align='center')
          el-table-column(label="状态", align='center', width='80')
            template(slot-scope="scope") 未就诊
          el-table-column(label="挂号金额", prop='fee', align='center', width='80')
          el-table-column(label="操作", width='130', align='center')
            template(slot-scope="scope")
              el-button(type="success", @click="shoufeiClick(scope.row)", size='mini', v-if="scope.row.isPaid == 0") 收费
              // el-button(type="primary", @click="handleClick(scope.row)", size='mini', v-if="scope.row.isPaid == 1") 接诊
              el-button(type="danger", size='mini', @click='tuihao(scope.row)', v-if="scope.row.isPaid == 1") 退号
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            :current-page.sync="ghList.pageNum",
            layout="total, prev, pager, next, jumper",
            :total="ghList.total",
            @current-change='pageChange')
</template>

<script>
export default {
  data () {
    return {
      dep: '0',
      searchval: '',
      pageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      date: [],
      dateOption: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    ghList () {
      return this.$store.state.ghList
    }
  },
  methods: {
    handleClick (data) {
      console.log(data)
      this.$router.push({path: '/doctorvisits/treatment', query: {id: data.patientItemId, applyId: data.id}})
    },
    tuihao (data) {
      console.log(data)
      this.$confirm('退号不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.applycashrefund({
          applyId: data.id
        }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '退号成功!'
            })
            this.get()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退号！'
        })
      })
    },
    get () {
      let json = {
        pageNum: this.pageNum,
        dept: this.dep,
        pageSize: this.pageSize
      }
      if (this.date && this.date[0]) {
        json.startTime = this.$formatTime(this.date[0], 'yyyy-MM-dd')
        json.endTime = this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }
      this.$store.commit('getGuahaoList', json)
    },
    changeDep () {
      this.pageNum = 1
      this.get()
    },
    dateChange () {
      this.pageNum = 1
      this.get()
    },
    pageChange (val) {
      this.pageNum = val
      this.get()
    },
    shoufeiClick (data) {
      this.$confirm('挂号金额:' + data.fee + '元！确定收费吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.applycashcollection({
          applyId: data.id
        }).then(res => {
          if (res.success) {
            this.$message.success('收费成功！')
            this.get()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消收费!')
      })
      // console.log(data)
    },
    search () {
      this.pageNum = 1
      let json = {
        pageNum: this.pageNum,
        dept: this.dep,
        pageSize: this.pageSize,
        param: this.searchval.toUpperCase()
      }
      if (this.date && this.date[0]) {
        json.startTime = this.$formatTime(this.date[0], 'yyyy-MM-dd')
        json.endTime = this.$formatTime(this.date[1], 'yyyy-MM-dd')
      }
      this.$store.commit('getGuahaoList', json)
    }
  },
  created () {
    this.$store.commit('getDeptLists')
    this.date = [new Date(), new Date()]
    this.get()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.table
  margin-top 20px
.content
  min-height 300px
  padding 20px 15px
  background $White
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
</style>

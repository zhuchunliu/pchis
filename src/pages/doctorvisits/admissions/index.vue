<template lang="pug">
  .pagecontent
    el-tabs(type="border-card", v-model="activeName", @tab-click='changeTab')
      el-tab-pane(:label="'待就诊列表 (' + mzWjzList.total + ')'", name="1")
        el-row
          el-col(:span='2')
            el-button(type="primary", icon="el-icon-plus", size='small', @click='$router.push("/doctorvisits/addtreatment")') 新建就诊
          el-col(:span="5", :offset="1")
            .mytab
              .tab(:class='{"active":viewtype == 1}', @click="changeview(1)")
                .iconcard
                span 卡片式
              .tab(:class='{"active":viewtype == 2}', @click="changeview(2)")
                .icontable
                span 列表式
          el-col.date-col(:span='8', :offset="0.5")
            .label 选择日期:
            el-date-picker(
              v-model="wjzDate", size='small',
              type="daterange",
              align="right",
              unlink-panels,
              :editable= 'false',
              range-separator="至",
              start-placeholder="开始日期",
              end-placeholder="结束日期",
              :picker-options="dateOption",
              @change='wjzDateChange')
          el-col(:span="4", :offset="0.5")
            el-input(placeholder="请输入姓名", size='small', v-model="wjzSearchval", @keyup.enter.native='wjzSearch')
              el-button(slot="append", icon="el-icon-search", @click='wjzSearch')
        el-row(v-if="viewtype == 1")
          el-col.nodata(v-if="mzWjzList.total == 0") 暂无数据
          el-col(:xs="24", :sm="12", :md="8", :lg="6", :xl="4", v-for="item, i in mzWjzList.data", :key='i')
            .card(@click='handleClick(item)')
              .menzhen 门诊编号
              .number {{item.clinicNo}}
              .keshi {{item.deptName}}
              .line
              .headimg
                img(:src='item.avatar ? item.avatar : (item.gender == 0 ? men : women)')
              .info
                .name {{item.patientName}}
                .sex(:class='{"man": item.gender == 0, "women": item.gender == 1}')
                .age {{item.age}}岁
              .time
                .icon
                span 预约时间：{{item.appointmentTime}}
              .btns
                el-button(type="primary", size='mini', @click='handleClick(item)') 接诊
                // el-button(type="danger", size='mini', @click='tuihao(item)') 退号
        el-row(v-if="viewtype == 2")
          el-table(
              :data="mzWjzList.data",
              size='medium',
              stripe,
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
            el-table-column(label="操作", width='130', align='center')
              template(slot-scope="scope")
                el-button(type="primary", @click="handleClick(scope.row)", size='mini') 接诊
                // el-button(type="danger", size='mini', @click='tuihao(scope.row)') 退号
        el-pagination(
          background,
          :page-size="pageSize",
          :current-page.sync="mzWjzList.pageNum",
          layout="total, prev, pager, next, jumper",
          :total="mzWjzList.total",
          @current-change='wjzPageChange')

      el-tab-pane(:label="'就诊中列表 (' + mzJzzList.total + ')'", name="2")
        el-row
          el-col(:span="5")
            .mytab
              .tab(:class='{"active":viewtype == 1}', @click="changeview(1)")
                .iconcard
                span 卡片式
              .tab(:class='{"active":viewtype == 2}', @click="changeview(2)")
                .icontable
                span 列表式
          el-col.date-col(:span='8', :offset="1")
            .label 选择日期:
            el-date-picker(
              v-model="jzzDate", size='small',
              type="daterange",
              align="right",
              :editable= 'false',
              unlink-panels,
              range-separator="至",
              start-placeholder="开始日期",
              end-placeholder="结束日期",
              :picker-options="dateOption",
              @change='jzzDateChange')
          el-col(:span="4", :offset="0.5")
            el-input(placeholder="请输入姓名", size='small', v-model="jzzSearchval", @keyup.enter.native='jzzSearch')
              el-button(slot="append", icon="el-icon-search", @click='jzzSearch')
        el-row(v-if="viewtype == 1")
          el-col.nodata(v-if="mzJzzList.total == 0") 暂无数据
          el-col(:xs="24", :sm="12", :md="8", :lg="6", :xl="4", v-for="item, i in mzJzzList.data", :key='i')
            .card(@click='bianjiBl(item)')
              .menzhen 门诊编号
              .number {{item.clinicNo}}
              .keshi {{item.deptName}}
              .line
              .headimg
                img(:src='item.avatar ? item.avatar : (item.gender == 0 ? men : women)')
              .info
                .name {{item.patientName}}
                .sex(:class='{"man": item.gender == 0, "women": item.gender == 1}')
                .age {{item.age}}岁
              .time
                .icon
                span 预约时间：{{item.appointmentTime}}
              .btns
                el-button(type="primary", size='mini', @click='bianjiBl(item)') 查看编辑
                // el-button(type="danger", size='mini', @click='tuihao(item)') 退号
        el-row(v-if="viewtype == 2")
          el-table(
              :data="mzJzzList.data",
              size='medium',
              stripe,
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
              template(slot-scope="scope") 就诊中
            el-table-column(label="操作", width='130', align='center')
              template(slot-scope="scope")
                el-button(type="primary", @click="bianjiBl(scope.row)", size='mini') 查看编辑
                // el-button(type="danger", size='mini', @click='tuihao(scope.row)') 退号
        el-pagination(
          background,
          :page-size="pageSize",
          :current-page.sync="mzJzzList.pageNum",
          layout="total, prev, pager, next, jumper",
          :total="mzJzzList.total",
          @current-change='jzzPageChange')

      el-tab-pane(:label="'就诊完成列表 (' + mzYjzList.total + ')'", name="3")
        el-row
          el-col(:span="5")
            .mytab
              .tab(:class='{"active":viewtype == 1}', @click="changeview(1)")
                .iconcard
                span 卡片式
              .tab(:class='{"active":viewtype == 2}', @click="changeview(2)")
                .icontable
                span 列表式
          el-col.date-col(:span='8', :offset="1")
            .label 选择日期:
            el-date-picker(
              v-model="yjzDate",
              size='small',
              type="daterange",
              align="right",
              unlink-panels,
              :editable= 'false',
              range-separator="至",
              start-placeholder="开始日期",
              end-placeholder="结束日期",
              :picker-options="dateOption",
              @change='yjzDateChange')
          el-col(:span="4", :offset="0.5")
            el-input(placeholder="请输入姓名", size='small', v-model="yjzSearchval", @keyup.enter.native='yjzSearch')
              el-button(slot="append", icon="el-icon-search", @click='yjzSearch')
        el-row(v-if="viewtype == 1")
          el-col.nodata(v-if="mzYjzList.total == 0") 暂无数据
          el-col(:xs="24", :sm="12", :md="8", :lg="6", :xl="4", v-for="item, i in mzYjzList.data", :key='i')
            .card(@click='historyadmiss(item)')
              .menzhen 门诊编号
              .number {{item.clinicNo}}
              .keshi {{item.deptName}}
              .line
              .headimg
                img(:src='item.avatar ? item.avatar : (item.gender == 0 ? men : women)')
              .info
                .name {{item.patientName}}
                .sex(:class='{"man": item.gender == 0, "women": item.gender == 1}')
                .age {{item.age}}岁
              .time
                .icon
                span 预约时间：{{item.appointmentTime}}
              .zhuangtaiicon
                .yijiuzhen
                // .payicon(:class='{"ok": item.isPaid == 1,"error": item.isPaid == 0}')
              .btns
                el-button(type="primary", size='mini', @click='historyadmiss(item)') 查看
                // .payicon(:class='{"ok": item.isPaid == 1,"error": item.isPaid == 0}')
        el-row(v-if="viewtype == 2")
          el-table(
              :data="mzYjzList.data",
              size='medium',
              stripe,
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
            el-table-column(label="状态", width='140', align='center')
              template(slot-scope="scope")
                .zhuangtaiicon
                  .yijiuzhen
                  // .payicon(:class='{"ok": scope.row.isPaid == 1,"error": scope.row.isPaid == 0}')
            el-table-column(label="操作", width='130', align='center')
              template(slot-scope="scope")
                el-button(type="primary", @click="historyadmiss(scope.row)", size='mini') 查看
        el-pagination(
          background,
          :page-size="pageSize",
          :current-page.sync="mzYjzList.pageNum",
          layout="total, prev, pager, next, jumper",
          :total="mzYjzList.total",
          @current-change='yjzPageChange')
</template>

<script>
const men = require('@/assets/img/men.png')
const women = require('@/assets/img/women.png')
export default {
  data () {
    return {
      men: men,
      women: women,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      activeName: '1',
      // 1 卡片式  2 列表式
      viewtype: '1',

      wjzSearchval: '',
      wjzPageNum: 1,
      wjzDate: [],

      jzzSearchval: '',
      jzzPageNum: 1,
      jzzDate: [],

      yjzSearchval: '',
      yjzPageNum: 1,
      yjzDate: [],

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
    // 未就诊
    mzWjzList () {
      return this.$store.state.mzWjzList
    },
    mzJzzList () {
      return this.$store.state.mzJzzList
    },
    // 已就诊
    mzYjzList () {
      return this.$store.state.mzYjzList
    }
  },
  methods: {
    // 设置显示方式 列表和卡片
    changeview (i) {
      this.viewtype = i
      this.$setStore('viewType', {
        viewType: i
      })
    },
    setViewType () {
      this.viewtype = this.$getStore('viewType') ? this.$getStore('viewType').viewType : '1'
    },
    // 跳转到接诊
    handleClick (data) {
      console.log(data)
      this.$router.push({path: '/doctorvisits/treatment', query: {id: data.patientItemId, applyId: data.id, activeName: this.activeName, clinicNo: data.clinicNo, doctorName: data.doctorName}})
    },
    // 跳转到编辑病历
    bianjiBl (data) {
      console.log(data)
      this.$router.push({path: '/doctorvisits/treatment', query: {id: data.patientItemId, applyId: data.id, status: data.status, activeName: this.activeName, clinicNo: data.clinicNo, doctorName: data.doctorName}})
    },
    // 跳转到历史就诊数据
    historyadmiss (data) {
      this.$router.push({path: '/doctorvisits/historyadmiss', query: {id: data.id}})
    },
    // 退号
    tuihao (data) {
      this.$confirm('退号不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退号成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退号！'
        })
      })
    },
    getWjzList () {
      if (this.wjzDate && this.wjzDate[0]) {
        this.$store.commit('getWjzMenzhenList', {
          startTime: this.$formatTime(this.wjzDate[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.wjzDate[1], 'yyyy-MM-dd'),
          pageNum: this.wjzPageNum,
          pageSize: this.pageSize
        })
      } else {
        this.$store.commit('getWjzMenzhenList', {
          pageNum: this.wjzPageNum,
          pageSize: this.pageSize
        })
      }
    },
    getJzzList () {
      if (this.jzzDate && this.jzzDate[0]) {
        this.$store.commit('getJzzMenzhenList', {
          startTime: this.$formatTime(this.jzzDate[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.jzzDate[1], 'yyyy-MM-dd'),
          pageNum: this.jzzPageNum,
          pageSize: this.pageSize
        })
      } else {
        this.$store.commit('getJzzMenzhenList', {
          pageNum: this.jzzPageNum,
          pageSize: this.pageSize
        })
      }
    },
    getYjzList () {
      if (this.yjzDate && this.yjzDate[0]) {
        this.$store.commit('getYjzMenzhenList', {
          startTime: this.$formatTime(this.yjzDate[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.yjzDate[1], 'yyyy-MM-dd'),
          pageNum: this.yjzPageNum,
          pageSize: this.pageSize
        })
      } else {
        this.$store.commit('getYjzMenzhenList', {
          pageNum: this.yjzPageNum,
          pageSize: this.pageSize
        })
      }
    },
    // 切换选项卡
    changeTab (val) {
      if (+val.index === 0) {
        this.getWjzList()
      } else if (+val.index === 1) {
        this.getJzzList()
      } else {
        this.getYjzList()
      }
    },
    wjzDateChange () {
      this.wjzPageNum = 1
      this.getWjzList()
    },
    wjzPageChange (val) {
      this.wjzPageNum = val
      this.getWjzList()
    },

    jzzDateChange () {
      this.jzzPageNum = 1
      this.getJzzList()
    },
    jzzPageChange (val) {
      this.jzzPageNum = val
      this.getJzzList()
    },

    yjzDateChange () {
      this.yjzPageNum = 1
      this.getYjzList()
    },
    yjzPageChange (val) {
      this.yjzPageNum = val
      this.getYjzList()
    },
    // 搜索
    wjzSearch () {
      this.wjzPageNum = 1
      if (this.wjzDate && this.wjzDate[0]) {
        this.$store.commit('getWjzMenzhenList', {
          startTime: this.$formatTime(this.wjzDate[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.wjzDate[1], 'yyyy-MM-dd'),
          pageNum: this.wjzPageNum,
          pageSize: this.pageSize,
          param: this.wjzSearchval.toUpperCase()
        })
      } else {
        this.$store.commit('getWjzMenzhenList', {
          pageNum: this.wjzPageNum,
          pageSize: this.pageSize,
          param: this.wjzSearchval.toUpperCase()
        })
      }
    },
    jzzSearch () {
      this.jzzPageNum = 1
      if (this.jzzDate && this.jzzDate[0]) {
        this.$store.commit('getJzzMenzhenList', {
          startTime: this.$formatTime(this.jzzDate[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.jzzDate[1], 'yyyy-MM-dd'),
          pageNum: this.jzzPageNum,
          pageSize: this.pageSize,
          param: this.jzzSearchval.toUpperCase()
        })
      } else {
        this.$store.commit('getJzzMenzhenList', {
          pageNum: this.jzzPageNum,
          pageSize: this.pageSize,
          param: this.jzzSearchval.toUpperCase()
        })
      }
    },
    yjzSearch () {
      this.yjzPageNum = 1
      if (this.yjzDate && this.yjzDate[0]) {
        this.$store.commit('getYjzMenzhenList', {
          startTime: this.$formatTime(this.yjzDate[0], 'yyyy-MM-dd'),
          endTime: this.$formatTime(this.yjzDate[1], 'yyyy-MM-dd'),
          pageNum: this.yjzPageNum,
          pageSize: this.pageSize,
          param: this.yjzSearchval.toUpperCase()
        })
      } else {
        this.$store.commit('getYjzMenzhenList', {
          pageNum: this.yjzPageNum,
          pageSize: this.pageSize,
          param: this.yjzSearchval.toUpperCase()
        })
      }
    }
  },
  created () {
    this.activeName = this.$route.query.activeName ? this.$route.query.activeName : '1'
    this.wjzDate = [new Date(), new Date()]
    this.jzzDate = [new Date(), new Date()]
    this.yjzDate = [new Date(), new Date()]
    this.setViewType()
    this.getWjzList()
    this.getJzzList()
    this.getYjzList()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.el-pagination
  margin 25px 0
  text-align center
.zhuangtaiicon
  margin-top 5px
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  .yijiuzhen
    display inline-block
    width 58px
    height 20px
    line-height 0
    background url('./img/jiuzhenok.png') 0 0 no-repeat
    background-size 58px 20px
  .payicon
    display inline-block
    margin-left 10px
    width 50px
    height 20px
    line-height 0
    &.ok
      background url('./img/payok.png') 0 0 no-repeat
      background-size 50px 20px
    &.error
      background url('./img/payerror.png') 0 0 no-repeat
      background-size 50px 20px
.addnew
  display flex
  flex-flow row nowrap
  justify-content flex-end
  align-items center
.mytab
  display flex
  flex-flow row nowrap
  justify-content center
  align-items center
  border 1px solid $elSilver
  border-radius 4px
  .tab
    display flex
    flex-flow row nowrap
    justify-content center
    align-items center
    flex 1
    padding-right 10px
    &:not(:first-child)
      border-left 1px solid $elSilver
    &.active
      background $elSilver
      .iconcard
        background url('./img/kp-active.png') 0 0 no-repeat
        background-size 30px 30px
      .icontable
        background url('./img/lb-active.png') 0 0 no-repeat
        background-size 30px 30px
    .iconcard, .icontable
      width 30px
      height 30px
      display inline-block
    .iconcard
      background url('./img/kp.png') 0 0 no-repeat
      background-size 30px 30px
    .icontable
      background url('./img/lb.png') 0 0 no-repeat
      background-size 30px 30px
.el-row
  margin-bottom 20px
  &:last-child
    margin-bottom 0
.el-col
  padding 5px
.card
  border 1px solid $elSilver
  min-height 100px
  border-radius 4px
  padding 20px 10px
  display flex
  justify-content center
  align-items center
  flex-flow column nowrap
  box-sizing border-box
  cursor pointer
  .menzhen
    font-size 12px
    color $Silver
  .number
    margin-top 15px
    font-size 22px
    font-weight bold
  .keshi
    margin-top 13px
    font-size 14px
  .line
    height 0
    width 100%
    margin-top 16px
    border-bottom 1px dashed $elSilver
  .headimg
    margin-top 20px
    width 60px
    height 60px
    border-radius 50%
    background #eee
    overflow hidden
    img
      width 100%
      height 100%
  .info
    display flex
    align-items center
    margin-top 5px
    .name
      font-size 14px
    .sex
      width 30px
      height 30px
      margin 0 5px
      &.women
        background url('./img/sex_women.png') 0 0 no-repeat
        background-size 30px 30px
      &.man
        background url('./img/sex_man.png') 0 0 no-repeat
        background-size 30px 30px
    .age
      font-size 14px
      color $Silver
  .time
    display flex
    align-items center
    .icon
      width 30px
      height 30px
      background url('./img/time.png') 0 0 no-repeat
      background-size 30px 30px
    span
      font-size .16rem
      color #B1B1B1
  .btns
    margin-top 8px
.date-col
  display flex
  flex-direction row
  align-items center
  .label
    width 80px
.nodata
  text-align center
</style>

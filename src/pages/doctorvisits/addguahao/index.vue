<template lang="pug">
  .pagecontent
    .topnavinfo
      .left 当前科室：
        span {{$store.state.userInfo.deptName}}
      .right
        el-button(type="primary", size='mini', @click='guahao') 挂号
        //- el-button(type="success", size='mini', @click='shoufei') 收费
        el-button(type="warning", size='mini', @click='$router.go(-1)') 取消
    
    el-row.con
      el-col.left
        el-form(label-width="80px", label-position="left", :model="patientinfo")
          el-form-item(label="姓名:", required)
            el-input(size='medium', placeholder='填写姓名', v-model="patientinfo.patientName")
          el-form-item
            el-button.datepk(type="primary", size='medium', @click='showRightOld') 历史患者
          el-form-item(label="手机号:", required)
            el-input(size='medium', placeholder='填写手机号', v-model="patientinfo.mobile", type="number")
          el-form-item(label="身份证:")
            el-input(size='medium', placeholder='填写身份证', v-model="patientinfo.idCard", @blur="getGenderDateOfBirth")
          el-form-item(label="性别:", required)
            el-select.datepk(size='medium', placeholder='选择性别', v-model="patientinfo.gender")
              el-option(label='男', value="0")
              el-option(label='女', value="1")
          el-form-item(label="出生日期:")
            el-date-picker.datepk(
              size='medium',
              align="right",
              type="date",
              :editable= 'false',
              v-model="patientinfo.dateOfBirth",
              placeholder="选择出生日期",
              :picker-options="pickerOptionsone")
            i.itext *身份证和出生日期必填一项
          el-form-item(label="社保号:")
            el-input(size='medium', placeholder='可暂不填写', v-model="patientinfo.socialCard")
        el-form(label-position="top")
          el-form-item(label="住址:")
            el-col(:span='24')
              el-input(type="textarea", placeholder='请输入详细地址', v-model="patientinfo.address")
          
          el-form-item(label="过敏史:")
            el-col(:span='24')
              el-input(type="textarea", placeholder='请输入过敏史', v-model="patientinfo.anaphylaxis")

      el-col.right
        .my-row
          .my-col1
            el-select(size='small', placeholder='选择科室', v-model="dep", @change='scheduleapply')
              el-option(value='0', label='全部科室')
              el-option(:value='item.id', :label='item.dept', v-for="item, index in $store.state.deptLists", :key='index')
          .my-col1
            el-date-picker(
              size='small',
              type="date",
              :editable= 'false',
              v-model="patientinfo.time",
              placeholder='请选择预约时间',
              align="right",
              :picker-options="pickerOptions",
              @change='scheduleapply')
          .my-col-r(v-show="applyFee") 挂号费用：
            span ¥{{applyFee}}
        //- el-table.table(
        //-   :data="tableData",
        //-   size='medium',
        //-   stripe,
        //-   border,
        //-   style="width: 100%"
        //- )
        //-   el-table-column(label=" ", align='center', width='70')
        //-     template(slot-scope="scope")
        //-       el-radio(v-model="doctorId", :label="scope.row.userid + scope.row.week") {{space}}
        //-   el-table-column(prop="userName", label="医生姓名", align='center')
        //-   el-table-column(prop="date", label="预约时间", align='center')
        //-   el-table-column(prop="week", label="星期", align='center')
        //-   el-table-column(prop="schedule", label="班次信息", align='center')
        //-   el-table-column(prop="dutyName", label="医生职称", align='center')
        //-   el-table-column(prop="deptName", label="科室", align='center')
        //-   el-table-column(label="挂号数", align='center')
        //-     template(slot-scope="scope")
        //-       span {{scope.row.occupyNum}}/{{scope.row.applyNum}}
        //-   //- el-table-column(prop="expertin", label="擅长", align='center')
        //-   el-table-column(prop="applyFee", label="挂号费", align='center')
        el-tabs.table(type="card", v-model="activeName", @tab-click="handleClick")
          el-tab-pane(v-for="item, index in tableData", :key="index", :label="item.week + '(' +item.date + ')'", :name="'i1' + index")
            el-row
              el-col(:xs="24", :sm="12", :md="8", :lg="6", :xl="4", v-for="_item, i in item.detailList", :key="i")
                .card(@click="submitguahao(_item, 'i1'+index+i)", :class="[activeCard == 'i1'+index+i ? 'active' : '']")
                  .headimg
                    img(:src="_item.avatar ? _item.avatar : (_item.gender == 1 ? women : men)")
                  .info
                    .name {{_item.schedule}}
                  .info
                    .name {{_item.userName}}
                    .dutyName {{_item.dutyName}}
                  .info  
                    .sex(:class="[_item.gender == 1 ? 'women' : 'man']")
                    //- .age 40岁
                    .age {{_item.deptName}}
                  .info
                    .age {{_item.occupyNum}}/{{_item.applyNum}}
                    .age ￥{{_item.applyFee ? _item.applyFee : '0'}}
        
        // 右侧栏显示 历史看诊
        rightAside(ref='rightAsideOldVisit')
          .asideTab
            .asideCon
              .acon
                .search
                  el-input(placeholder="请输入内容", size='small', v-model="patientVal")
                    el-button(slot="append", icon="el-icon-search", @click='getPatientssearch')
                .asidetable
                  el-table(
                    stripe,
                    :data='patientTableData',
                    :height="rightTableHeight",
                    size='medium',
                    style="width: 100%"
                  )
                    el-table-column(label="患者姓名", prop='patientName', align='center')
                    el-table-column(label="手机", prop='mobile', align='center')
                    el-table-column(label="性别", width='50', align='center')
                      template(slot-scope="scope")
                        span(v-if="scope.row.gender == '0'") 男
                        span(v-if="scope.row.gender == '1'") 女
                    // el-table-column(label="年龄", prop='age', width='100', align='center')
                    el-table-column(label="操作", align='center', width='100')
                      template(slot-scope="scope")
                        el-button(type="primary", size='mini', @click='usePatient(scope.row)') 使用
                .asidepagination
                  el-pagination(
                    small,
                    layout="prev, pager, next",
                    :page-size="patientpageSize",
                    :current-page.sync="patientpageNum",
                    :total="patientTotal",
                    @current-change='getPatientsPage')
</template>

<script>
import rightPrescription from './../right_prescription'
import rightAside from '@/components/rightAside'
import { formatTime, regExp } from '@/assets/js/utils'
const men = require('@/assets/img/men.png')
const women = require('@/assets/img/women.png')
export default {
  components: {
    rightPrescription,
    rightAside
  },
  data () {
    return {
      men: men,
      women: women,
      patientinfo: {
        patientCardId: '', // 就诊人id 和患者基础信息选填一个 优先就诊人id
        dateOfBirth: '',
        patientName: '',
        gender: '',
        idCard: '',
        socialCard: '',
        mobile: '',
        address: '',
        anaphylaxis: '',

        time: '',
        appointmentTime: '',
        doctorId: ''
      },
      doctorId: '',
      dep: '',
      tableData: [],

      patientTableData: [],
      patientpageSize: this.$store.state.userAgent ? 8 : 20,
      patientpageNum: 1,
      patientTotal: 0,
      patientVal: '',

      applyFee: '',
      pickerOptionsone: {
        disabledDate: time => {
          let tomorrow = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          let starttime = time.getTime() > tomorrow
          return starttime
        }
      },
      pickerOptions: {
        disabledDate: time => {
          let tomorrow = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          let starttime = time.getTime() < tomorrow
          return starttime
        }
      },
      guahaoswitch: true,
      space: '',
      activeName: 'i10',
      ttt: 'i10',
      activeCard: ''
    }
  },
  // watch: {
  //   doctorId (val) {
  //     this.patientinfo.doctorId = val.split('周')[0]
  //     let _week = '周' + val.split('周')[1]
  //     for (let i = 0; i < this.tableData.length; i++) {
  //       if (+this.tableData[i].userid === +this.patientinfo.doctorId) {
  //         this.applyFee = this.tableData[i].applyFee
  //       }
  //       if (_week === this.tableData[i].week) {
  //         this.patientinfo.appointmentTime = this.tableData[i].appointmentTime
  //       }
  //     }
  //   }
  // },
  computed: {
    rightTableHeight () {
      return document.body.clientHeight - 132 - 46
    }
  },
  methods: {
    handleClick (tab, event) {
      this.ttt = tab.name
    },
    usePatient (data) {
      console.log(data)
      this.patientinfo.patientName = data.patientName
      this.patientinfo.gender = data.gender
      this.patientinfo.dateOfBirth = data.dateOfBirth
      this.patientinfo.idCard = data.idCard
      this.patientinfo.socialCard = data.socialCard
      this.patientinfo.mobile = data.mobile
      this.patientinfo.address = data.address
      this.patientinfo.anaphylaxis = data.anaphylaxis
      this.patientinfo.patientItemId = data.id
      this.$refs.rightAsideOldVisit.hide()
    },
    getPatientsPage (val) {
      this.patientpageNum = val
      this.getPatients()
    },
    getPatientssearch () {
      this.patientpageNum = 1
      this.getPatients()
    },
    // num 0 白名单 1 黑名单
    getPatients () {
      this.$api.patientGetPatientPoolByPage({
        pageSize: this.patientpageSize,
        pageNum: this.patientpageNum,
        param: {
          blackFlag: 0,
          vague: this.patientVal
        }
      }).then(res => {
        if (res.success) {
          this.patientTableData = res.result.data
          this.patientTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    guahao () {
      if (!this.patientinfo.dateOfBirth && !this.patientinfo.idCard) {
        this.$message.error('身份证和出生日期需填其中一个！')
        return false
      }
      if (this.patientinfo.idCard && regExp.idCard(this.patientinfo.idCard)) {
        this.$message.error('请填写有效的身份证号')
        return false
      }
      if (!regExp.trim(this.patientinfo.mobile) || regExp.mobile(this.patientinfo.mobile)) {
        this.$message.error('手机号格式不正确！')
        return false
      }
      if (this.patientinfo.dateOfBirth) {
        this.patientinfo.dateOfBirth = formatTime(this.patientinfo.dateOfBirth, 'yyyy-MM-dd')
      }
      this.applyaddByDoctor(next => {
        console.log(next)
        this.$message.success('挂号成功！')
        this.$router.go(-1)
      })
    },
    shoufei () {
      this.applyaddByDoctor(next => {
        console.log(next)
        this.$confirm('挂号成功，确定收费吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.applycashcollection({
            applyId: next
          }).then(res => {
            if (res.success) {
              this.$message.success('收费成功！')
              this.$router.go(-1)
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消收费!')
          this.$router.go(-1)
        })
      })
    },
    applyaddByDoctor (next) {
      if (this.patientinfo.mobile && regExp.mobile(this.patientinfo.mobile)) {
        this.$message.error('手机号格式不正确！')
        return false
      }
      console.log(this.patientinfo)
      if (!this.patientinfo.patientName || this.patientinfo.patientName == ' ') {
        this.$message.error('姓名格式不正确！')
        return false
      }
      if (!this.patientinfo.gender) {
        this.$message.error('请选择性别！')
        return false
      }
      if (this.patientinfo.idCard && regExp.idCard(this.patientinfo.idCard)) {
        this.$message.error('请填写有效的身份证号')
        return false
      }
      if (this.patientinfo.time) {
        this.patientinfo.appointmentTime = this.$formatTime(this.patientinfo.time, 'yyyy-MM-dd hh:mm:ss')
      }

      if (!this.patientinfo.doctorId) {
        this.$message.error('请选择医生！')
        return false
      }
      this.tableData.map(item => {
        if (this.patientinfo.doctorId == item.userid) {
          if (item.occupyNum == item.applyNum) {
            this.$confirm('此医生的挂号数已满,是否继续挂号?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.guahaoswitch = false
              this.$api.applyaddByDoctor(this.patientinfo).then(res => {
                if (res.success) {
                  if (next && typeof next === 'function') {
                    next(res.result)
                  }
                } else {
                  this.$message.error(res.msg)
                }
              })
            })
          }
        }
      })
      if (this.guahaoswitch) {
        this.$api.applyaddByDoctor(this.patientinfo).then(res => {
          if (res.success) {
            if (next && typeof next === 'function') {
              next(res.result)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    showRightOld () {
      this.$refs.rightAsideOldVisit.show()
      this.getPatients()
    },
    scheduleapply () {
      this.$api.scheduleapply({
        deptId: this.dep === '0' ? null : this.dep,
        date: this.patientinfo.time ? this.$formatTime(this.patientinfo.time, 'yyyy-MM-dd') : null
      }).then(res => {
        if (res.success) {
          // console.log(res)
          // this.tableData = []
          // for (let i = 0; i < res.result.length; i++) {
          //   // console.log(res.result[i])
          //   for (let j = 0; j < res.result[i].detailList.length; j++) {
          //     res.result[i].detailList[j].date = res.result[i].date
          //     res.result[i].detailList[j].week = res.result[i].week
          //     // this.patientinfo.doctorId = ''
          //     // console.log(res.result[i].detailList[j])
          //     this.tableData.push(JSON.parse(JSON.stringify(res.result[i].detailList[j])))
          //   }
          // }
          this.tableData = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getGenderDateOfBirth (e) {
      if (e.target.value && !regExp.idCard(e.target.value)) {
        let genderNum = Number(e.target.value.slice(16, 17)) % 2
        let year = e.target.value.slice(6, 10)
        let month = e.target.value.slice(10, 12)
        let date = e.target.value.slice(12, 14)
        this.patientinfo.dateOfBirth = year + '-' + month + '-' + date
        this.patientinfo.gender = genderNum ? '0' : '1'
      } else if (e.target.value && regExp.idCard(e.target.value)) {
        this.$message.error('请填写有效的身份证')
      }
    },
    submitguahao (item, key) {
      this.activeCard = key
      this.applyFee = item.applyFee
      this.patientinfo.doctorId = item.userid
      this.patientinfo.appointmentTime = item.appointmentTime
    }
  },
  created () {
    // this.patientinfo.time = new Date()
    this.$store.commit('getDeptLists')
    this.scheduleapply()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
i.people
  display inline-block
  width 30px
  height 30px
  position relative
  cursor pointer
  top 5px
  background url('./img/p.png') 0 0 no-repeat
  background-size 30px 30px
.table
  margin-top 30px
.my-row
  display flex
  flex-flow row nowrap
  align-items center
  .my-col1
    flex 0 0 200px
    margin-right 10px
  .my-col-r
    flex 1
    text-align right 
    span
      color $Danger
.topnavinfo
  display flex
  flex-flow row no-warp
  justify-content space-between
  align-items center
  padding 0 0 15px 0
  .left
    font-size 14px
    color $lBlack
    span
      color $Black
.asideTab
  width 100%
  height 100vh
  .top
    height 50px
    display flex
    flex-flow row nowarp
    justify-content center
    align-items center
    .title
      flex 1
      text-align center
      background $elSilver
      height 50px
      line-height 50px
      color $elBlack
      font-size 14px
      &.active
        background $Blue
        color $White
  .asideCon
    height calc(100vh - 10px)
    padding 5px 0
    .search
      padding 20px 50px
    .asidetable
      height calc(100vh - 150px)
      padding 0 10px
  .asidepagination
    text-align center
    padding 10px 0
  .asideBtns
    height 50px
    text-align center
.mt
  margin-top 10px
  position relative
.el-tag
  cursor pointer
  margin-right 15px
.el-tab-pane
  padding 15px 0
.btninput
  width 100px
  margin-right 15px
.abbutton
  position absolute
  right 10px
  top 6px
  z-index 9
.con
  display flex
  flex-flow row nowarp
  .left
    background $dWhite
    border-right 1px solid $elSilver
    padding 5px
    min-height 630px
    width 240px
  .right
    background $White
    padding 15px
    min-height 630px
    min-width calc(100vw - 460px)
.el-form-item
  margin-bottom 10px
.datepk
  width 100% !important
.itext
  font-size 12px
  font-weight normal
  color red
.card
  border 1px solid $elSilver
  min-height 100px
  border-radius 4px
  padding 18px 8px
  display flex
  justify-content center
  align-items center
  flex-flow column nowrap
  box-sizing border-box
  margin 0 7px 8px 0
  cursor pointer
  &:hover, &.active
    border 1px solid $Blue
  .headimg
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
    margin-top 15px
    .name
      font-size 14px
      margin-right 5px
    .dutyName
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
      margin-right 5px
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
.el-tab-pane
  padding 0
</style>

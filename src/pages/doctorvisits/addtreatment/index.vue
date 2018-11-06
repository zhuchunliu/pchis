<template lang="pug">
  .pagecontent
    .topnavinfo
      .left 当前科室：
        span {{$store.state.userInfo.deptName}}
      .right 
        el-button(type="info", size='small', @click='backgo') 返回
        // el-button(type="primary", size='small', @click='showRightOld') 历史
        // el-button(type="success", size='small', @click='$refs.rightPrescription.postPre(0)') 保存
        el-button(type="primary", size='small', @click='$refs.rightPrescription.postPre(1)') 结束诊断
    
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
              :picker-options="pickerOptionsone",
              @blur="getdateOfBirthage")
            i.itext *身份证和出生日期必填一项
          el-form-item(label="社保号:")
            el-input(size='medium', placeholder='可暂不填写', v-model="patientinfo.socialCard")
        el-form(label-position="top")
          el-form-item(label="住址:")
            //- el-col(:span='12')
            //-   el-select(size='medium', placeholder='省', v-model="patientinfo.sex")
            //-     el-option(label='北京', value="1")
            //- el-col(:span='11', :offset="1")
            //-   el-select(size='medium', placeholder='市', v-model="patientinfo.sex")
            //-     el-option(label='北京', value="1")
            //- el-col(:span='24')
            //-   el-select(size='medium', placeholder='区', v-model="patientinfo.sex")
            //-     el-option(label='北京', value="1")
            el-col(:span='24')
              el-input(type="textarea", placeholder='请输入详细地址', v-model="patientinfo.address")
          
          el-form-item(label="过敏史：")
            el-col(:span='24')
              el-input(type="textarea", placeholder='请输入过敏史', v-model="patientinfo.anaphylaxis")


      el-col.right
        rightPrescription(:patientinfo='patientinfo', :applyId='null', :prescriptionNo="prescriptionNo", :clinicNo="clinicNo", :ChiefComplaintlist='ChiefComplaintlist', :diagnosislist="diagnosislist", ref='rightPrescription')
        // 右侧栏显示 历史看诊
            
        rightAside(ref='rightAsideOldVisit')
          .asideTab
            .asideCon
              .acon
                .search
                  el-input(placeholder="请输入内容", size='small', v-model="patientVal", @keyup.enter.native='getPatientssearch')
                    el-button(slot="append", icon="el-icon-search", @click='getPatientssearch')
                .asidetable
                  el-table(
                    stripe,
                    :data='patientTableData',
                    size='medium',
                    :height="rightTableHeight",
                    style="width: 100%"
                  )
                    el-table-column(label="患者姓名", prop='patientName', align='center')
                    el-table-column(label="手机", prop='mobile', align='center')
                    el-table-column(label="性别", width='50', align='center')
                      template(slot-scope="scope")
                        span(v-if="scope.row.gender == '0'") 男
                        span(v-if="scope.row.gender == '1'") 女
                    // el-table-column(label="年龄", prop='age', width='100', align='center')
                    el-table-column(label="操作", align='center', width='60')
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
import { regExp } from '@/assets/js/utils'
export default {
  components: {
    rightPrescription,
    rightAside
  },
  data () {
    return {
      patientTableData: [],
      patientpageSize: this.$store.state.userAgent ? 8 : 20,
      patientpageNum: 1,
      patientTotal: 0,
      patientVal: '',

      patientinfo: {
        patientName: '',
        gender: '',
        idCard: '',
        socialCard: '',
        mobile: '',
        address: '',
        anaphylaxis: '',
        patientItemId: '',
        dateOfBirth: '',
        age: ''
      },
      pickerOptionsone: {
        disabledDate: time => {
          let tomorrow = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          let starttime = time.getTime() > tomorrow
          return starttime
        }
      },
      ChiefComplaintlist: [],
      diagnosislist: [],
      clinicNo: '',
      prescriptionNo: ''
    }
  },
  computed: {
    rightTableHeight () {
      return document.body.clientHeight - 132 - 46
    }
  },
  methods: {
    usePatient (data) {
      this.patientinfo.patientName = data.patientName
      this.patientinfo.gender = data.gender
      this.patientinfo.dateOfBirth = data.dateOfBirth
      this.patientinfo.idCard = data.idCard
      this.patientinfo.socialCard = data.socialCard
      this.patientinfo.mobile = data.mobile
      this.patientinfo.address = data.address
      this.patientinfo.anaphylaxis = data.anaphylaxis
      this.patientinfo.patientItemId = data.id

      let age = ''
      let yearBirth = ''
      let monthBirth = ''
      let dateBirth = ''
      let date = new Date()
      let yearToday = date.getFullYear()
      let monthToday = date.getMonth() + 1
      let dateToday = date.getDate()

      if (this.patientinfo.idCard) {
        yearBirth = this.patientinfo.idCard.slice(6, 10)
        monthBirth = this.patientinfo.idCard.slice(10, 12)
        dateBirth = this.patientinfo.idCard.slice(12, 14)
      } else if (!this.patientinfo.idCard && this.patientinfo.dateOfBirth) {
        yearBirth = this.patientinfo.dateOfBirth.slice(0, 4)
        monthBirth = this.patientinfo.dateOfBirth.slice(5, 7)
        dateBirth = this.patientinfo.dateOfBirth.slice(8)
      }
      let yearDiff = Number(yearToday) - Number(yearBirth)
      let monthDiff = Number(monthToday) - Number(monthBirth)
      let dateDiff = Number(dateToday) - Number(dateBirth)
      if (monthDiff < 0) {
        age = yearDiff - 1
      } else {
        if (dateDiff < 0) {
          age = yearDiff - 1
        } else {
          age = yearDiff
        }
      }
      this.patientinfo.age = age
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
    showRightOld () {
      this.$refs.rightAsideOldVisit.show()
      this.getPatients()
    },
    getGenderDateOfBirth (e) {
      if (e.target.value && !regExp.idCard(e.target.value)) {
        let genderNum = Number(e.target.value.slice(16, 17)) % 2
        let year = e.target.value.slice(6, 10)
        let month = e.target.value.slice(10, 12)
        let date = e.target.value.slice(12, 14)
        this.patientinfo.dateOfBirth = year + '-' + month + '-' + date
        this.patientinfo.gender = genderNum ? '0' : '1'

        let age = ''
        let datenew = new Date()
        let yearToday = datenew.getFullYear()
        let monthToday = datenew.getMonth() + 1
        let dateToday = datenew.getDate()
        let yearDiff = Number(yearToday) - Number(year)
        let monthDiff = Number(monthToday) - Number(month)
        let dateDiff = Number(dateToday) - Number(date)
        if (monthDiff < 0) {
          age = yearDiff - 1
        } else {
          if (dateDiff < 0) {
            age = yearDiff - 1
          } else {
            age = yearDiff
          }
        }
        this.patientinfo.age = age
        console.log(this.patientinfo)
      } else if (e.target.value && regExp.idCard(e.target.value)) {
        this.$message.error('请填写有效的身份证')
      }
    },
    getdateOfBirthage () {
      if (!this.patientinfo.idCard) {
        let age = ''
        let date = new Date()
        let yearToday = date.getFullYear()
        let monthToday = date.getMonth() + 1
        let dateToday = date.getDate()

        let yearBirth = new Date(this.patientinfo.dateOfBirth).getFullYear()
        let monthBirth = new Date(this.patientinfo.dateOfBirth).getMonth() + 1
        let dateBirth = new Date(this.patientinfo.dateOfBirth).getDate()

        let yearDiff = Number(yearToday) - Number(yearBirth)
        let monthDiff = Number(monthToday) - Number(monthBirth)
        let dateDiff = Number(dateToday) - Number(dateBirth)
        if (monthDiff < 0) {
          age = yearDiff - 1
        } else {
          if (dateDiff < 0) {
            age = yearDiff - 1
          } else {
            age = yearDiff
          }
        }
        this.patientinfo.age = age
      }
    },
    getTplChiefComplaintAll () {
      this.$api.getTplChiefComplaintAll()
        .then(res => {
          if (res.success) {
            this.ChiefComplaintlist = res.result
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    getTplDiagnosisAll () {
      this.$api.getTplDiagnosisAll()
        .then(res => {
          if (res.success) {
            this.diagnosislist = res.result
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    pregetNo () {
      this.$api.pregetNo({
        type: 0
      }).then(res => {
        if (res.success) {
          this.clinicNo = res.result.clinicNo
          this.prescriptionNo = res.result.prescriptionNo
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    backgo () {
      this.$confirm('您确定退出该页面？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      })
    }
  },
  created () {
    this.getPatients()
    this.getTplChiefComplaintAll()
    this.getTplDiagnosisAll()
    this.pregetNo()
  }
}
</script>

<style lang="stylus">
.tpdr.el-textarea
  textarea
    padding-right 60px
</style>

<style lang="stylus" scoped>
i.people
  display inline-block
  width 30px
  height 30px
  position relative
  cursor pointer
  top 5px
  background url('./img/p.png') 0 0 no-repeat
  background-size 30px 30px
@import './../../../assets/css/var.styl'
.topnavinfo
  display flex
  flex-flow row no-warp
  justify-content space-between
  align-items center
  padding 0 0 15px 0
  .left
    font-size 18px
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
    height calc(100vh - 100px)
    padding 5px 0
    .search
      padding 20px 50px
    .asidetable
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
.itext
  font-size 12px
  font-weight normal
  color red
.datepk
  width 100% !important
</style>

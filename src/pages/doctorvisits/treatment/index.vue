<template lang="pug">
  .pagecontent
    .topnavinfo
      .left 当前科室：
        span {{$store.state.userInfo.deptName}}
      .right
        // el-button(type="primary", size='mini', @click='showRightOld') 历史
        // el-button(type="success", size='small', @click='$refs.rightPrescription.postPre(0)') 保存
        el-button(type="info", size='small', @click='backgo') 返回
        el-button(type="primary", size='small', @click='$refs.rightPrescription.postPre(1)') 结束诊断
        // el-button(type="warning", size='mini', @click='$refs.rightPrescription.postPre(2)') 收费
    
    el-row.con
      el-col.left
        .peopleinfo
          .headimg
            img(v-if="patientinfo.avatar", :src='patientinfo.avatar')
            img(v-if="!patientinfo.avatar&&patientinfo.gender == 0", :src='men')
            img(v-if="!patientinfo.avatar&&patientinfo.gender == 1", :src='women')
          .name {{patientinfo.patientName}}
          .btns
            el-button(size='small', @click='showbl') 历史病历
            el-button(size='small', @click='wanshan') 完善信息
          .lists
            // .item
              .l 门诊编号：
              .r {{patientinfo.clinicNo}}
            .item
              .l 性别：
              .r {{patientinfo.gender == 0 ? "男": "女"}}
            .item
              .l 年龄：
              .r {{patientinfo.age}}
            .item
              .l 身份证：
              .r {{patientinfo.idCard}}
            .item
              .l 出生日期：
              .r {{patientinfo.dateOfBirth}}
            .item
              .l 社保号：
              .r {{patientinfo.socialCard}}
            .item
              .l 手机号：
              .r {{patientinfo.mobile}}
            .item
              .l 住址：
              .r {{patientinfo.address}}
            .item
              .l 过敏史：
              .r {{patientinfo.anaphylaxis}}
      el-col.right
        rightPrescription(:patientinfo='patientinfo', :clinicNo="clinicNo", :doctorName="doctorName", :ChiefComplaintlist='ChiefComplaintlist', :diagnosislist="diagnosislist", :status='$route.query.status ? $route.query.status : null', :applyId='$route.query.applyId ? $route.query.applyId : null', :activeName='$route.query.activeName', ref='rightPrescription')
      // 右侧栏显示 历史看诊
      rightAside(ref='rightAsideOldVisit')
        .asideTab
          .asideCon
            .acon
              .search
                el-input(placeholder="请输入内容", size='small', v-model="patientVal", @keyup.enter.native='getPatients')
                  el-button(slot="append", icon="el-icon-search", @click='getPatients')
              .asidetable
                el-table(
                  stripe,
                  :data='patientTableData',
                  size='medium',
                  height="500",
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


    // 查看历史病历
    el-dialog(
      :visible.sync="blDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 历史病历
      el-collapse(v-model="activeNames", accordion, @change='getPreDrug')
        el-collapse-item(:title="item.deptName ? item.deptName + ' (' + item.createAt + ')' : (item.createAt)", :name="index", v-for="item, index in bldata", :key='index')
          div 
            i 发病日期：
            | {{item.onSetDate ? item.onSetDate.slice(0, 10) : ''}}
            span(v-if="item.isFirst == 1") 初诊 
            span(v-if="item.isFirst == 0") 复诊 
          div 
            i 主诉：
            | {{item.chiefComplaint}}
          div 
            i 诊断信息：
            span(v-for="tag, i in item.diagnosisTags", :key="i", v-if="i==0") {{tag}}
            span(v-else) , {{tag}}
          div
            i 处方:
            el-table(
              :data="historyStencillist",
              size='medium',
              stripe,
              border,
              :span-method="arraySpanMethod"
              style="width: 100%"
            )
              el-table-column(prop="drugName", label="药品名称")
              el-table-column(prop="manufacturerName", label="生产厂商")
              el-table-column(label="单次剂量")
                template(slot-scope="scope")
                  span {{scope.row.singleDose}}{{scope.row.doseUnitName}}
              el-table-column(prop='frequencyName', label="频率")
              el-table-column(prop="numName", label="药品总量")
</template>

<script>
import rightPrescription from './../right_prescription'
import rightAside from '@/components/rightAside'
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
      activeNames: [],
      bldata: [],

      patientTableData: [],
      patientpageSize: this.$store.state.userAgent ? 8 : 20,
      patientpageNum: 1,
      patientTotal: 0,
      patientVal: '',

      patientinfo: {},
      activetab: 'one',
      asideTab: 1,
      blDialogVisible: false,

      historyStencillist: [],

      clinicNo: '',
      doctorName: '',
      ChiefComplaintlist: [],
      diagnosislist: [],
      prescriptionNo: ''
    }
  },
  methods: {
    showRightOld () {
      this.$refs.rightAsideOldVisit.show()
      this.getPatients()
    },
    wanshan () {
      this.$setStore('patientEditInfo', this.patientinfo)
      this.$router.push({path: '/doctorvisits/editpatient'})
    },
    showbl () {
      this.blDialogVisible = true
      this.medicalRecordpatientId()
    },
    getParentInfo () {
      this.$api.applyId({
        id: this.$route.query.id
      }).then(res => {
        if (res.success) {
          this.patientinfo = res.result
          this.parentIdParentInfo(res.result.patientId)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    parentIdParentInfo (id) {
      this.$api.patientId({
        id: id
      }).then(res => {
        if (res.success) {
          this.patientinfo = res.result
          console.log(res.result)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // num 0 白名单 1 黑名单
    getPatientsPage (val) {
      this.patientpageSize = val
      this.getPatients()
    },
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
    medicalRecordpatientId () {
      this.$api.medicalRecordpatientId({
        patientItemId: this.$route.query.id
      }).then(res => {
        if (res.success) {
          this.bldata = res.result
          this.bldata.map(item => {
            item.diagnosisTags = []
            if (item.diagnosis && !item.diagnosis.includes('&&|&&')) {
              item.diagnosisTags[0] = item.diagnosis
            }
            if (item.diagnosis && item.diagnosis.includes('&&|&&')) {
              item.diagnosisTags = item.diagnosis.split('&&|&&')
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getPreDrug (val) {
      if (val !== '') {
        this.historyStencillist = []
        let applyId = this.bldata[val].applyId
        this.$api.getPreDrug({
          applyId: applyId
        }).then(res => {
          if (res.success) {
            let lists = res.result
            if (lists) {
              lists.map(item => {
                item.itemChildList.map(_item => {
                  this.historyStencillist.push(_item)
                })
              })
              this.historyStencillist.push({drugName: '以下空白'})
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == this.historyStencillist.length - 1) {
        return [1, 5]
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
    this.clinicNo = this.$route.query.clinicNo
    this.doctorName = this.$route.query.doctorName
    this.parentIdParentInfo(this.$route.query.id)
    this.getTplChiefComplaintAll()
    this.getTplDiagnosisAll()
  }
}
</script>

<style lang="stylus">
.tpdr.el-textarea
  textarea
    padding-right 60px
</style>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.el-collapse-item
  i
    color $elBlack
.peopleinfo
  display flex 
  flex-flow column nowrap
  justify-content center
  align-items center
  .headimg
    width 60px
    height 60px
    background $Silver
    line-height 0
    border-radius 50%
    overflow hidden
    img
      width 100%
      height 100%
  .name
    font-size 18px
    padding 20px 0
  .lists
    width 100%
    margin-top 25px
    .item
      display flex
      flex-flow row nowrap
      justify-content space-between
      line-height 34px
      font-size 13px
      color $elBlack
      .r
        text-align right 
        color $Black
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
</style>

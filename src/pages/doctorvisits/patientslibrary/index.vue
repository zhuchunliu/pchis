<template lang="pug">
  .pagecontent
    .content
      .my-row
        .my-col-input
          el-input(placeholder="手机/姓名/身份证/生日", size='small', v-model="searchval", @keyup.enter.native='getsearchPatients(0)')
            el-button(slot="append", icon="el-icon-search", @click='getsearchPatients(0)')

        .my-col
          el-button(size="small", @click='centerDialogVisible = true') 已移除({{total2}}人)
          // el-button(size="small", type='primary') 导出
      el-row.table
        el-table(:data="tableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(label="患者姓名", prop='patientName', width='120', align='center')
          el-table-column(label="性别", width='80', align='center')
            template(slot-scope="scope")
              span(v-if="scope.row.gender == '0'") 男
              span(v-if="scope.row.gender == '1'") 女
          el-table-column(label="年龄", prop='age', width='100', align='center')
          el-table-column(label="身份证", prop='idCard', align='center')
          el-table-column(label="手机号", prop='mobile', align='center')
          el-table-column(label="紧急联系人", prop='emergencyContact', align='center')
          el-table-column(label="紧急联系人手机", prop='emergencyMobile', align='center')
          el-table-column(label="操作", width='180', align='center')
            template(slot-scope="scope")
              el-button(type="success", @click="medicalRecordpatientId(scope.row.id)", size='mini') 病历
              el-button(type="primary", @click="editPatient(scope.row)", size='mini') 编辑
              el-button(type="danger", size='mini', @click='remove(scope.row)') 移除

      .pagination
        el-pagination(
          background,
          :page-size="pageSize",
          layout="total, prev, pager, next, jumper",
          :current-page.sync="pageNum",
          :total="total",
          @current-change='pageChange')

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 已移除列表
      .daorubody
        el-table.table(
          stripe,
          border,
          size='medium',
          :data='tableData2',
          style="width: 100%"
        )
          el-table-column(label="患者姓名", prop='patientName', align='center')
          el-table-column(label="性别", width='80', align='center')
            template(slot-scope="scope")
              span(v-if="scope.row.gender == '0'") 男
              span(v-if="scope.row.gender == '1'") 女
          el-table-column(label="年龄", prop='age', width='100', align='center')
          el-table-column(label="操作", align='center', width='100')
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click='rmBlack(scope.row)') 恢复
              
        .pagination
          el-pagination(
            background,
            :page-size="pageSize2",
            layout="total, prev, pager, next, jumper",
            :total="total2",
            :current-page.sync="pageNum2",
            @current-change='getPagePatients')

    // 查看历史病历
    el-dialog(
      :visible.sync="blDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 历史病历
      el-collapse(v-model="activeNames", accordion, @change='getPreDrug')
        el-collapse-item(:title="item.deptName + ' (' + item.createAt + ')'", :name="index", v-for="item, index in bldata", :key='index')
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
import { formatTime } from '@/assets/js/utils'
export default {
  data () {
    return {
      searchval: '',
      date: '',
      pageSize: this.$store.state.userAgent ? 8 : 20,
      pageNum: 1,
      total: 0,
      tableData: [],

      centerDialogVisible: false,

      blDialogVisible: false,
      bldata: [],
      activeNames: [],

      pageSize2: this.$store.state.userAgent ? 8 : 20,
      pageNum2: 1,
      total2: 0,
      tableData2: [],
      historyStencillist: []
    }
  },
  filters: {
    datefilters (val) {
      if (val) {
        return formatTime(val, 'yyyy-MM-dd HH:mm')
      } else {
        return ''
      }
    }
  },
  methods: {
    medicalRecordpatientId (id) {
      this.activeNames = []
      this.blDialogVisible = true
      this.$api.medicalRecordpatientId({
        patientItemId: id
      }).then(res => {
        if (res.success) {
          console.log(res)
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
    getsearchPatients (val) {
      this.pageNum = 1
      this.getPatients(val)
    },
    editPatient (data) {
      // console.log(data)
      this.$setStore('patientEditInfo', data)
      this.$router.push({path: '/doctorvisits/editpatient'})
    },
    remove (data) {
      this.$confirm('确定移除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.patientItemaddPatientBlacklist({
          id: data.id
        }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            this.getPatients(0)
            this.getPatients(1)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除！'
        })
      })
    },
    rmBlack (data) {
      this.$api.patientItemremovedPatientBlacklist({
        id: data.id
      }).then(res => {
        if (res.success) {
          this.$message.success('恢复成功！')
          this.getPatients(0)
          this.getPatients(1)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getPagePatients (val) {
      this.pageNum2 = val
      this.getPatients(1)
    },
    // num 0 白名单 1 黑名单
    getPatients (num) {
      this.$api.patientGetPatientPoolByPage({
        pageSize: num === 0 ? this.pageSize : this.pageSize2,
        pageNum: num === 0 ? this.pageNum : this.pageNum2,
        param: {
          blackFlag: num,
          vague: num === 0 && this.searchval ? this.searchval : null
        }
      }).then(res => {
        if (res.success) {
          if (num === 0) {
            this.tableData = res.result.data
            this.total = res.result.total
          } else if (num === 1) {
            this.tableData2 = res.result.data
            this.total2 = res.result.total
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    pageChange (val) {
      this.pageNum = val
      this.getPatients(0)
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
    }
  },
  created () {
    this.getPatients(0)
    this.getPatients(1)
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.el-collapse-item
  i
    color $elBlack
.table
  margin-top 20px
.pagination
  margin-top 20px
  text-align center
.content
  min-height 300px
  padding 20px 15px
  background $White
.my-row
  display flex
  flex-flow row nowrap
  align-items center
  justify-content flex-start
  .my-col-input
    flex 0 0 260px
    margin-right 15px
  .my-col
    flex 1
    text-align right
</style>

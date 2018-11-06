<template lang="pug">
  .pagecontent
    .con 
      el-row.top
        el-col(:span="5")
          el-input(placeholder="请输入盘点单号", size='small', v-model="searchval", @keyup.enter.native='inventoryauditlistSearch')
            el-button(slot="append", icon="el-icon-search", @click='inventoryauditlistSearch')
        el-col(:span="4")
          el-select(placeholder="审核状态", v-model="select", size='small', @change='inventoryauditlist')
            el-option(:value='-1', label='全部审核状态')
            el-option(:value='0', label='未提交')
            el-option(:value='1', label='待审核')
            el-option(:value='2', label='已审核')
            el-option(:value='3', label='已驳回')
        el-col(:span='6')
          el-date-picker(v-model="date", size='small',
            type="daterange",
            align="right",
            unlink-panels,
            :editable= 'false',
            range-separator="至",
            start-placeholder="开始日期",
            end-placeholder="结束日期",
            :picker-options="dateOption",
            @change='inventoryauditlist')
      
      el-table.table(
        stripe,
        border,
        :data='tableData',
        size='medium',
        style="width: 100%"
      )
        // el-table-column(type="selection", width="55")
        el-table-column(prop="inventoryNo", label="盘点单号")
        el-table-column(label="盘点日期")
          template(slot-scope="scope")
            span {{scope.row.date | datefilters}}
        el-table-column(prop="userName", label="盘点人")
        el-table-column(label="审核状态")
          template(slot-scope="scope")
            span(v-if="scope.row.status == 0") 未提交
            span(v-if="scope.row.status == 1") 待审核
            span(v-if="scope.row.status == 2") 已审核
            span(v-if="scope.row.status == 3") 已驳回
        el-table-column(label="操作", align='center')
          template(slot-scope="scope")
            el-button(type='primary', v-if="scope.row.status == 0 || scope.row.status == 3", size='mini', @click='editstorage(scope.row)') 编辑
            el-button(type='success', size='mini', @click='showInfo(scope.row)') 详情
            el-button(type='primary', v-if="scope.row.status == 1 && hasPermission", size='mini', @click='ruku(scope.row)') 审核成功
            el-button(type="danger", v-if="scope.row.status == 1 && hasPermission", size='mini', @click='inventoryreject(scope.row.id)') 驳回
            el-button(type="danger", v-if="scope.row.status == 0", size='mini', @click='inventorydel(scope.row.id)') 删除
      
      .pagination
        el-pagination(
          background,
          layout="total, prev, pager, next, jumper",
          :page-size="pageSize",
          :current-page.sync="pageNum",
          :total="totalNum",
          @current-change='inventoryauditlistPage')

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 盘点详情(
        span(v-if="dataInfostatus == 0") 未提交)
        span(v-if="dataInfostatus == 1") 待审核)
        span(v-if="dataInfostatus == 2") 已审核)
        span(v-if="dataInfostatus == 3") 已驳回)
      .fayaobody
        .topinfo
          span 盘点日期：{{dataInfodate}}
        el-table.table(
          stripe,
          border,
          :data='dataInfo',
          size='medium',
          style="width: 100%"
        )
          el-table-column(type="expand", width="30")
            template(slot-scope="scope")
              el-table(
                stripe,
                border,
                :data='scope.row.detailList',
                size='medium',
                style="width: 100%",
                :show-header='false'
              )
                el-table-column(width="30")
                el-table-column
                el-table-column
                el-table-column
                el-table-column(prop="batchNumber", align='center')
                el-table-column(align='center')
                  template(slot-scope="scoped")
                    span {{scoped.row.expiryDate | datefilters}}
                el-table-column(align='center')
                  template(slot-scope="scoped")
                    span {{scoped.row.actualNum ? scoped.row.actualNum : ''}}{{scoped.row.actualNum ? scope.row.unitName : ''}}{{scoped.row.actualMinNum ? scoped.row.actualMinNum : ''}}{{scoped.row.actualMinNum ? scope.row.minUnitName : ''}}{{scoped.row.actualDoseNum ? scoped.row.actualDoseNum : ''}}{{scoped.row.actualDoseNum ? scope.row.doseUnitName : ''}}
                el-table-column(align='center')
                  template(slot-scope="scoped")
                    span {{scoped.row.num ? scoped.row.num : ''}}{{scoped.row.num ? scope.row.unitName : ''}}{{scoped.row.minNum ? scoped.row.minNum : ''}}{{scoped.row.minNum ? scope.row.minUnitName : ''}}{{scoped.row.doseNum ? scoped.row.doseNum : ''}}{{scoped.row.doseNum ? scope.row.doseUnitName : ''}}

          el-table-column(prop="goodsName", label="药品名称", align='center')
          el-table-column(prop="manufacturerName", label="生产商", align='center')
          el-table-column(prop="spec", label="规格", align='center')
          el-table-column(label="药品批次", align='center')
          el-table-column(label="有效期", align='center')
          el-table-column(prop="numMax", label="账面数量", align='center')
            template(slot-scope="scope")
              span {{scope.row.num ? scope.row.num : ''}}{{scope.row.num ? scope.row.unitName : ''}}{{scope.row.minNum ? scope.row.minNum : ''}}{{scope.row.minNum ? scope.row.minUnitName : ''}}{{scope.row.doseNum ? scope.row.doseNum : ''}}{{scope.row.doseNum ? scope.row.doseUnitName : ''}}
          el-table-column(label="实际数量", align='center')
</template>
<script>
import { formatTime } from '@/assets/js/utils'
export default {
  data () {
    return {
      centerDialogVisible: false,
      select: '',
      date: '',
      hasPermission: '',
      tableData: [],
      pageSize: this.$store.state.userAgent ? 8 : 20,
      pageNum: 1,
      totalNum: 0,
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
      },
      searchval: '',

      dataInfo: [],
      dataInfostatus: '',
      dataInfodate: ''
    }
  },
  filters: {
    datefilters (val) {
      if (val) {
        return formatTime(val, 'yyyy-MM-dd')
      } else {
        return ''
      }
    }
  },
  computed: {
    drugType () {
      return this.$store.state.drugType
    }
  },
  methods: {
    inventorypermission () {
      this.$api.inventorypermission()
        .then(res => {
          if (res.success) {
            this.hasPermission = res.result.hasPermission
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    inventoryauditlistSearch () {
      this.pageNum = 1
      this.inventoryauditlist()
    },
    inventoryauditlistPage (val) {
      this.pageNum = val
      this.inventoryauditlist()
    },
    inventoryauditlist () {
      this.$api.inventoryauditlist({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          inventoryNo: this.searchval ? this.searchval : null, // 库存单号
          status: this.select >= 0 ? this.select : null, // 0:未审核,1:已审核
          startTime: this.date && this.date[0] ? this.$formatTime(this.date[0], 'yyyy-MM-dd') : null,
          endTime: this.date && this.date[1] ? this.$formatTime(this.date[1], 'yyyy-MM-dd') : null
        }
      }).then(res => {
        if (res.success) {
          this.tableData = res.result.data
          this.totalNum = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    editstorage (row) {
      console.log(row)
      this.$confirm('确定编辑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({path: '/druginventory/stockcheck', query: {id: row.id, inventoryNo: row.inventoryNo, date: row.date}})
      })
    },
    showInfo (row) {
      this.$api.inventorydetail({
        id: row.id
      }).then(res => {
        if (res.success) {
          this.dataInfo = res.result
          this.centerDialogVisible = true
          this.dataInfostatus = row.status
          this.dataInfodate = formatTime(row.date, 'yyyy-MM-dd')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    inventorydel (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.inventorydel({
          id: id
        }).then(res => {
          if (res.success) {
            this.$message.success('已删除')
            this.inventoryauditlist()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    ruku (row) {
      this.$api.inventoryaudit({
        id: row.id
      }).then(res => {
        if (res.success) {
          this.$message.success('入库成功！')
          this.inventoryauditlist()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    inventoryreject (id) {
      this.$confirm('确定驳回吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.inventoryreject({
          id: id
        }).then(res => {
          if (res.success) {
            this.$message.success('驳回成功')
            this.inventoryauditlist()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  },
  created () {
    this.inventorypermission()
    this.inventoryauditlist()
    this.$store.commit('getDrugType')
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.fayaobody
  position relative
  .topinfo
    span
      display inline-block
      width 50%
  .bigbtn
    text-align center
    padding 6px 0
    margin-top 20px
    background $Blue
    width 100%
    border-radius 4px
    color $White
    transition all .2s ease
    cursor pointer
    &:hover
      background lighten($Blue, 20%)

.el-row.top
  .el-col
    margin-right 15px
.rightcol
  text-align right
  height 32px
  display flex
  align-items center
  justify-content flex-end
  span
    margin-right 20px
    color $Danger
.con
  padding 20px 15px
  background $White

.table
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
    flex 0 0 260px
    margin-right 15px
  .my-col-select
    flex 0 0 200px
    margin-right 15px
  .my-col
    flex 1
    text-align right
.daorubody
  .bigbtn
    text-align center
    padding 6px 0
    margin-top 20px
    background $Blue
    width 100%
    border-radius 4px
    color $White
    transition all .2s ease
    cursor pointer
    &:hover
      background lighten($Blue, 20%)
</style>
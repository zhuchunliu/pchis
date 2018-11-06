<template lang="pug">
  .pagecontent
    .con 
      el-row.top
        el-col(:span="5")
          el-input(placeholder="请输入采购单号", size='small', v-model="searchval", @keyup.enter.native='purchaseauditlistSearch')
            el-button(slot="append", icon="el-icon-search", @click='purchaseauditlistSearch')
        el-col(:span="4")
          el-select(placeholder="审核状态", v-model="select", size='small', @change='purchaseauditlist')
            el-option(:value='-1', label='全部审核状态')
            el-option(:value='0', label='未提交')
            el-option(:value='1', label='待审核')
            el-option(:value='2', label='已审核')
            el-option(:value='3', label='已驳回')
        // el-col(:span="4")
          el-select(placeholder="供应商选择", v-model="select", size='small')
            el-option(value='1', label='全部供应商')
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
            @change='purchaseauditlist')
      
      el-table.table(
        stripe,
        border,
        :data='tableData',
        size='medium',
        style="width: 100%"
      )
        //- auditDate (string, optional): 审核日期 ,
        //- auditUserName (string, optional): 审核人 ,
        //- bidFee (number, optional): 采购总额 ,
        //- date (string, optional): 采购日期 ,
        //- id (string, optional): id ,
        //- purchaseNo (string, optional): 采购编号 ,
        //- status (integer, optional): 审核标记；0未审核：1，已审核 ,
        //- supplierName (string, optional): 供应商 ,
        //- userName (string, optional): 采购人
        // el-table-column(type="selection", width="55")
        el-table-column(prop="purchaseNo", label="采购编号")
        el-table-column(label="采购日期", align='center')
          template(slot-scope="scope")
            span {{scope.row.date | datefilters}}
        el-table-column(prop="bidFee", label="采购总额", align='center')
        el-table-column(prop="supplierName", label="供应商")
        el-table-column(label="审核状态", align='center')
          template(slot-scope="scope")
            span(v-if="scope.row.status == 0") 未提交
            span(v-if="scope.row.status == 1") 待审核
            span(v-if="scope.row.status == 2") 已审核
            span(v-if="scope.row.status == 3") 已驳回
        el-table-column(prop="userName", label="采购人", align='center')
        //- el-table-column(prop="auditUserName", label="审核人")
        el-table-column(label="操作", width='180')
          template(slot-scope="scope")
            el-button(type='primary', v-if="scope.row.status == 0", size='mini', @click='editstorage(scope.row)') 编辑
            el-button(type='success', size='mini', @click='showInfo(scope.row)') 详情
            el-button(v-if="scope.row.status == 1 && hasPermission", size='mini', @click='ruku(scope.row)') 入库
            el-button(type="danger", v-if="scope.row.status == 1 && hasPermission", size='mini', @click='purchasereject(scope.row.id)') 驳回
            el-button(type="danger", v-if="scope.row.status == 0", size='mini', @click='purchasedel(scope.row.id)') 删除

      .pagination
        el-pagination(
          background,
          :page-size="pageSize",
          layout="total, prev, pager, next, jumper",
          :total="totalNum",
          :current-page.sync="pageNum",
          @current-change='purchaseauditlistPage')

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 入库详情(
        span(v-if="dataInfo.status == 0") 未提交)
        span(v-if="dataInfo.status == 1") 待审核)
        span(v-if="dataInfo.status == 2") 已审核)
        span(v-if="dataInfo.status == 3") 已驳回)
      .fayaobody
        .topinfo
          span 供应商名称：{{dataInfo.supplierName}}
          span 制单日期：{{dataInfo.date | datefilters}}
          span 采购批发总额：{{dataInfo.bidFee}}
          span 采购处方总额：{{dataInfo.retailFee}}
        el-table.table(
          stripe,
          border,
          :data='dataInfo.detailList',
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="goodsName", label="药品名称")
          el-table-column(prop="manufacturerName", label="厂商名称")
          //el-table-column(prop="category", label="药品分类")
            template(slot-scope="scope")
              span(v-for="item, index in drugType", :key="index", v-if="scope.row.category == item.dicItemCode") {{item.dicItemName}}
          el-table-column(label="入库数量")
            template(slot-scope="scope")
              span {{scope.row.num}}{{scope.row.unitName}}
          el-table-column(prop="bid", label="采购价")
          el-table-column(prop="bidFee", label="采购总额")
          el-table-column(prop="retailPrice", label="零售价")
          el-table-column(prop="spec", label="药品规格")
        //- .bigbtn(@click='centerDialogVisible = false') 确定
</template>
<script>
import { formatTime } from '@/assets/js/utils'
export default {
  data () {
    return {
      centerDialogVisible: false,
      select: '',
      date: '',
      tableData: [],
      totalNum: 0,
      pageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
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
      hasPermission: '',

      dataInfo: {
        date: '',
        bidFee: 0,
        retailFee: 0,
        purchaseNo: '',
        status: 0,
        detailList: [],
        supplierName: ''
      }
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
    purchaseauditlistSearch () {
      this.pageNum = 1
      this.purchaseauditlist()
    },
    purchaseauditlistPage (val) {
      this.pageNum = val
      this.purchaseauditlist()
    },
    purchaseauditlist () {
      this.$api.purchaseauditlist({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          purchaseNo: this.searchval ? this.searchval : null, // 采购单号
          status: this.select >= 0 ? this.select : null, // 0:未审核,1:已审核
          supplierId: null, // 供应商
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
    purchasepermission () {
      this.$api.purchasepermission()
        .then(res => {
          if (res.success) {
            this.hasPermission = res.result.hasPermission
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    purchasereject (id) {
      this.$confirm('确定驳回吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.purchasereject({
          id: id
        }).then(res => {
          if (res.success) {
            this.$message.success('驳回成功')
            this.purchaseauditlist()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    editstorage (row) {
      this.$confirm('确定编辑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({path: '/druginventory/purchase', query: {id: row.id}})
      })
    },
    showInfo (row) {
      console.log(row)
      this.$api.purchasedetail({
        id: row.id
      }).then(res => {
        if (res.success) {
          this.centerDialogVisible = true
          this.dataInfo.date = res.result.date
          this.dataInfo.bidFee = res.result.bidFee
          this.dataInfo.retailFee = res.result.retailFee
          this.dataInfo.purchaseNo = res.result.purchaseNo
          this.dataInfo.status = res.result.status
          this.dataInfo.detailList = res.result.detailList
          this.dataInfo.supplierName = res.result.supplierName
          console.log(res)
        } else {
          this.$message.error(res.msg)
        }
      })
      console.log(row)
    },
    ruku (row) {
      console.log(row)
      this.$api.purchaseaudit({
        id: row.id
      }).then(res => {
        if (res.success) {
          this.$message.success('入库成功！')
          this.purchaseauditlist()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    purchasedel (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.purchasedel({
          id: id
        }).then(res => {
          if (res.success) {
            this.$message.success('已删除')
            this.purchaseauditlist()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  },
  created () {
    this.purchaseauditlist()
    this.purchasepermission()
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
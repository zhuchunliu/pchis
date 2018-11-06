<template lang="pug">
  .pagecontent
    el-tabs(type="border-card", @tab-click="handleClick")
      el-tab-pane(label='药品总库存')
        el-row.top
          el-col(:span="5")
            el-input(placeholder="请输入内容", size='small', v-model="stockParam", @keyup.enter.native='drugstockSearch')
              el-button(slot="append", icon="el-icon-search", @click='drugstockSearch')
          // el-col.right(:span="19")
            el-button(size='small', @click='setyujing') 预警设置
        el-table.table(
          stripe,
          border,
          :data='stockTable',
          size='medium',
          style="width: 100%"
        )
          //- bid (number, optional): 批发价 ,
          //- bidFee (number, optional): 批发额 ,
          //- drugCode (string, optional): 药品编码 ,
          //- goodsName (string, optional): 商品名称 ,
          //- id (integer, optional): 药品id ,
          //- manufacturerName (string, optional): 生产厂家 ,
          //- name (string, optional): 名称 ,
          //- num (number, optional): 库存数量 ,
          //- retailFee (number, optional): 处方额 ,
          //- retailPrice (number, optional): 处方价 ,
          //- spec (string, optional): 药品规格 ,
          //- unit (string, optional): 计价单位
          el-table-column(prop="goodsName", label="名称")
          el-table-column(prop="manufacturerName", label="生产厂商")
          el-table-column(prop="numName", label="库存数量")
          el-table-column(prop="bid", label="采购价")
          el-table-column(prop="retailPriceName", label="整卖价格")
          el-table-column(prop="minRetailPriceName", label="拆零价格")
          el-table-column(prop="spec", label="药品规格")
          el-table-column(label="操作", align='center', width='150')
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click='tiaojia(scope.row)') 调价
              el-button(type="success", size='mini', @click='stockwarndrug(scope.row.id, 0)') 查看批次
        .pagination
          el-pagination(
            background,
            :page-size="stockPageSize",
            layout="total, prev, pager, next, jumper",
            :total="stockTotal",
            :current-page.sync="stockPageNum",
            @current-change='drugstockPage')

      //- el-tab-pane(label='批次库存及价格')
        el-row.top
          el-col(:span="5")
            el-input(placeholder="请输入内容", size='small', v-model="batchParam", @keyup.enter.native='batch')
              el-button(slot="append", icon="el-icon-search", @click='batch')
        el-table.table(
          stripe,
          border,
          :data='batchTable',
          size='medium',
          style="width: 100%"
        )
          //- batchNumber (string, optional): 入库批号 ,
          //- bid (number, optional): 进价 ,
          //- bidFee (number, optional): 采购批发总额 ,
          //- category (string, optional): 药品分类 0:西药；1：中成药；2：中药；3：血液制品；4：诊断试剂 ,
          //- goodsName (string, optional): 商品名称 ,
          //- manufacturerName (string, optional): 生产厂家 ,
          //- name (string, optional): 名称 ,
          //- num (number, optional): 采购数量 ,
          //- retailFee (number, optional): 采购处方总额 ,
          //- retailPrice (number, optional): 零售价 ,
          //- spec (string, optional): 药品规格
          el-table-column(prop="batchNumber", label="入库批号")
          el-table-column(prop="name", label="商品名称")
          el-table-column(prop="goodsName", label="别名")
          el-table-column(prop="num", label="采购数量")
          el-table-column(prop="category", label="药品分类")
            template(slot-scope="scope")
              span(v-for="item, index in drugType", :key="index", v-if="scope.row.category == item.dicItemCode") {{item.dicItemName}}
          el-table-column(prop="bid", label="采购价")
          el-table-column(prop="bidFee", label="采购批发总额")
          el-table-column(prop="retailFee", label="采购处方总额")
          el-table-column(prop="spec", label="药品规格")
        .pagination
          el-pagination(
            background,
            :page-size="batchPageSize",
            layout="total, prev, pager, next, jumper",
            :total="batchTotal",
            :current-page.sync="batchPageNum",
            @current-change='batchPage')
      
      el-tab-pane
        span(slot="label") 库存预警
          el-badge.dot(is-dot, :hidden="!needWarn") 
        el-table.table(
          stripe,
          border,
          :data='warnTable',
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="goodsName", label="药品名称")
          el-table-column(prop="manufacturerName", label="生产厂商")
          el-table-column(prop="spec", label="药品规格")
          el-table-column(prop="safetyNumName", label="最低库存数")
          el-table-column(prop="numName", label="库存数量")
          el-table-column(prop="expireNumName", label="过期数量")
          el-table-column(label="预警类型", align="center", width='175')
            template(slot-scope="scope")
              .input
                span.input
                  el-tag(type="danger", v-if="scope.row.warnType == 1 || scope.row.warnType == 3") 库存不足
                span.input
                  span(@click='stockwarndrug(scope.row.id, 1)')
                    el-tag.point(type="warning", v-if="scope.row.warnType == 2 || scope.row.warnType == 3") 过期提醒
        .pagination
          el-pagination(
            background,
            :page-size="warnPageSize",
            layout="total, prev, pager, next, jumper",
            :total="warnTotal",
            :current-page.sync="warnPageNum",
            @current-change='stockwarnlistPage')
    el-dialog(
      :visible.sync="kucunDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 库存预警设置
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="预警数量")
            el-input(size='medium', placeholder='请输入预警数量', type="number")
        .bigbtn 确认设置
    el-dialog(
      :visible.sync="tiaojiaDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 调整处方价
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="药品名称")
            span.formspan {{edit.name}}
          el-form-item(label="采购价")
            span.formspan ¥{{edit.bid}}
          el-form-item(label="整卖价格")
            el-input(v-model="edit.retailPrice", type="number")
          el-form-item(label="拆零价格")
            .input
              el-input(v-model="edit.minRetailPrice", type="number")
              el-select(placeholder="请选择", v-model="edit.minPriceUnitType")
                el-option(:label='minUnitName', :value='1')
                el-option(:label='doseUnitName', :value='2')
          //  el-form-item(label="库存")
            el-input(size='medium', placeholder='请输入库存数量')
        .bigbtn(@click='queding') 确认设置

    el-dialog(
      :visible.sync="warnDialogVisible",
      width="700px",
      center)
      .dialogtitle(slot='title') {{stockdrugtype === 0 ? '药品批次' : '过期药品'}}
      el-table.table(
        stripe,
        border,
        :data='warndrugTable',
        size='medium',
        style="width: 100%"
      )
        el-table-column(prop="batchNumber", label="药品批号")
        el-table-column(label="到期日期")
          template(slot-scope="scope")
            span {{scope.row.expiryDate | datefilters}}
        el-table-column(prop="numName", label="到期数量")

</template>

<script>
import { formatTime } from '@/assets/js/utils'
export default {
  data () {
    return {
      tiaojiaDialogVisible: false,
      kucunDialogVisible: false,
      warnDialogVisible: false,

      stockParam: '',
      stockTable: [],
      stockPageNum: 1,
      stockPageSize: this.$store.state.userAgent ? 8 : 20,
      stockTotal: 0,

      batchParam: '',
      batchTable: [],
      batchPageNum: 1,
      batchPageSize: this.$store.state.userAgent ? 8 : 20,
      batchTotal: 0,

      edit: {},
      doseUnitName: '',
      minUnitName: '',

      warnTable: [],
      needWarn: '',
      warnPageNum: 1,
      warnPageSize: this.$store.state.userAgent ? 8 : 20,
      warnTotal: 0,

      warndrugTable: [],
      stockdrugtype: 0
    }
  },
  computed: {
    drugType () {
      return this.$store.state.drugType
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
  methods: {
    handleClick (val) {
      console.log(val)
      if (+val.index === 0) {
        this.drugstock()
      } else if (+val.index === 1) {
        // this.batch()
        this.stockwarnlist()
      }
    },
    setyujing () {
      this.kucunDialogVisible = true
    },
    tiaojia (row) {
      this.minUnitName = ''
      this.doseUnitName = ''
      this.edit = {}
      // 获取药品小单位
      this.edit = {
        id: row.id,
        name: row.name,
        bid: row.bid,
        minRetailPrice: row.minRetailPrice,
        retailPrice: row.retailPrice,
        minPriceUnitType: row.minPriceUnitType
      }
      this.minUnitName = row.minUnitName
      this.doseUnitName = row.doseUnitName
      this.tiaojiaDialogVisible = true
    },
    queding () {
      this.$confirm('确定调整?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定调整
        this.$api.stockmodifyprice(this.edit).then(res => {
          if (res.success) {
            this.drugstock()
            this.$message.success('保存成功!')
            this.tiaojiaDialogVisible = false
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    drugstockSearch () {
      this.stockPageNum = 1
      this.drugstock()
    },
    drugstockPage (val) {
      this.stockPageNum = val
      this.drugstock()
    },
    drugstock () {
      this.$api.getstocklist({
        pageNum: this.stockPageNum,
        pageSize: this.stockPageSize,
        param: this.stockParam
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.stockTotal = res.result.total
          this.stockTable = res.result.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    batchPage (val) {
      this.batchPageNum = val
      this.batch()
    },
    batch () {
      this.$api.batch({
        pageNum: this.batchPageNum,
        pageSize: this.batchPageSize,
        param: this.batchParam
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.batchTotal = res.result.total
          this.batchTable = res.result.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    stockwarn () {
      this.$api.stockwarn()
        .then(res => {
          if (res.success) {
            this.needWarn = res.result.needWarn
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    stockwarnlistPage (val) {
      this.warnPageNum = val
      this.stockwarnlist()
    },
    stockwarnlist () {
      this.$api.stockwarnlist({
        pageNum: this.warnPageNum,
        pageSize: this.warnPageSize
      }).then(res => {
        if (res.success) {
          this.warnTable = res.result.data
          this.warnTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    stockwarndrug (id, type) {
      this.stockdrugtype = type
      this.$api.stockwarndrug({
        drugId: id,
        type: type
      }).then(res => {
        if (res.success) {
          this.warnDialogVisible = true
          this.warndrugTable = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    this.$store.commit('getDrugType')
    this.drugstock()
    this.stockwarn()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.myselect
  width 110px
.formspan
  color $elBlack
.kucun
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
.top
  .right
    text-align right
.table
  margin-top 20px

.pagination
  margin-top 20px
  text-align center

.input
  flex 1
  display flex
  flex-direction row

.dot
  margin-left 5px
  margin-top -10px

.right
  margin-right 10px

.point
  cursor pointer
</style>

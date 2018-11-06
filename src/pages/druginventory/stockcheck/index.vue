<template lang="pug">
  .pagecontent
    .topnavinfo
      .left 单据号：
        span {{inventoryNo}} 
      .right
        el-button(type="primary", size='mini', @click='addDrugDialogVisible') 添加药品
        el-button(type="primary", size='mini', :disabled="isDisabled", @click="submit(0)") 保存
        el-button(type="primary", size='mini', :disabled="isDisabled", @click="submit(1)") 提交审核
        el-button(type="primary", size='mini', :disabled="isDisabled", v-if="hasPermission", @click="submit(2)") 盘点完成
    .con 
      el-row
         el-col(:span='6')
          el-date-picker(v-model="datetime", size='small',
            type="date",
            align="right",
            :editable= 'false',
            placeholder='制单日期',
            :picker-options="pickerOptionsone")

      el-table.table(
        stripe,
        border,
        :data='tableData',
        size='medium',
        style="width: 100%",
        :default-expand-all="false"
      )
        el-table-column(type="expand", width="60")
          template(slot-scope="scope")
            el-table(
              stripe,
              border,
              :data='scope.row.detailList',
              size='medium',
              style="width: 100%",
              :show-header='false'
            )
              el-table-column(width="60")
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
              el-table-column
                template(slot-scope="scoped")
                  el-input(size='mini', v-model="scoped.row.num", type="number", @keyup.native="scope.row.num=scope.row.num.replace(/[^0-9]+/g,'')")
                    el-button.danwei(slot="append") {{scope.row.unitName}}
                  el-input.tinput(size='mini', v-model="scoped.row.minNum", type="number", v-if="scope.row.minPriceUnitType == 1 || scoped.row.actualMinNum", @keyup.native="scope.row.minNum=scope.row.minNum.replace(/[^0-9]+/g,'')")
                    el-button.danwei(slot="append") {{scope.row.minUnitName}}
                  el-input.tinput(size='mini', v-model="scoped.row.doseNum", type="number", v-if="scope.row.minPriceUnitType == 2 || scoped.row.actualDoseNum", @keyup.native="scope.row.doseNum=scope.row.doseNum.replace(/[^0-9]+/g,'')")
                    el-button.danwei(slot="append") {{scope.row.doseUnitName}}
              el-table-column(width='80')

        el-table-column(prop="goodsName", label="药品名称", align='center')
        el-table-column(prop="manufacturerName", label="生产商", align='center')
        el-table-column(prop="spec", label="规格", align='center')
        el-table-column(label="药品批次", align='center')
        el-table-column(label="有效期", align='center')
        el-table-column(prop="numMax", label="账面数量", align='center')
          template(slot-scope="scope")
            span {{scope.row.num ? scope.row.num : ''}}{{scope.row.num ? scope.row.unitName : ''}}{{scope.row.minNum ? scope.row.minNum : ''}}{{scope.row.minNum ? scope.row.minUnitName : ''}}{{scope.row.doseNum ? scope.row.doseNum : ''}}{{scope.row.doseNum ? scope.row.doseUnitName : ''}}
        el-table-column(label="实际数量", align='center')
        el-table-column(label="操作", width='80', align='center')
          template(slot-scope="scope")
            el-button(type='danger' size='mini', @click="del(scope.$index)") 删除

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 添加药品
      .daorubody
        .my-row
          .my-col-input
            el-input(placeholder="请输入药品名称，进行搜索", size='small', clearable, v-model="nameSearchval", @keyup.enter.native='getDrugdictSearch')
              el-button(slot="append", icon="el-icon-search", @click='getDrugdictSearch')
          //- .my-col-select
          //-   el-select(placeholder="请选择", v-model="drugTypeSelect", size='small', @change='getDrugdict')
          //-     el-option(:value='-1', label='全部分类')
          //-     el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in drugType", :key="index")
          .my-col
            el-button(type='primary', size='small', @click='daoru') 确定添加({{selectNum}})
        el-table.table(
          stripe,
          border,
          size='medium',
          style="width: 100%",
          :empty-text="emptyText",
          :data='dictTableData',
          @selection-change='tbsel'
        )
          el-table-column(type="selection", width="55")
          el-table-column(prop="goodsName", label="名称", align='center')
          el-table-column(prop="manufacturerName", label="生产厂家", align='center')
          el-table-column(prop="categoryName", label="分类", align='center')
        .pagination
          el-pagination(
            background,
            layout="total, prev, pager, next, jumper",
            :page-size="dictPageSize",
            :current-page.sync="dictPageNum",
            :total="dictTotal",
            @current-change='getDrugdictPage')

</template>
<script>
import { formatTime } from '@/assets/js/utils'
export default {
  data () {
    return {
      centerDialogVisible: false,
      purchaseNo: '',
      datetime: '',
      id: '',
      hasPermission: '',

      tableData: [],

      dictTableData: [],
      dictPageNum: 1,
      dictPageSize: this.$store.state.userAgent ? 8 : 20,
      dictTotal: 0,
      selectNum: 0,
      drugTypeSelect: '',
      nameSearchval: '',

      selectIdArr: [],
      isDisabled: false,
      pickerOptionsone: {
        disabledDate: time => {
          let tomorrow = new Date()
          let starttime = time.getTime() > tomorrow
          return starttime
        }
      },
      emptyText: '请输入药品名称,点击搜索按钮进行查询'
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
    getDrugdictSearch (val) {
      this.dictPageNum = 1
      this.getDrugdict()
    },
    getDrugdictPage (val) {
      this.dictPageNum = val
      this.getDrugdict()
    },
    getDrugdict () {
      this.$api.druglist({
        pageNum: this.dictPageNum,
        pageSize: this.dictPageSize,
        param: {
          category: this.drugTypeSelect < 0 ? null : this.drugTypeSelect,
          name: this.nameSearchval === '' ? null : this.nameSearchval
        }
      }).then(res => {
        if (res.success) {
          this.dictTableData = res.result.data
          this.dictTotal = res.result.total
          this.emptyText = res.result.total == 0 ? '抱歉,暂时查询不到您的搜索内容' : '请输入药品名称,点击搜索按钮进行查询'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
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
    del (i) {
      this.tableData.splice(i, 1)
    },
    tbsel (arr) {
      this.selectNum = arr.length
      this.selectIdArr = arr
    },
    daoru () {
      if (this.selectIdArr) {
        let drugidlists = []
        this.tableData.map(item => {
          this.selectIdArr.map((_item, key) => {
            if (_item.id == item.detailList[0].drugId) {
              this.selectIdArr.splice(key, 1)
            }
          })
        })
        this.selectIdArr.map(item => {
          drugidlists.push(item.id)
        })
        drugidlists = drugidlists.toString()
        if (drugidlists == '') {
          this.$message.error('请选择不同的药品')
          return
        }
        this.$api.inventorydrugstocklist({
          drugIds: drugidlists
        }).then(res => {
          if (res.success) {
            res.result.map(item => {
              this.tableData.push(item)
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      this.centerDialogVisible = false
    },
    inventorydetail () {
      this.$api.inventorydetail({
        id: this.id
      }).then(res => {
        if (res.success) {
          this.tableData = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submit (status) {
      if (!this.datetime) {
        this.$message.error('请选择制单日期！')
        return false
      }
      let detailList = []
      this.tableData.map(item => {
        item.detailList.map(_item => {
          let json = {
            drugId: _item.drugId,
            stockId: _item.stockId,
            num: _item.num,
            minNum: _item.minNum ? _item.minNum : 0,
            doseNum: _item.doseNum ? _item.doseNum : 0
          }
          detailList.push(json)
        })
      })
      if (detailList.length === 0) {
        this.$message.error('请添加盘点药品！')
        return false
      }
      let json = {
        date: this.$formatTime(this.datetime, 'yyyy-MM-dd'),
        detailList: detailList,
        id: this.id ? this.id : null,
        inventoryNo: this.inventoryNo,
        status: status
      }
      this.isDisabled = true
      this.$api.inventorysave(json)
        .then(res => {
          if (res.success) {
            if (status === 0) {
              this.id = res.result.id
              this.$message.success('保存成功！')
            } else if (status !== 0) {
              this.$message.success('提交成功！')
              this.$store.commit('jump', {type: 4, t: 'i27'})
              this.$router.push({path: '/druginventory/stockcheckpurchase'})
            }
          } else {
            this.$message.error(res.msg)
          }
          this.isDisabled = false
        })
    },
    addDrugDialogVisible () {
      this.dictTableData = []
      this.nameSearchval = ''
      this.dictTotal = 0
      this.dictPageNum = 1
      this.emptyText = '请输入药品名称,点击搜索按钮进行查询'
      this.centerDialogVisible = true
    }
  },
  created () {
    this.$store.commit('getDrugType')
    this.id = this.$route.query.id ? this.$route.query.id : null
    this.inventoryNo = this.$route.query.inventoryNo ? this.$route.query.inventoryNo : ''
    this.date = this.$route.query.date ? this.$route.query.date : ''
    this.inventorypermission()
    if (this.id) {
      this.$store.commit('jump', {type: 4, t: 'i26'})
      this.inventorydetail()
    } else {
      this.inventoryNo = this.$formatTime(new Date().getTime(), 'yyyyMMddHHmmss' + Math.round(Math.random() * 1000000))
      this.date = this.$formatTime(new Date().getTime(), 'yyyy-MM-dd')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.el-date-editor.width100
  width 130px
.rightcol
  text-align right
  height 32px
  display flex
  align-items center
  justify-content flex-end
  span
    margin-right 20px
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
.con
  padding 20px 15px
  background $White

.table
  margin-top 20px
.pagination
  margin-top 20px
  text-align center

.selectwidth
  .el-select
    width 100%

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
.tinput
  margin-top 5px
</style>
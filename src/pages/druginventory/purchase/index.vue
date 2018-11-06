<template lang="pug">
  .pagecontent
    .topnavinfo
      .left 单据号：
        span {{purchaseNo}} 
        | 制单人：
        span {{$store.state.userInfo.nickName}}
      .right
        el-button(type="primary", size='mini', @click='addDrugDialogVisible', v-if="!isBatchLock") 添加药品
        el-button(type="primary", size='mini', :disabled="isDisabled", @click='caigou(0)', v-if="!isBatchLock") 暂存
        el-button(type="primary", size='mini', :disabled="isDisabled", @click='caigou(1)', v-if="!isBatchLock") 提交审核
        el-button(type="primary", size='mini', :disabled="isDisabled", @click='caigou(2)', v-if="hasPermission && !isBatchLock") 直接入库
        el-button(plain, size='mini', @click='isBatchLock = true', v-if="!isBatchLock") 开启批量设置
        el-button(type="primary", size='mini', @click='showeditDialogVisible', v-if="isBatchLock") 批量设置
        el-button(plain, size='mini', @click='isBatchLock = false', v-if="isBatchLock") 关闭
    .con
      el-row
        el-col(:span="6").selectwidth
          el-select(placeholder="选择供应商", v-model="select", size='small')
            el-option(:value='item.id', :label='item.supplyerName', v-for="item, index in supplylist", :key='index')
        el-col(:span='6', :offset="1")
          el-date-picker(v-model="datetime", size='small',
            type="date",
            align="right",
            :editable= 'false',
            placeholder='制单日期',
            :clearable="false",
            :picker-options="pickerOptionsone")
        el-col.rightcol(:span='11')
          | 采购总金额：
          span ¥{{bidFee}}
          | 处方总金额：
          span ¥{{retailFee}}
          //- el-button(type="danger", size='mini', @click='caigou(2)', v-if="hasPermission") 直接入库

      el-table.table(
        stripe,
        border,
        :data='tableData',
        size='medium',
        style="width: 100%",
        doLayout,
        @selection-change='selectDrug'
      )
        el-table-column(type="selection", width="55", v-if="isBatchLock")
        el-table-column(prop="goodsName", label="名称", align='center')
        el-table-column(prop="manufacturerName", label="厂商", align='center')
        el-table-column(prop="spec", label="规格", align='center')

        el-table-column(label="数量", align='center')
          template(slot-scope="scope")
            el-input(size='mini', v-model="scope.row.num", placeholder='采购数量', type="number", @keyup.native="scope.row.num=scope.row.num.replace(/[^0-9]+/g,'')")

        el-table-column(prop="unitName", label="单位", align='center')

        el-table-column(label="采购价", align='center')
          template(slot-scope="scope")
            el-input(size='mini', v-model="scope.row.bid", placeholder='采购价', type="number")

        el-table-column(label="处方价", align='center')
          template(slot-scope="scope")
            el-input(size='mini', v-model="scope.row.retailPrice", placeholder='处方价', type="number")

        el-table-column(label="采购额", prop='bidFee', align='center')
        el-table-column(label="批号", align='center')
          template(slot-scope="scope")
            el-input(size='mini', v-model="scope.row.batchNumber", placeholder='批号')
        el-table-column(label="有效期", align='center', width='160')
          template(slot-scope="scope")
            el-date-picker.width100(v-model="scope.row.expiryDate", size='mini',
              type="date",
              align="right",
              :editable= 'false',
              :picker-options="pickerOptions",
              placeholder='有效期')

        el-table-column(label="操作", width='80', align='center')
          template(slot-scope="scope")
            el-button(type="danger", size='mini', @click='del(scope.$index)') 删除

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 添加药品
      .daorubody
        .my-row
          .my-col-input
            el-input(placeholder="请输入药品名称，进行搜索", size='small', clearable, v-model="nameSearchval", @keyup.enter.native='getDrugdict', @change="getDrugdictSearch")
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

    el-dialog(
      :visible.sync="editDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 批量设置
      .daorubody
        el-form.myform(label-width="80px", v-model="editForm", label-position="right")
          el-form-item(label="商品数量")
            el-input(size='medium', placeholder='商品数量', v-model="editForm.num", type="number", @keyup.native="editForm.num=editForm.num.replace(/[^0-9]+/g,'')")
          el-form-item(label="批发价")
            el-input(size='medium', placeholder='商品批发价', v-model="editForm.bid", type="number")
          el-form-item(label="处方价")
            el-input(size='medium', placeholder='商品处方价', v-model="editForm.retailPrice", type="number")
          el-form-item(label="批号")
            el-input(size='medium', placeholder='入库批号', v-model="editForm.batchNumber")
          el-form-item(label="有效期")
            el-date-picker(
              v-model="editForm.expiryDate",
              size='medium',
              type="date",
              align="right",
              :editable= 'false',
              placeholder='有效期',
              style='width: 100%')
        .bigbtn(@click='setSelectAll') 确认保存
</template>
<script>
// import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      centerDialogVisible: false,
      editDialogVisible: false,
      id: '',
      editForm: {
        // num: '',
        // bid: '',
        // retailPrice: '',
        // batchNumber: '',
        // expiryDate: ''
      },
      select: '',
      datetime: '',

      arr: [],
      tableData: [],

      dictTableData: [],
      dictPageNum: 1,
      dictPageSize: this.$store.state.userAgent ? 8 : 20,
      dictTotal: 0,
      selectNum: 0,
      drugTypeSelect: '',
      nameSearchval: '',

      bidFee: 0,
      retailFee: 0,
      purchaseNo: 0,
      selectIdArr: [],
      pickerOptions: {
        disabledDate: time => {
          let starttime = time.getTime() < new Date()
          return starttime
        }
      },
      pickerOptionsone: {
        disabledDate: time => {
          let tomorrow = new Date()
          let starttime = time.getTime() > tomorrow
          return starttime
        }
      },
      hasPermission: '',
      isDisabled: false,
      isBatchLock: false,
      emptyText: '请输入药品名称,点击搜索按钮进行查询'
    }
  },
  computed: {
    supplylist () {
      return this.$store.state.supplylist
    },
    drugType () {
      return this.$store.state.drugType
    }
  },
  watch: {
    tableData: {
      handler: function (val) {
        this.bidFee = 0
        this.retailFee = 0
        console.log(val)
        for (let i = 0; i < val.length; i++) {
          // if (isNaN(+val[i].bid) || isNaN(+val[i].num) || isNaN(+val[i].retailPrice)) {
          //   this.$message.error('请填写数字！')
          //   return false
          // }
          // if (val[i].num && regExp.signlessInt(val[i].num)) {
          //   this.$message.error('请填写整数！')
          //   return false
          // }
          if (val[i].bid && val[i].num) {
            this.tableData[i].bidFee = Math.round((+val[i].bid * +val[i].num) * 100) / 100
            this.bidFee += this.tableData[i].bidFee
          }
          if (val[i].retailPrice && val[i].num) {
            this.tableData[i].retailFee = Math.round((+val[i].retailPrice * +val[i].num) * 100) / 100
            this.retailFee += this.tableData[i].retailFee
          }
        }
        this.bidFee = Math.round(this.bidFee * 100) / 100
        this.retailFee = Math.round(this.retailFee * 100) / 100
      },
      deep: true,
      immediate: true
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
          console.log(res.result)
          this.dictTableData = res.result.data
          this.dictTotal = res.result.total
          this.emptyText = res.result.total == 0 ? '抱歉,暂时查询不到您的搜索内容' : '请输入药品名称,点击搜索按钮进行查询'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    tbsel (arr) {
      this.selectNum = arr.length
      console.log(arr)
      this.arr = arr
    },
    selectDrug (arr) {
      this.selectIdArr = []
      for (let i = 0; i < arr.length; i++) {
        this.selectIdArr.push(arr[i].drugCode)
      }
    },
    del (i) {
      this.tableData.splice(i, 1)
    },
    daoru (row) {
      // for (let i = 0; i < this.arr.length; i++) {
      //   this.arr[i].drugId = this.arr[i].id ? this.arr[i].id : ''
      //   this.arr[i].id = null
      //   this.arr[i].manufacturerName = this.arr[i].manufacturerName ? this.arr[i].manufacturerName : ''
      //   this.arr[i].num = this.arr[i].num ? this.arr[i].num : ''
      //   this.arr[i].unitName = this.arr[i].unitName ? this.arr[i].unitName : ''
      //   this.arr[i].bid = this.arr[i].bid ? this.arr[i].bid : ''
      //   this.arr[i].retailPrice = this.arr[i].retailPrice ? this.arr[i].retailPrice : ''
      //   this.arr[i].batchNumber = this.arr[i].batchNumber ? this.arr[i].batchNumber : ''
      //   this.arr[i].expiryDate = this.arr[i].expiryDate ? this.arr[i].expiryDate : ''
      //   arrData.push(JSON.parse(JSON.stringify(this.arr[i])))
      // }
      // function unq (arr1) {
      //   if (arr1.length === 2 && arr1[0].drugId === arr1[1].drugId) {
      //     arr1.splice(1, 1)
      //   } else {
      //     for (let i = 0; i < arr1.length; i++) {
      //       for (let j = i + 1; j < arr1.length; j++) {
      //         if (arr1[i].drugId === arr1[j].drugId) {
      //           arr1.splice(j, 1)
      //         }
      //       }
      //     }
      //   }
      //   return arr1
      // }
      // this.tableData = unq(this.tableData)
      if (this.tableData.length > 0) {
        this.tableData.map(item => {
          this.arr.map((_item, index) => {
            if (item.drugCode == _item.drugCode) {
              this.arr.splice(index, 1)
            }
          })
        })
      }
      this.arr.forEach(item => {
        item.drugId = item.id ? item.id : ''
        item.id = null
        this.tableData.push(item)
      })
      // this.centerDialogVisible = false
    },
    // 批量设置
    showeditDialogVisible () {
      if (this.selectIdArr.length === 0) {
        this.$message.error('请先选择批量设置药品！')
        return false
      }
      this.editDialogVisible = true
    },
    setSelectAll () {
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.selectIdArr.length; j++) {
          if (this.tableData[i].drugCode === this.selectIdArr[j]) {
            let item = JSON.parse(JSON.stringify(this.tableData[i]))
            item.num = this.editForm.num ? this.editForm.num : item.num
            item.bid = this.editForm.bid ? this.editForm.bid : item.bid
            item.retailPrice = this.editForm.retailPrice ? this.editForm.retailPrice : item.retailPrice
            item.batchNumber = this.editForm.batchNumber ? this.editForm.batchNumber : item.batchNumber
            item.expiryDate = this.editForm.expiryDate ? this.editForm.expiryDate : item.expiryDate
            // this.$set(this.tableData, i, {num: this.editForm.num, bid: this.editForm.bid, retailPrice: this.editForm.retailPrice, batchNumber: this.editForm.batchNumber, expiryDate: this.editForm.expiryDate})
            this.$set(this.tableData, i, item)
          }
        }
      }
      setTimeout(() => {
        this.editForm.num = ''
        this.editForm.bid = ''
        this.editForm.retailPrice = ''
        this.editForm.batchNumber = ''
        this.editForm.expiryDate = ''
      }, 100)
      this.editDialogVisible = false
      // this.$refs.bigTable.$forceUpdate()
      // this.$refs.bigTable.store.updateColumns()
      // this.$refs.bigTable.layout.update()
    },
    caigou (status) {
      // 采购入库
      // {
      //   bidFee (number, optional): 采购批发总额 ,
      //   date (string, optional): 制单日期 ,
      //   detailList (Array[PurchaseDetail], optional),

      // {
      //   batchNumber (string, optional): 入库批号 ,
      //   bid (number, optional): 进价 ,
      //   bidFee (number, optional): 采购批发总额 ,
      //   drugCode (string, optional): 药品编码 ,
      //   expiryDate (string, optional): 有效期 ,
      //   id (string, optional): 主键 null：新增;not null：编辑 ,
      //   num (number, optional): 采购数量 ,
      //   retailFee (number, optional): 采购处方总额 ,
      //   retailPrice (number, optional): 零售价 ,
      //   unit (string, optional): 采购单位
      // }

      //   id (string, optional): 主键 null：新增;not null：编辑 ,
      //   purchaseNo (string, optional): 采购编号 ,
      //   retailFee (number, optional): 采购处方总额 ,
      //   status (integer, optional): 审核标记；0未审核：1，已审核 ,
      //   supplierId (integer, optional): 供应商
      // }
      let newArr = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (isNaN(+this.tableData[i].bid) || isNaN(+this.tableData[i].num) || isNaN(+this.tableData[i].retailPrice)) {
          this.$message.error('价格数量格式不正确！')
          return false
        }
        if (!this.tableData[i].bid) {
          this.$message.error('采购价请填写完整！')
          return false
        }
        if (!this.tableData[i].num) {
          this.$message.error('数量请填写完整！')
          return false
        }
        if (!this.tableData[i].retailPrice) {
          this.$message.error('处方价请填写完整！')
          return false
        }
        if (!this.tableData[i].batchNumber) {
          this.$message.error('请填写药品批号！')
          return false
        }
        if (!this.tableData[i].expiryDate) {
          this.$message.error('请选择有效期！')
          return false
        }
        newArr.push(this.tableData[i])
        newArr[i].expiryDate = this.$formatTime(newArr[i].expiryDate, 'yyyy-MM-dd')
      }
      if (newArr.length === 0) {
        this.$message.error('请添加采购药品！')
        return false
      }
      if (!this.select) {
        this.$message.error('请选择供应商！')
        return false
      }
      if (!this.datetime) {
        this.$message.error('请选择制单日期！')
        return false
      }
      // if (!supplierId) {
      //   this.$message.error('请选择供应商！')
      //   return false
      // }
      let data = {
        bidFee: this.bidFee,
        retailFee: this.retailFee,
        date: this.$formatTime(this.datetime, 'yyyy-MM-dd'),
        detailList: newArr,
        id: this.id ? this.id : null,
        purchaseNo: this.purchaseNo,
        status: status, // 0：未提交，1：待审核，2：已审核[直接入库用]
        supplierId: this.select ? this.select : null
      }
      this.isDisabled = true
      this.$api.purchasesave(data).then(res => {
        if (res.success) {
          if (status === 0) {
            this.id = res.result.id
            this.$message.success('保存成功！')
          } else if (status !== 0) {
            this.$message.success('提交成功！')
            this.$router.push({path: '/druginventory/storageaudit'})
          }
        } else {
          this.$message.error(res.msg)
        }
        this.isDisabled = false
      })
    },
    purchasedetail () {
      this.$api.purchasedetail({
        id: this.id
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.purchaseNo = res.result.purchaseNo
          this.select = res.result.supplierId
          this.date = res.result.date
          this.bidFee = res.result.bidFee
          this.retailFee = res.result.retailFee
          this.tableData = res.result.detailList
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
    addDrugDialogVisible () {
      this.dictTableData = []
      this.nameSearchval = ''
      this.dictPageNum = 1
      this.dictTotal = 0
      this.emptyText = '请输入药品名称,点击搜索按钮进行查询'
      this.centerDialogVisible = true
    }
  },
  created () {
    this.$store.commit('getDrugType')
    this.$store.commit('getSupplyList')
    this.purchasepermission()
    this.id = this.$route.query.id
    if (this.id) {
      this.$store.commit('jump', {type: 4, t: 'i8'})
      this.purchasedetail()
    } else {
      this.purchaseNo = this.$formatTime(new Date().getTime(), 'yyyyMMddHHmmss' + Math.round(Math.random() * 1000000))
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
</style>
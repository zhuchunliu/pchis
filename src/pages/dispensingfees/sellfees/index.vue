<template lang="pug">
  .pagecontent
    .content
      el-row
        el-col.marginR15(:span="4")
          el-input(placeholder="患者姓名或者编号", size='small', clearable, v-model="searchval", @keyup.enter.native='retaillistSearch')
            el-button(slot="append", icon="el-icon-search", @click='retaillistSearch')
        el-col.marginR15(:span="3")
          el-select(placeholder="请选择", v-model="payStatus" size='small', @change='retaillist')
            el-option(value='', label='全部')
            el-option(value=0, label='未收费')
            el-option(value=1, label='已收费')
            el-option(value=2, label='已删除')
        el-col.marginR15(:span="6")
          el-date-picker(v-model="date", size='small',
            type="daterange",
            align="right",
            unlink-panels,
            :editable= 'false',
            range-separator="至",
            start-placeholder="开始日期",
            end-placeholder="结束日期",
            @change='retaillistSearch')
        el-col.marginR15(:span="2")
          el-button(type="primary", size='small', @click="newDrugDetail") 新建
      el-row.table
        el-table(
            :data="tableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(type="index", label="序号", align='center')
          el-table-column(prop="patientName", label="患者姓名", align='center')
          el-table-column(label="性别", align='center')
            template(slot-scope="scope")
              span(v-if="scope.row.gender == '0'") 男
              span(v-if="scope.row.gender == '1'") 女
          el-table-column(prop="age", label="年龄", align='center')
          el-table-column(label="下单时间", align='center')
            template(slot-scope="scope")
              span {{scope.row.createAt | datefilters}}
          el-table-column(prop="fee", label="费用(元)", align='center')
          el-table-column(label="状态", align='center')
            template(slot-scope="scope")
              span(v-if="scope.row.payStatus == 0 && scope.row.removed  == 0") 未收费
              span(v-if="scope.row.payStatus == 1 && scope.row.removed  == 0") 已收费
              span(v-if="scope.row.removed  == 1") 已删除
          el-table-column(label="操作", align='center')
            template(slot-scope="scope")
              el-button(type="success", size='mini', v-if="scope.row.payStatus == 0 && scope.row.removed  == 0", @click="collectFee(scope.row)") 收费
              el-button(type="danger", size='mini', v-if="scope.row.payStatus == 0 && scope.row.removed  == 0", @click="deleteDrugDetail(scope.row)") 删除
              el-button(type="primary", size='mini', v-if="scope.row.payStatus == 1 ||  scope.row.removed  == 1", @click="showdrugDetailDialog(scope.row)") 详情
              
      .pagination
        el-pagination(
          background,
          :page-size="pageSize",
          layout="total, prev, pager, next, jumper",
          :current-page.sync="pageNum",
          :total="total",
          @current-change="retaillistpage")

    el-dialog(
      :visible.sync="collectFeeDialogVisible",
      width="650px",
      center)
      .dialogtitle(slot='title') 收费
      .shoufeidialogbody
        .payinfo
          .left
            el-form
              el-form-item(label="支付方式：")
                el-select(size='small', placeholder='选择', v-model="feeType")
                  el-option(v-for="item, index in $store.state.PaymentMethodType", :label='item.dicItemName', :value="item.dicItemCode", :key="index")
              el-form-item(label="支付金额：") 
                span(style='color: red') ¥ {{payMoney}}
          .right
            .paytype
              img(v-if="feeType==1", src='./../../../assets/img/pay_weixin.png')
              img(v-if="feeType==2", src='./../../../assets/img/pay_alipay.png')
              img(v-if="feeType==0", src='./../../../assets/img/pay_xianjin.png')
              img(v-if="feeType==3", src='./../../../assets/img/pay_card.png')
        .bigbtn(@click='shoufeiOk') 收费

    el-dialog(
      :visible.sync="drugDetailDialogVisible",
      width="1000px",
      center)
      .dialogtitle(slot='title') 药品订单详情
      el-button(v-if="!isShowPrint", size='small', style='position: absolute;right: 28px;top: 60px;z-index:9', @click='doprint') 打印

      .fayaobody(ref='printBody', style='display:none')
        div
          button.noprint(onclick='window.print()') 打印
          button.noprint(onclick='window.close()', style='margin-left:10px;') 关闭页面
        h1(style='font-size:24px;text-align:center;margin-bottom: 20px;') 药品订单详情
        div(style='float:left;width:100%;')
          p(style='width: 33%;display: inline-block;margin:0;') 姓名：张三
          p(style='width: 33%;display: inline-block;margin:0;') 性别：男
          p(style='width: 33%;display: inline-block;margin:0;') 手机号：15728046930
        div(style='float:left;width:100%;margin-bottom: 20px;font-size:18px;')
          p(style='width: 66%;display: inline-block;margin:0;') 日期：2018-04-03 15:23:45
        table(style='text-align:center;margin-bottom: 20px;font-size:12px;', border="1", cellpadding='5', cellspacing='0', width='100%')
          tr
            th 序号
            th 药品名称
            th 生产厂商
            th 规格
            //- th 单价(元)
            th 数量
            th 备注
          tr(v-for="item, index in drugorderlists", :key="index")
            td {{index+1}}
            td {{item.goodsName}}
            td {{item.manufacturerName}}
            td {{item.spec}}
            td {{item.num}}
            td {{item.remark}}
        span 以下空白
        div(style='font-weight:bold;font-size:16px;') 提示：
            span(style='font-weight:normal;font-size:16px;') 1、请遵循医嘱服药、2、请点清药品、3、发出药品不予退还
        div(style='font-weight:bold;font-size:16px;') 注：
          span(style='font-weight:normal;font-size:16px;') 处方开具后24小时内有效

      .drugorderdialogbody
        el-table.table(
          stripe,
          border,
          :data='drugorderlists',
          size='medium',
          style="width: 100%"
        )
          el-table-column(type="index", label="序号", align='center')
          el-table-column(prop="goodsName", label="药品名称", align='center')
          el-table-column(prop="manufacturerName", label="生产厂商")
          el-table-column(prop="spec", label="规格", align='center')
          //- el-table-column(prop="fee", label="单价(元)", align='center')
          el-table-column(prop="num", label="数量", align='center')
          el-table-column(prop="remark", label="备注")
</template>
<script>
import { formatTime } from '@/assets/js/utils'
export default {
  data () {
    return {
      searchval: '',
      payStatus: '0',
      date: [],
      pageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      total: 0,
      tableData: [],
      drugDetailDialogVisible: false,
      drugorderlists: [],
      collectFeeDialogVisible: false,
      feeType: '1',
      id: '',
      payMoney: 0,
      removed: 0,
      isShowPrint: 0
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
    doprint () {
      let newWindow = window.open('_blank') // 打开新窗口
      let codestr = this.$refs.printBody.innerHTML // 获取需要生成pdf页面的div代码
      newWindow.document.write(`<style type="text/css" media="print">.noprint{display: none;}</style>` + codestr) // 向文档写入HTML表达式或者JavaScript代码
      newWindow.document.close() // 关闭document的输出流, 显示选定的数据
      newWindow.print() // 打印当前窗口
      return true
    },
    newDrugDetail () {
      this.$router.push('/dispensingfees/sellfees/newsellfee')
    },
    showdrugDetailDialog (row) {
      this.isShowPrint = row.removed
      this.drugDetailDialogVisible = true
      this.$api.retaildetail({
        id: row.id
      }).then(res => {
        if (res.success) {
          this.drugorderlists = res.result.itemList
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deleteDrugDetail (row) {
      this.$confirm('您确定要删除该未支付订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.retaildel({
          id: row.id
        }).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.retaillist()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    collectFee (row) {
      this.id = row.id || ''
      this.payMoney = row.fee || 0
      this.collectFeeDialogVisible = true
    },
    shoufeiOk () {
      this.$confirm('确定支付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.retailpay({
          id: this.id,
          feeType: this.feeType
        }).then(res => {
          if (res.success) {
            this.collectFeeDialogVisible = false
            this.$message.success('收费成功')
            this.retaillist()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message.success('取消支付')
      })
    },
    retaillistSearch () {
      this.pageNum = 1
      this.retaillist()
    },
    retaillistpage (val) {
      this.pageNum = val
      this.retaillist()
    },
    retaillist () {
      this.removed = this.payStatus == 2 ? 1 : (this.payStatus === '' ? '' : 0)
      this.$api.retaillist({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          startTime: this.date ? this.$formatTime(this.date[0], 'yyyy-MM-dd') : '',
          endTime: this.date ? this.$formatTime(this.date[1], 'yyyy-MM-dd') : '',
          name: this.searchval,
          payStatus: this.payStatus == 2 ? '' : this.payStatus,
          removed: this.removed
        }
      }).then(res => {
        if (res.success) {
          this.tableData = res.result.data
          this.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    this.$store.commit('getPaymentMethod')
    this.date = [new Date(), new Date()]
    this.retaillist()
  }
}
</script>
<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.table
  margin-top 20px

.pagination
  margin-top 20px
  text-align center
.content
  min-height 300px
  padding 20px 15px
  background $White
  .marginR15
    display flex
    margin-right 15px
    align-items center
    justify-content flex-start
  .my-col
    height 32px
    display flex
    align-items center
    justify-content flex-end
    span
      color $Danger
.shoufeidialogbody
  .payinfo
    display flex
    flex-flow row nowrap
    .left
      flex 1
      padding 10px 0
    .right
      flex 1
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .ewm
        width 110px
        height 110px
        background $elBlack
        img
          width 100%
          height 100%
      .paytype
        &:not(:first-child)
          margin-top 10px
  .bigbtn
    text-align center
    padding 6px 0
    background $Blue
    width 100%
    border-radius 4px
    color $White
    transition all .2s ease
    cursor pointer
    &:hover
      background lighten($Blue, 20%)
</style>

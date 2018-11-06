<template lang="pug">
  .pagecontent
    .topnavinfo
      .left
      .right
        el-button(type="primary", size='mini', @click="showDrugorderlist") 添加
        el-button(type="success", size='mini', @click="submit") 提交
        el-button(type="info", size='mini', @click="closeCurrentPage") 关闭
    
    el-row.con
      el-col.left
        el-form(label-width="80px", label-position="left", :model="patientinfo")
          el-form-item(label="姓名:", required)
            el-input(size='medium', placeholder='填写姓名', v-model="patientinfo.realName")
          el-form-item
            el-button.datepk(type="primary", size='medium', @click='showRightOld') 历史患者
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
              :editable= 'false',
              type="date",
              v-model="patientinfo.dateOfBirth",
              placeholder="选择出生日期",
              :picker-options="$store.state.todaypickerOptionsone")
            i.itext *身份证和出生日期必填一项
          el-form-item(label="手机号:")
            el-input(size='medium', placeholder='填写手机号', v-model="patientinfo.mobile", type="number")
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
        .waitpay
          span 待支付: 
          span.waitpaymoney ¥{{allPrice}}
        el-table(
            :data="drugorderlists",
            stripe,
            border,
            size='medium',
            style="width: 100%",
            height="630"
          )
            el-table-column(type="index", label="序号", align='center')
            el-table-column(prop="drugName", label="药品名称", align='center')
            el-table-column(prop="manufacturerName", label="生产厂商")
            el-table-column(prop="spec", label="规格", align='center')
            el-table-column(prop="retailPrice", label="单价(元)", align='center', width="80")
            el-table-column(label="数量", align='center')
              template(slot-scope="scope")
                el-input-number(size='mini', v-model="scope.row.num", :min="1", @change="numChange(scope.row.num)")
            el-table-column(label="备注")
              template(slot-scope="scope")
                el-input(size='mini', placeholder='备注', v-model="scope.row.remark")
            el-table-column(label="操作", align='center', width="80")
              template(slot-scope="scope")
                el-button(type="danger", size='mini', @click="delDrug(scope.row)") 删除
    // 右侧栏显示(历史就诊人员名单)
    rightAside(ref='rightAsideOldVisit')
      .asideTab
        .asideCon
          .search
            el-input(placeholder="请输入内容", size='small', v-model="patientVal", @keyup.enter.native='getPatientsSearch')
              el-button(slot="append", icon="el-icon-search", @click='getPatientsSearch')
          .asidetable
            el-table(
              stripe,
              :data='patientTableData',
              size='medium',
              style="width: 100%",
              :height="rightTableHeight"
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

    // 右侧栏显示(药品选择)
    rightAside(ref='drugSelectrightAside', :width="500")
      .asideTab
        .asideCon
          .my-row-2
            //- .my-col-select
            //-   el-select(placeholder="请选择", v-model="drugSelect.type", size='small', @change='drugSelectlist')
            //-     el-option(:value='-1', label='全部分类')
            //-     el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in drugType", :key="index")
            .my-col-input
              el-input(placeholder="请输入药品名称，进行搜索", size='small', v-model="drugSelect.searchval", @keyup.enter.native='drugSelectlistsearch')
                el-button(slot="append", icon="el-icon-search", @click='drugSelectlistsearch')
          .asidetable
            el-table(
              stripe,
              :empty-text="emptyText",
              :data='drugSelectLists',
              size='medium',
              style="width: 100%",
              :height="drugSelectRightTableHeight",
              ref='yaopinTable',
              @select="isselectd",
              @selection-change='xuanzeDrug'
            )
              el-table-column(type="selection", width="50")
              el-table-column(prop="goodsName", label="名称")
              el-table-column(prop="manufacturerName", label="生产厂商")
              el-table-column(prop="spec", label="规格", align='center')
              el-table-column(prop="retailPrice", label="库存", align='center')
          .asidepagination
            el-pagination(
              small,
              :page-size="drugSelectPageSize",
              layout="prev, pager, next",
              :total="drugSelectTotal",
              :current-page.sync="drugSelectPageNum",
              @current-change='drugSelectlistPage')
        .asideBtns
          el-button(type='primary', size='mini', @click='tianjiaDrug(0)') 添加
          el-button(type='success', size='mini', @click='tianjiaDrug(1)') 添加并关闭
</template>

<script>
import rightAside from '@/components/rightAside'
import { regExp } from '@/assets/js/utils'
export default {
  components: {
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
        realName: '',
        gender: '0',
        idCard: '',
        socialCard: '',
        mobile: '',
        address: '',
        anaphylaxis: '',
        patientItemId: '',
        dateOfBirth: ''
      },
      drugorderlists: [],
      drugSelect: {
        searchval: '',
        type: ''
      },
      xuanzeDruglist: [],
      drugSelectLists: [],
      drugSelectPageSize: this.$store.state.userAgent ? 8 : 20,
      drugSelectPageNum: 1,
      drugSelectTotal: 0,
      emptyText: '请输入药品名称,点击搜索按钮进行查询'
    }
  },
  computed: {
    rightTableHeight () {
      return document.body.clientHeight - 150
    },
    drugSelectRightTableHeight () {
      return document.body.clientHeight - 132 - 46 - 50
    },
    drugType () {
      return this.$store.state.drugType
    },
    allPrice () {
      let price = 0
      this.drugorderlists.map(item => {
        price += item.retailPrice * item.num
      })
      price = Math.round(price * 100) / 100
      return price
    }
  },
  methods: {
    usePatient (data) {
      console.log(data)
      this.patientinfo.realName = data.patientName
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
    numChange (num) {
      if (num == undefined) {
        this.$message.error('药品数量不能为空')
      }
    },
    getPatientsSearch () {
      this.patientpageNum = 1
      this.getPatients()
    },
    getPatientsPage (val) {
      this.patientpageNum = val
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
    closeCurrentPage () {
      this.$router.go(-1)
    },
    showDrugorderlist () {
      this.drugSelect.searchval = ''
      this.drugSelectLists = []
      this.drugSelectPageNum = 1
      this.drugSelectTotal = 0
      this.emptyText = '请输入药品名称,点击搜索按钮进行查询'
      this.$refs.drugSelectrightAside.show()
    },
    isselectd (selection, row) {
      if (!row.numName) {
        selection.splice(-1, 1)
        this.xuanzeDruglist.splice(-1, 1)
        this.$message.warning('此药品暂无库存，无法使用！')
      }
    },
    // 选择药品
    xuanzeDrug (list) {
      this.xuanzeDruglist = JSON.parse(JSON.stringify(list))
    },
    tianjiaDrug (i) {
      console.log('添加')
      if (this.drugorderlists.length > 0) {
        this.drugorderlists.map(item => {
          this.xuanzeDruglist.map((_item, key) => {
            if (item.drugId == _item.id) {
              this.xuanzeDruglist.splice(key, 1)
            }
          })
        })
      }
      this.xuanzeDruglist.map(item => {
        let drug = {}
        drug.drugId = item.id
        drug.drugName = item.goodsName || ''
        drug.manufacturerName = item.manufacturerName || ''
        drug.spec = item.spec || ''
        drug.retailPrice = item.retailPrice || ''
        drug.num = 1
        drug.meno = ''
        this.drugorderlists.push(drug)
      })
      setTimeout(() => {
        this.$refs.yaopinTable.clearSelection()
        this.xuanzeDruglist = []
      }, 0)
      if (i) {
        this.$refs.drugSelectrightAside.hide()
      }
    },
    delDrug (i) {
      this.drugorderlists.splice(i, 1)
    },
    drugSelectlistsearch () {
      this.drugSelectPageNum = 1
      this.drugSelectlist()
    },
    drugSelectlistPage (val) {
      this.drugSelectPageNum = val
      this.drugSelectlist()
    },
    drugSelectlist () {
      this.$api.druglist({
        pageNum: this.drugSelectPageNum,
        pageSize: this.drugSelectPageSize,
        param: {
          category: this.drugSelect.type < 0 ? null : this.drugSelect.type,
          name: this.drugSelect.searchval === '' ? null : this.drugSelect.searchval,
          isValid: '1'
        }
      }).then(res => {
        if (res.success) {
          console.log(res.result)
          this.drugSelectLists = res.result.data
          this.drugSelectTotal = res.result.total
          this.emptyText = res.result.total == 0 ? '抱歉,暂时查询不到您的搜索内容' : '请输入药品名称,点击搜索按钮进行查询'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submit () {
      let json = {}
      json.drugList = []
      json.patient = this.patientinfo
      if (!json.patient.realName) {
        this.$message.warning('姓名不能为空')
        return
      }
      if (!json.patient.idCard && !json.patient.dateOfBirth) {
        this.$message.warning('身份证和出生日期需必填一项')
        return
      }
      if (json.patient.idCard && regExp.idCard(json.patient.idCard)) {
        this.$message.error('请填写有效的身份证')
        return
      }
      if (json.patient.mobile && regExp.mobile(json.patient.mobile)) {
        this.$message.error('请填写有效的手机号')
        return
      }
      this.drugorderlists.map(item => {
        if (item.num == '' || item.num == undefined) {
          this.$message.error(item.drugName + '数量不能为空')
          return
        }
        let _item = {
          drugId: item.drugId,
          num: item.num,
          remark: item.remark
        }
        json.drugList.push(_item)
      })
      this.$api.retailsave(json)
        .then(res => {
          if (res.success) {
            this.$message.success('提交成功')
            this.$router.push('/dispensingfees/sellfees')
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
    }
  },
  created () {
    this.getPatients()
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
@import './../../../../assets/css/var.styl'
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
    min-height 710px
    width 240px
  .right
    background $White
    padding 15px
    min-height 630px
    flex 1
    .waitpay
      padding 10px 0 20px
      font-size 20px
      .waitpaymoney
        color $Danger
.el-form-item
  margin-bottom 10px
.itext
  font-size 12px
  font-weight normal
  color red
.datepk
  width 100% !important
.my-row-2
  display flex
  flex-flow row nowrap
  align-items center
  justify-content flex-start
  padding 20px
  .my-col-input
    flex 3
    margin-right 0
  .my-col-select
    flex 2
    margin-right 15px
</style>

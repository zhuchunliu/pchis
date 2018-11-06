<template lang="pug">
  .pagecontent
    el-row.conbody
      .top
        .l {{tplName}}
        .r
          el-button(size='medium', type="primary", @click="save", v-show="!isDisabled") 保存
          el-button(size='medium', type="primary", @click="isDisabled = false", v-show="isDisabled", v-if="isSelf=='1'") 编辑
          el-button(size='medium', @click='cancle') 取消
          // el-button(size='medium') 返回上一级
      
      el-col(:span='24').mt
        el-table(
          :data="tabledata",
          size='medium',
          stripe,
          border,
          style="width: 100%"
        )
          el-table-column(prop="drugName", label="药品名称")
          el-table-column(prop="manufacturerName", label="生产厂商")
          el-table-column(label="药品分类", width='100', align='center')
            template(slot-scope="scope")
              span {{scope.row.categoryName}}
          el-table-column(label="数量", width='150', align='center')
            template(slot-scope="scope")
              el-input(size="medium", v-model="scope.row.num", :disabled="isDisabled", type="number", @keyup.native="scope.row.num=scope.row.num.replace(/[^0-9]+/g,'')")
                span(slot="append", v-if="$store.state.userStatus === 0") {{scope.row.unitName}}
                el-select.select(slot="append", size='medium', v-model="scope.row.unitType", placeholder="请选择", :disabled="isDisabled", v-else)
                  el-option(:label="scope.row.unitName", :value="1")
                  el-option(:label="scope.row.minOrDoseUnitName", :value="2")
          el-table-column(label="使用剂量", align='center')
            template(slot-scope="scope")
              el-input(size="medium", v-model="scope.row.singleDose", :disabled="isDisabled", type="number")
                span(slot="append") {{scope.row.singleDoseUnitName}}
          el-table-column(label="使用频次", align='center')
            template(slot-scope="scope")
              el-select(size='medium', v-model="scope.row.frequency", placeholder="请选择", :disabled="isDisabled")
                el-option(v-for="drug in drugFrequency", :key="drug.dicItemCode", :label="drug.dicItemName", :value="+drug.dicItemCode")
          el-table-column(label="备注", align='center')
            template(slot-scope="scope")
              .menospan(@click="memoModel(scope.row.memo, scope.$index)", :class="[isDisabled ? 'disabled' : '']") {{scope.row.memo}}
          el-table-column(label="状态", width='80', v-show="!isDisabled", align='center')
            template(slot-scope="scope")
              el-button(size='mini', type="danger", @click="deleteDrug(scope.$index)", v-show="!isDisabled") 删除
      el-col(:span='24').mt
        el-button(type="primary", icon="el-icon-plus", round, style='margin:0 auto;display:block;', @click='showAside', v-show="!isDisabled") 添加

    el-dialog(
      :visible.sync="memoDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 备注
      el-input(type="textarea", :autosize="{ minRows: 4}", v-model="memoValue")
      el-button.memobtn(type="primary", @click="conmemovalue") 确认保存

    // 右侧栏显示 药品处方添加
    rightAside(ref='rightAside')
      .asideTab
        .top
          .title.active 中药／西成药
        .asideCon
          .acon
            .search
              el-input(placeholder="请输入药品名称，进行搜索", size='small', v-model="drugName", @keyup.enter.native='getDrugModel')
                el-button(slot="append", icon="el-icon-search", @click="getDrugModel")
            .asidetable
              el-table(
                :empty-text="emptyText",                
                :data="drugLists"
                @selection-change="handleSelectionChange"
                stripe,
                size='medium',
                :height="rightTableHeight",
                style="width: 100%"
              )
                el-table-column(type="selection", width="55")
                el-table-column(prop="goodsName", label="名称")
                el-table-column(prop="manufacturerName", label="生产厂商")
                el-table-column(prop="spec", label="规格", align='center')
                el-table-column(prop="numName", label="库存", align='center', v-if="$store.state.userStatus > 0")
            .asidepagination
              el-pagination(
                small,
                layout="prev, pager, next",
                :total="drugTotal",
                :page-size="drugPageSize"
                :current-page.sync="drugPageNum",
                @current-change="getDrugListPage")          
        .asideBtns
          el-button(type='primary', size='mini', @click="addDrugToModel(0)") 添加
          el-button(type='success', size='mini', @click="addDrugToModel(1)") 添加并关闭
</template>
<script>
import rightAside from '@/components/rightAside'
export default {
  components: {
    rightAside
  },
  data () {
    return {
      tabledata: [],
      drugLists: [],
      drugPageNum: 1,
      drugCategory: '',
      drugTotal: 0,
      drugName: '',
      addDrugLists: [],
      isDisabled: false,
      drugFrequency: [],
      isSelf: '1',
      tplName: '',
      memoDialogVisible: false,
      memoValue: '',
      memoIndex: 0,
      drugPageSize: this.$store.state.userAgent ? 8 : 20,
      emptyText: '请输入药品名称,点击搜索按钮进行查询'
    }
  },
  created () {
    let _this = this
    _this.isSelf = _this.$route.query.isSelf
    switch (_this.$route.query.isEdit) {
      case '1': _this.isDisabled = false
        break
      case '2': _this.isDisabled = true
        break
    }
    this.tplName = _this.$route.query.tplName
    _this.getTplPrescripTplDetail(_this.$route.query.id)
  },
  computed: {
    rightTableHeight () {
      return document.body.clientHeight - 132 - 46 - 50
    }
  },
  methods: {
    showAside () {
      this.addDrugLists = []
      this.drugName = ''
      this.$refs.rightAside.show()
    },
    getTplPrescripTplDetail (id) {
      let _this = this
      _this.$api.getTplPrescripTplDetail({id: id})
        .then((res) => {
          console.log(res)
          if (res.success) {
            _this.tabledata = res.result
            _this.dicItemDicTypeCode()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    getDrugModel () {
      if (this.$store.state.userStatus === 0) {
        this.getDrugdictList()
      } else if (this.$store.state.userStatus > 0) {
        this.getDrugList()
      }
    },
    getDrugListPage (val) {
      this.drugPageNum = val
      this.getDrugModel()
    },
    getDrugList () {
      this.$api.getDrugList({
        pageNum: this.drugPageNum,
        pageSize: this.drugPageSize,
        param: {
          category: this.drugCategory,
          isValid: 1,
          name: this.drugName
        }
      }).then(res => {
        if (res.success) {
          this.drugTotal = res.result.total
          this.drugLists = res.result.data
          this.emptyText = res.result.total == 0 ? '抱歉,暂时查询不到您的搜索内容' : '请输入药品名称,点击搜索按钮进行查询'
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => console.log(error))
    },
    // 获取药品字典
    getDrugdictList () {
      this.$api.drugdictlist({
        pageNum: this.drugPageNum,
        pageSize: this.drugPageSize,
        param: {
          isHandle: 1,
          category: this.drugCategory,
          name: this.drugName
        }
      }).then(res => {
        if (res.success) {
          this.drugTotal = res.result.total
          this.drugLists = res.result.data
          this.emptyText = res.result.total == 0 ? '抱歉,暂时查询不到您的搜索内容' : '请输入药品名称,点击搜索按钮进行查询'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    dicItemDicTypeCode () {
      this.$api.dicItemDicTypeCode({
        dicTypeCode: this.$dicTypeCode.DrugFrequency
      }).then(res => {
        if (res.success) {
          this.drugFrequency = res.result
          console.log(this.tabledata)
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    addDrugToModel (type) {
      let _this = this
      // let initDrug = ''
      // let drugTwoLists = []
      let drugLists = []
      if (type) {
        _this.$refs.rightAside.hide()
      }
      // if (_this.tabledata.length != 0) {
      //   console.log('1')
      //   initDrug = _this.tabledata[0].category
      // }
      // if (_this.tabledata == 0 && _this.addDrugLists.length != 0) {
      //   console.log('2')
      //   initDrug = _this.addDrugLists[0].category
      // }
      _this.tabledata.map(item => {
        _this.addDrugLists.map((_item, index) => {
          if (item.drugId == _item.id) {
            _this.addDrugLists.splice(index, 1)
          }
        })
      })
      // _this.addDrugLists.map(_item => {
      //   if (initDrug === _item.category) {
      //     drugTwoLists.push(_item)
      //   }
      // })
      // _this.addDrugLists = drugTwoLists
      _this.addDrugLists.forEach(item => {
        let json = {
          drugId: item.id,
          drugName: item.goodsName,
          categoryName: item.categoryName,
          unitName: item.unitName,
          minOrDoseUnitName: item.minPriceUnitType == 1 ? item.minUnitName : item.doseUnitName,
          doseUnitName: item.doseUnitName ? item.doseUnitName : '',
          singleDoseUnitName: item.singleDoseUnitName ? item.singleDoseUnitName : '',
          manufacturerName: item.manufacturerName,
          unitType: 1,
          frequency: 1,
          memo: ''
        }
        drugLists.push(json)
      })
      let ttt = [..._this.tabledata, ...drugLists]
      _this.tabledata = ttt
      console.log(_this.tabledata)
    },
    deleteDrug (index) {
      let _this = this
      _this.tabledata.splice(index, 1)
    },
    handleSelectionChange (val) {
      this.addDrugLists = JSON.parse(JSON.stringify(val))
    },
    save () {
      let _this = this
      let list = _this.tabledata
      let locked = true
      console.log(list)
      if (list.length > 0) {
        list.map(item => {
          if (!item.num || !item.singleDose) {
            this.$message.warning('数量或使用剂量不能为空')
            locked = false
          }
        })
      }
      if (!locked) {
        return
      }
      let parmas = {
        list: list,
        tplId: _this.$route.query.id
      }
      _this.$api.TplPrescripTplItemSave(parmas)
        .then((res) => {
          if (res.success) {
            let row = {
              activeName: '1'
            }
            _this.$router.replace({path: '/system/stencil', query: row})
          } else {
            _this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    cancle () {
      let _this = this
      let row = {
        activeName: '1'
      }
      _this.$router.replace({path: '/system/stencil', query: row})
    },
    memoModel (val, index) {
      if (!this.isDisabled) {
        this.memoValue = ''
        this.memoDialogVisible = true
        this.memoValue = val
        this.memoIndex = index
      }
    },
    conmemovalue () {
      this.tabledata[this.memoIndex].memo = this.memoValue
      this.memoDialogVisible = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../../assets/css/var.styl'
.mt
  margin-top 20px
.conbody
  background $White
  padding 20px 15px
  .top
    display flex
    justify-content space-between
    align-items center
    .l
      flex 0 0 400px
      height 30px
      line-height 30px
      font-size 17px
    .r
      flex 1
      text-align right 
  .cfselect
    min-width 80px
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
.select 
  width 65px
.menospan
  width 200px
  height 36px
  border 1px solid $elSilver
  background $White
  border-radius 4px
  cursor pointer
  text-align left
  padding 0 15px
  line-height 34px
  &.disabled
    background-color #f5f7fa
    border-color #e4e7ed
    color #c0c4cc
    cursor not-allowed
.memobtn
  width 100%
  margin-top 20px
</style>

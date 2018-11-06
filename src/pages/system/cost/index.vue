<template lang="pug">
  .pagecontent
    el-tabs(type="border-card", v-model="activeName", @tab-click="handleClick")
      el-tab-pane(label='挂号费管理', name='1')
        el-row.top
          el-col(:span="5")
            el-input(placeholder="请输入内容", size='small', clearable, v-model="searchval", @keyup.enter.native='getFeeList')
              el-button(slot="append", icon="el-icon-search", @click="getFeeList")
          el-col.right(:span="19")
            el-button(size='small', icon="el-icon-plus", @click='addgh') 新增
        el-table.table(
          stripe,
          border,
          :data='tableData',
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="categoryName", label="名称")
          el-table-column(prop="itemPrice", label="金额")
          el-table-column(prop="createUserName", label="创建人")
          //- el-table-column(prop="createAt", label="创建日期")
          el-table-column(label="操作")
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click='editGhf(scope.row)') 编辑
              el-button(type="danger", size='mini', @click='delGhf(scope.row)') 删除
        //- .pagination
        //-   el-pagination(
        //-     background,
        //-     :page-size="100",
        //-     layout="total, prev, pager, next, jumper",
        //-     :total="tableData.length")
      el-tab-pane(label='附加费管理', name='2')
        el-row.top
          el-col(:span="5")
            el-input(placeholder="请输入内容", size='small', clearable, v-model="searchval", @keyup.enter.native='getFeeList')
              el-button(slot="append", icon="el-icon-search", @click="getFeeList")
          el-col.right(:span="19")
            el-button(size='small', icon="el-icon-plus", @click='addfjf') 新增
        el-table.table(
          stripe,
          border,
          :data='tableData',
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="categoryName", label="名称")
          el-table-column(prop="itemPrice", label="金额")
          el-table-column(prop="createUserName", label="创建人")
          //- el-table-column(prop="createAt", label="创建日期")
          el-table-column(label="操作")
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click='editFjf(scope.row)') 编辑
              el-button(type="danger", size='mini', @click='delFjf(scope.row)') 删除
        //- .pagination
        //-   el-pagination(
        //-     background,
        //-     :page-size="100",
        //-     layout="total, prev, pager, next, jumper",
        //-     :total="tableData.length")

      el-tab-pane(label='检查项目费管理', name='3')
        el-row.top
          el-col(:span="5")
            el-input(placeholder="请输入内容", size='small', clearable, v-model="searchval", @keyup.enter.native='getFeeList')
              el-button(slot="append", icon="el-icon-search", @click="getFeeList")
          el-col.right(:span="19")
            el-button(size='small', icon="el-icon-plus", @click='addjcf') 新增
        el-table.table(
          stripe,
          border,
          :data='tableData',
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="categoryName", label="名称")
          el-table-column(prop="itemPrice", label="金额")
          el-table-column(prop="createUserName", label="创建人")
          //- el-table-column(prop="createAt", label="创建日期")
          el-table-column(label="操作")
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click='editJcf(scope.row)') 编辑
              el-button(type="danger", size='mini', @click='delJcf(scope.row)') 删除
        //- .pagination
        //-   el-pagination(
        //-     background,
        //-     :page-size="100",
        //-     layout="total, prev, pager, next, jumper",
        //-     :total="tableData.length")


    el-dialog(
      :visible.sync="ghDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 添加挂号费
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="费用名称")
            el-select.width100(size='medium', placeholder="请选择费用名称", v-model="ghItem.category")
              el-option( v-for="item, index in ItemLists", :label="item.dicItemName", :value="item.dicItemCode", :key='item.dicItemCode')
          el-form-item(label="金额")
            el-input(size='medium', placeholder='单位（元）', v-model="ghItem.itemPrice", type="number")
        .bigbtn(@click="feeSave") 确认添加
        
    el-dialog(
      :visible.sync="edghDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 编辑挂号费
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="费用名称")
            el-select.width100(size='medium', placeholder="请选择费用名称", v-model="ghItem.category")
              el-option( v-for="item, index in ItemLists", :label="item.dicItemName", :value="item.dicItemCode", :key='index')
          el-form-item(label="金额")
            el-input(size='medium', placeholder='单位（元）', v-model="ghItem.itemPrice", type="number")
        .bigbtn(@click="feeSave") 确认保存

    el-dialog(
      :visible.sync="fjfDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 添加附加费
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="费用名称")
            el-select(size='medium', placeholder="请选择费用名称", v-model="fjfItem.category")
              el-option( v-for="item, index in ItemLists", :label="item.dicItemName", :value="item.dicItemCode", :key='item.dicItemCode')
            el-button(size='medium', @click="addfjfChargeCategory") +
          el-form-item(label="金额")
            el-input(size='medium', placeholder='单位（元）', v-model="fjfItem.itemPrice", type="number")
        .bigbtn(@click="feeSave") 确认添加

    el-dialog(
      :visible.sync="edfjfDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 编辑附加费
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="费用名称")
            el-select.width100(size='medium', placeholder="请选择费用名称", v-model="fjfItem.category")
              el-option( v-for="item, index in ItemLists", :label="item.dicItemName", :value="item.dicItemCode", :key='index')
          el-form-item(label="金额")
            el-input(size='medium', placeholder='单位（元）', v-model="fjfItem.itemPrice", type="number")
        .bigbtn(@click="feeSave") 确认保存

    el-dialog(
      :visible.sync="jcfDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 添加检查项目费
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="费用名称")
            el-select.width100(size='medium', placeholder="请选择费用名称", v-model="jcfItem.category")
              el-option( v-for="item, index in ItemLists", :label="item.dicItemName", :value="item.dicItemCode", :key='item.dicItemCode')
          el-form-item(label="金额")
            el-input(size='medium', placeholder='单位（元）', v-model="jcfItem.itemPrice", type="number")
        .bigbtn(@click="feeSave") 确认添加
    el-dialog(
      :visible.sync="edjcfDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 编辑检查项目费
      .kucun
        el-form(label-width="80px", label-position="left")
          el-form-item(label="费用名称")
            el-select.width100(size='medium', placeholder="请选择费用名称", v-model="jcfItem.category")
              el-option( v-for="item, index in ItemLists", :label="item.dicItemName", :value="item.dicItemCode", :key='index')
          el-form-item(label="金额")
            el-input(size='medium', placeholder='单位（元）', v-model="jcfItem.itemPrice", type="number")
        .bigbtn(@click="feeSave") 确认保存

    el-dialog(
      :visible.sync="fjfChargeCategoryDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 添加
      .kucun
        el-form(label-width="100px", label-position="left")
          el-form-item(label="字典项名称")
            el-input(size='medium', placeholder='请输入内容', type="input", v-model="fjfdicItemName")
          el-form-item(label="字典类型编码")
            el-input(size='medium', placeholder='请输入内容', type="input", v-model="fjfdicTypeCode", disabled) 
        .bigbtn(@click="addfjfChargeCategoryData") 确认添加
</template>

<script>
export default {
  data () {
    return {
      activeName: '1',
      searchval: '',
      jiage: '',
      danwei: '',
      ghDialogVisible: false,
      fjfDialogVisible: false,
      jcfDialogVisible: false,
      edghDialogVisible: false,
      edfjfDialogVisible: false,
      edjcfDialogVisible: false,
      kucunDialogVisible: false,
      currentDicTypeCode: '',
      dicTypeCodeLists: {
        ApplyCategory: this.$dicTypeCode.ApplyCategory,
        ChargeCategory: this.$dicTypeCode.ChargeCategory,
        InspectCategory: this.$dicTypeCode.InspectCategory
      },
      ItemLists: [], // 费用名称
      tableData: [],
      ghItem: {},
      fjfItem: {},
      jcfItem: {},
      fjfChargeCategoryDialogVisible: false,
      fjfdicItemName: '',
      fjfdicTypeCode: 'ChargeCategory'
    }
  },
  created () {
    let _this = this
    _this.currentDicTypeCode = _this.dicTypeCodeLists.ApplyCategory
    _this.getFeeList(_this.currentDicTypeCode)
  },
  methods: {
    handleClick () {
      let _this = this
      _this.searchval = ''
      switch (_this.activeName) {
        case '1':
          _this.currentDicTypeCode = _this.dicTypeCodeLists.ApplyCategory
          _this.getFeeList()
          break
        case '2':
          _this.currentDicTypeCode = _this.dicTypeCodeLists.ChargeCategory
          _this.getFeeList()
          break
        case '3':
          _this.currentDicTypeCode = _this.dicTypeCodeLists.InspectCategory
          _this.getFeeList()
          break
      }
    },
    addgh () {
      let _this = this
      _this.ghItem = {}
      _this.ghItem.feeCategory = _this.dicTypeCodeLists.ApplyCategory
      this.ghDialogVisible = true
      _this.getDicItemDicTypeCode(_this.dicTypeCodeLists.ApplyCategory)
    },
    addfjf () {
      let _this = this
      _this.fjfItem = {}
      _this.fjfItem.feeCategory = _this.dicTypeCodeLists.ChargeCategory
      this.fjfDialogVisible = true
      _this.getDicItemDicTypeCode(_this.dicTypeCodeLists.ChargeCategory)
    },
    addjcf () {
      let _this = this
      _this.jcfItem = {}
      _this.jcfItem.feeCategory = _this.dicTypeCodeLists.InspectCategory
      this.jcfDialogVisible = true
      _this.getDicItemDicTypeCode(_this.dicTypeCodeLists.InspectCategory)
    },
    editGhf (row) {
      this.ghItem = {}
      this.ghItem = row
      this.edghDialogVisible = true
      this.getDicItemDicTypeCode(this.dicTypeCodeLists.ApplyCategory)
    },
    editFjf (row) {
      this.fjfItem = {}
      this.fjfItem = row
      this.edfjfDialogVisible = true
      this.getDicItemDicTypeCode(this.dicTypeCodeLists.ChargeCategory)
    },
    editJcf (row) {
      this.jcfItem = {}
      this.jcfItem = row
      this.edjcfDialogVisible = true
      this.getDicItemDicTypeCode(this.dicTypeCodeLists.InspectCategory)
    },
    delGhf (row) { this.deltelRow(row) },
    delFjf (row) { this.deltelRow(row) },
    delJcf (row) { this.deltelRow(row) },
    getFeeList () {
      this.$api.getFeeList({
        feeCategory: this.currentDicTypeCode,
        categoryName: this.searchval
      }).then(res => {
        if (res.success) {
          this.tableData = res.result
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => console.log(error))
    },
    getDicItemDicTypeCode (dicTypeCode) {
      this.$api.dicItemDicTypeCode({ dicTypeCode: dicTypeCode }).then(res => {
        if (res.success) {
          this.ItemLists = res.result
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => console.log(error))
    },
    feeSave () {
      let _this = this
      let json = {}
      let type = 0
      // 挂号类型
      if (_this.currentDicTypeCode == 'ApplyCategory') {
        if (_this.ghItem.category === '' || _this.ghItem.category == undefined) {
          this.$message.error('请填写费用名称！')
          return false
        }
        if (_this.ghItem.itemPrice === '' || _this.ghItem.itemPrice == undefined) {
          this.$message.error('请填写金额！')
          return false
        }
        if (_this.ghItem.id) {
          type = 1
        } else {
          type = 2
        }
        json = {
          feeCategory: _this.ghItem.feeCategory,
          category: _this.ghItem.category,
          id: _this.ghItem.id ? _this.ghItem.id : null,
          itemPrice: _this.ghItem.itemPrice
        }
        _this.ghDialogVisible = false
        _this.edghDialogVisible = false
      }
      // 附加费用类型
      if (_this.currentDicTypeCode === 'ChargeCategory') {
        if (_this.fjfItem.category === '' || _this.fjfItem.category == undefined) {
          this.$message.error('请填写费用名称！')
          return false
        }
        if (_this.fjfItem.itemPrice === '' || _this.fjfItem.itemPrice == undefined) {
          this.$message.error('请填写金额！')
          return false
        }
        if (_this.fjfItem.id) {
          type = 1
        } else {
          type = 2
        }
        json = {
          feeCategory: _this.fjfItem.feeCategory,
          category: _this.fjfItem.category,
          id: _this.fjfItem.id ? _this.fjfItem.id : null,
          itemPrice: _this.fjfItem.itemPrice
        }

        _this.fjfDialogVisible = false
        _this.edfjfDialogVisible = false
      }
      // 检查单类型
      if (_this.currentDicTypeCode === 'InspectCategory') {
        if (_this.jcfItem.category === '' || _this.jcfItem.category == undefined) {
          this.$message.error('请填写费用名称！')
          return false
        }
        if (_this.jcfItem.itemPrice === '' || _this.jcfItem.itemPrice == undefined) {
          this.$message.error('请填写金额！')
          return false
        }
        if (_this.jcfItem.id) {
          type = 1
        } else {
          type = 2
        }
        json = {
          feeCategory: _this.jcfItem.feeCategory,
          category: _this.jcfItem.category,
          id: _this.jcfItem.id ? _this.jcfItem.id : null,
          itemPrice: _this.jcfItem.itemPrice
        }
        _this.jcfDialogVisible = false
        _this.edjcfDialogVisible = false
      }
      _this.$api.feeSave(json)
        .then(res => {
          if (res.success && type === 2) {
            _this.$message.success('添加成功!')
          } else if (res.success && type === 1) {
            _this.$message.success('修改成功!')
          } else {
            this.$message.error(res.msg)
          }
          _this.getFeeList()
        }).catch(error => console.log(error))
    },
    deltelRow (row) {
      let _this = this
      _this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.feeDel({ id: row.id })
          .then(res => {
            if (res.success) {
              _this.getFeeList()
              _this.$message.success('删除成功!')
            } else {
              this.$message.error(res.msg)
            }
          }).catch(error => console.log(error))
      })
    },
    addfjfChargeCategory () {
      this.fjfdicItemName = ''
      this.fjfChargeCategoryDialogVisible = true
    },
    addfjfChargeCategoryData () {
      if (this.fjfdicItemName == '' || this.fjfdicItemName.replace(/(^\s*)|(\s*$)/g, '') == '') {
        this.$message.error('字典名称不能为空')
        return
      }
      this.$api.addDic({
        dicItemName: this.fjfdicItemName.replace(/(^\s*)|(\s*$)/g, ''),
        dicTypeCode: this.fjfdicTypeCode
      }).then(res => {
        if (res.success) {
          this.getDicItemDicTypeCode(this.dicTypeCodeLists.ChargeCategory)
          this.$message.success('添加成功!')
          this.fjfChargeCategoryDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    }
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

.width100
  width 100%

</style>

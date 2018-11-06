<template lang="pug">
  .pagecontent
    .myrow       
      ul.tabs
        li(v-for="item, index in tabTitle", :key="index", @click="handValue(item)", :class="[item.dicTypeCode === tabltType ? 'active' : '']") {{item.dicTypeName}}
      .tablebody
        .right
          el-button(size='small', icon="el-icon-plus", @click='addzhenduan') 新增
        el-table.table(
          stripe,
          border,
          :data='tableData',
          size='medium',
          style="width: 100%"
        )
          el-table-column(label="序号", type="index", width="80")    
          el-table-column(prop='dicItemName', label="字典项名称")
          el-table-column(prop='startTime', label="开始时间", v-if="tabltType == 'Schedule'")
          el-table-column(prop='endTime', label="结束时间", v-if="tabltType == 'Schedule'")
          el-table-column(prop='dicTypeCode', label="字典类型编码")
          el-table-column(label="操作", width='130px')
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click='getRowData(scope.row)') 编辑
              el-button(type="danger", size='mini', @click='removeRowData(scope.row)') 删除

      el-dialog(
        :visible.sync="JyDialogVisible",
        width="450px",
        center)
        .dialogtitle(slot='title') 添加
        .kucun
          el-form(label-width="100px", label-position="left")
            el-form-item(label="字典项名称")
              el-input(size='medium', placeholder='请输入内容', type="input", v-model="dicItemName")
            el-form-item(label="字典类型编码")
              el-input(size='medium', placeholder='请输入内容', type="input", v-model="dicTypeCode", :disabled="true") 
            el-form-item(label="开始时间", v-if="dicTypeCode == 'Schedule'")
              el-time-picker.flex(size='medium', placeholder="请选择开始时间", v-model='startTime', value-format="HH:mm", :picker-options={format: 'HH:mm'})
            el-form-item(label="结束时间", v-if="dicTypeCode == 'Schedule'")
              el-time-picker.flex(size='medium', placeholder="请选择结束时间", v-model='endTime', value-format="HH:mm", :picker-options={format: 'HH:mm'})
          .bigbtn(@click="addData") 确认添加
          
      el-dialog(
        :visible.sync="edJyDialogVisible",
        width="450px",
        center)
        .dialogtitle(slot='title') 编辑
        .kucun
          el-form(label-width="100px", label-position="left")
            el-form-item(label="字典编码")
              el-input(size='medium', placeholder='请输入内容', type="input", v-model="dicItemCode", :disabled="true")
            el-form-item(label="字典项名称")
              el-input(size='medium', placeholder='请输入内容', type="input", v-model="dicItemName") 
            el-form-item(label="字典类型编码")
              el-input(size='medium', placeholder='请输入内容', type="input", v-model="dicTypeCode", :disabled="true")
            el-form-item(label="开始时间", v-if="dicTypeCode == 'Schedule'")
              el-time-picker.flex(size='medium', placeholder="请选择开始时间", v-model='startTime', value-format="HH:mm", :picker-options={format: 'HH:mm'})
            el-form-item(label="结束时间", v-if="dicTypeCode == 'Schedule'")
              el-time-picker.flex(size='medium', placeholder="请选择结束时间", v-model='endTime', value-format="HH:mm", :picker-options={format: 'HH:mm'})
              //el-select(placeholder="请选择", v-model="dep" size='large', @change="handValue",clearable).select
                el-option(:value='item.dicTypeCode', :label='item.dicTypeName', v-for="item, index in tabTitle", :key='index') 
          .bigbtn(@click="saveDicItem") 确认保存
</template>

<script>
export default {
  data () {
    return {
      isShow: true,
      JyDialogVisible: false,
      edJyDialogVisible: false,
      activeName: '1',
      searchval: '',
      select: '',
      danwei: '',
      tableData: [],
      tabTitle: [],
      dep: '',
      dicItemName: '',
      dicItemCode: '',
      dicTypeCode: '',
      totalPage: 0,
      currentPage: 0,
      pageSize: 20,
      startTime: '',
      endTime: '',
      tabltType: ''
    }
  },
  created () {
    this.getListData()
  },
  methods: {
    getListData () {
      this.$api.dicTypeData()
        .then(res => {
          if (res.success) {
            this.tabTitle = res.result
            this.editableActive = res.result[0].dicTypeCode
            this.tabltType = res.result[0].dicTypeCode
            var p = {
              dicTypeCode: this.editableActive
            }
            this.getTypeCode(p)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    getTypeCode (p) {
      let _this = this
      _this.$api.dicTypeCode(p)
        .then(res => {
          if (res.success) {
            _this.tableData = res.result
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    handValue (item) {
      this.tabltType = item.dicTypeCode
      let p = {
        dicTypeCode: item.dicTypeCode
      }
      this.getTypeCode(p)
      this.editableActive = item.dicTypeCode
    },

    addzhenduan () {
      this.JyDialogVisible = true
      this.dicItemName = ' '
      this.startTime = ''
      this.endTime = ''
      this.dicTypeCode = this.editableActive
    },
    addData () {
      let _this = this
      if (_this.dicItemName == '' || _this.dicItemName.replace(/(^\s*)|(\s*$)/g, '') == '') {
        _this.$message.error('字典名称不能为空')
        return
      }
      if (this.dicTypeCode == 'Schedule' && !this.startTime) {
        this.$message.error('开始时间不能为空')
        return
      }
      if (this.dicTypeCode == 'Schedule' && !this.endTime) {
        this.$message.error('结束时间不能为空')
        return
      }
      _this.$api.addDic({
        dicItemName: _this.dicItemName.replace(/(^\s*)|(\s*$)/g, ''),
        dicTypeCode: _this.dicTypeCode,
        startTime: _this.startTime ? _this.startTime : '',
        endTime: _this.endTime ? _this.endTime : ''
      })
      .then(res => {
        if (res.success) {
          _this.$message.success('添加成功')
          _this.getTypeCode({dicTypeCode: _this.dicTypeCode})
          switch (this.dicTypeCode) {
            case 'DrugClassification': sessionStorage.removeItem('DrugClassification')
              break
            case 'OrgCategory': sessionStorage.removeItem('OrgCategory')
              break
            case 'OrgLevel': sessionStorage.removeItem('OrgLevel')
              break
            case 'Prescription': sessionStorage.removeItem('Prescription')
              break
            case 'Unit': sessionStorage.removeItem('Unit')
              break
            case 'Useage': sessionStorage.removeItem('Useage')
              break
          }
          _this.JyDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => {
        console.log(error)
        _this.$message.error('添加失败')
      })
    },
    saveDicItem () {
      if (this.dicItemName == '' || this.dicItemName.replace(/(^\s*)|(\s*$)/g, '') == '') {
        this.$message.error('字典名称不能为空')
        return
      }
      if (this.dicTypeCode == 'Schedule' && !this.startTime) {
        this.$message.error('开始时间不能为空')
        return
      }
      if (this.dicTypeCode == 'Schedule' && !this.endTime) {
        this.$message.error('结束时间不能为空')
        return
      }
      let json = {
        dicItemCode: this.dicItemCode,
        dicItemName: this.dicItemName.replace(/(^\s*)|(\s*$)/g, ''),
        dicTypeCode: this.dicTypeCode
      }
      if (this.dicTypeCode == 'Schedule') {
        json.startTime = this.startTime ? this.startTime : null
        json.endTime = this.endTime ? this.endTime : null
      }
      this.$api.saveDic(json)
        .then(res => {
          if (res.success) {
            this.$message.success('修改成功!')
            this.getTypeCode({dicTypeCode: this.dicTypeCode})
            console.log(this.dicTypeCode)
            switch (this.dicTypeCode) {
              case 'DrugClassification': sessionStorage.removeItem('DrugClassification')
                break
              case 'OrgCategory': sessionStorage.removeItem('OrgCategory')
                break
              case 'OrgLevel': sessionStorage.removeItem('OrgLevel')
                break
              case 'Prescription': sessionStorage.removeItem('Prescription')
                break
              case 'Unit': sessionStorage.removeItem('Unit')
                break
              case 'Useage': sessionStorage.removeItem('Useage')
                break
            }
            this.edJyDialogVisible = false
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message.error('修改失败')
        })
    },
    getRowData (res) {
      this.edJyDialogVisible = true
      this.dicItemCode = res.dicItemCode
      this.dicItemName = res.dicItemName
      this.dicTypeCode = res.dicTypeCode
      this.startTime = res.startTime
      this.endTime = res.endTime
    },
    removeRowData (res) {
      let _this = this
      let dicCode = res.dicTypeCode
      _this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        _this.$api.removeDic({
          dicItemCode: res.dicItemCode,
          dicTypeCode: res.dicTypeCode
        })
        .then(res => {
          if (res.success) {
            _this.$message.success('删除成功!')
            _this.getTypeCode({dicTypeCode: dicCode})
            switch (dicCode) {
              case 'DrugClassification': sessionStorage.removeItem('DrugClassification')
                break
              case 'OrgCategory': sessionStorage.removeItem('OrgCategory')
                break
              case 'OrgLevel': sessionStorage.removeItem('OrgLevel')
                break
              case 'Prescription': sessionStorage.removeItem('Prescription')
                break
              case 'Unit': sessionStorage.removeItem('Unit')
                break
              case 'Useage': sessionStorage.removeItem('Useage')
                break
            }
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
      })
      .catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.soltmini
  padding-left 47px
  .line
    display flex
    flex-flow row nowrap
    &:not(:last-child)
      border-bottom 1px solid $elSilver
    .item
      padding 8px 10px
      border-left 1px solid $elSilver
      flex 1
      display flex
      align-items center
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

.pagination
  margin-top 20px
  text-align center

.myrow
  background $White
  padding 20px 15px
  position relative
  height calc(100vh - 170px) 
  .tabs
    box-sizing border-box
    position absolute
    left 0
    top 0
    overflow-y auto
    width 150px
    height 100%
    border-right 1px solid $lSilver
    padding 10px 0
    li
      text-align right
      padding 10px 0
      padding-right 20px
      cursor pointer
      color $Black   
      &.active, &:hover
        color $Blue
        border-right 2px solid $Blue

  .tablebody
    box-sizing border-box
    position absolute
    left 165px
    top 0
    width calc(100% - 165px)
    padding-right 15px
    height 100%
    overflow-y auto
    .right
      text-align right
      margin-top 20px
    .table
      margin-top 20px
.select
  width 100%
.pagination
  text-align center
  margin-top 20px
.flex
  width 100%
.tablebody::-webkit-scrollbar 
  width 8px
  height 8px
  background-color $White

.tablebody::-webkit-scrollbar-track 
  -webkit-box-shadow inset 0 0 6px $White
          box-shadow inset 0 0 6px $White
  border-radius 5px
  background-color $White

.tablebody::-webkit-scrollbar-thumb 
  -webkit-box-shadow inset 0 0 6px #e5e5e5
          box-shadow inset 0 0 6px #e5e5e5
  border-radius 5px
  background-color rgba(128,128,128,0.5)

.tablebody::-webkit-scrollbar-thumb:hover
  background-color rgba(128,128,128,1)

.tabs::-webkit-scrollbar 
  display none
</style>

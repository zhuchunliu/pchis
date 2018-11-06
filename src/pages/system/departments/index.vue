<template lang="pug">
  .pagecontent
    .myrow
      el-row
        //- el-col(:span="4")
          //- el-input(placeholder="请输入内容", size='small', v-model="searchval")
          //-   el-button(slot="append", icon="el-icon-search")
        el-col.right(:span="24")
          el-button(size='small', icon="el-icon-plus", @click='showtianjia') 新增科室

      el-table.table(:data="tableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
        el-table-column(prop="dept", label="科室名称")
        //- el-table-column(label="科室编号")
        el-table-column(prop="createUserName", label="创建人")
        el-table-column(label="优势科室")
          template(slot-scope="scope")
            span(v-if="scope.row.superiorityFlag == 1") 是
        el-table-column(prop="createAt", label="创建日期")
        el-table-column(label="操作", width='160', align='center')
          template(slot-scope="scope")
            el-button(size='mini', type="primary", @click='showedit(scope.row)') 编辑
            el-button(size='mini', type="danger", @click='deletes(scope.row)') 删除

    el-dialog(
      :visible.sync="tianjiaDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 添加科室
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="科室名")
            el-input(size='medium', placeholder='请填写科室名称',v-model='DeptMo.dept')
          el-form-item(label="优势科室")
            el-select(size='medium', v-model="DeptMo.superiorityFlag")
              el-option(label='否', :value=0)
              el-option(label='是', :value=1)
        .bigbtn(@click="save") 确认添加

    el-dialog(
      :visible.sync="editDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 编辑科室
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="科室名")
            el-input(size='medium', placeholder='请填写科室名称',v-model='DeptMo.dept')
          el-form-item(label="优势科室")
            el-select(size='medium', v-model="DeptMo.superiorityFlag")
              el-option(label='否', :value=0)
              el-option(label='是', :value=1)
        .bigbtn(@click="save") 确认保存
</template>

<script>
import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      searchval: '',
      tianjiaDialogVisible: false,
      editDialogVisible: false,
      user: '',
      select: '',
      tableData: [],
      editData: {},
      DeptMo: {}
    }
  },
  created () {
    let _this = this
    _this.getDeptList()
  },
  methods: {
    getDeptList () {
      this.$api.getDeptList()
        .then(res => {
          if (res.success) {
            this.tableData = res.result
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    showtianjia () {
      let _this = this
      _this.DeptMo = {
        superiorityFlag: 0
      }
      this.tianjiaDialogVisible = true
    },
    showedit (data) {
      let _this = this
      _this.DeptMo = JSON.parse(JSON.stringify(data))
      this.editDialogVisible = true
    },
    save () {
      let _this = this
      if (regExp.trim(_this.DeptMo.dept) == '') {
        this.$message.error('请填写科室名！')
        return false
      }
      let type = 0
      if (_this.editDialogVisible) {
        type = 1
      }
      if (_this.tianjiaDialogVisible) {
        type = 2
      }
      _this.tianjiaDialogVisible = false
      _this.editDialogVisible = false
      this.$api.deptsave(_this.DeptMo)
        .then(res => {
          if (res.success) {
            _this.getDeptList()
            if (type === 1) {
              _this.$message.success('修改成功!')
            }
            if (type === 2) {
              _this.$message.success('添加成功!')
            }
          } else {
            _this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    deletes (row) {
      let _this = this
      _this.$confirm('确定删除：' + row.dept + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.deptDel({id: row.id})
          .then(res => {
            if (res.success) {
              _this.getDeptList()
              _this.$message.success('删除成功!')
            } else {
              _this.$message.error(res.msg)
            }
          }).catch(error => console.log(error))
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.myrow
  background $White
  padding 20px 15px
.el-col.right
  text-align right
.table
  margin-top 20px
.tianjiaDoctor
  .myform
    .el-select, .el-date-editor
      width 100%
  .beizhu
    text-align center
    color $elBlack
    font-size 14px
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

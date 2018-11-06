<template lang="pug">
  .pagecontent
    .myrow
      el-row.right(:span="20")
        el-button(size='small', @click='showjinyong')  已禁用（{{num}}人）
        el-button(size='small', icon="el-icon-plus", @click='addquanxianModel') 添加职务
      el-table.table(:data="tableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
        el-table-column(label="序号", type="index", width="80")
        el-table-column(label="职位名称")
          template(slot-scope="scope")
            span {{scope.row.roleName}}
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(size='mini', type="primary", @click='showquanxian(scope.row)') 查看权限
            el-button(size='mini', @click='roleDisable("1", scope.$index, scope.row)') 禁用

    el-dialog(
      :visible.sync="quanxianDialogVisible",
      width="800px",
      :before-close="QXClose",
      center)
      .dialogtitle(slot='title') 权限详情
      el-input(placeholder="请输入职务名称", size='small', v-model="addquanxian.roleName")
      .quanxianBody.table(v-for="item,index in getData")
        .title {{item.perName}}
        .list
          el-checkbox-group(v-model="checkList", @change="handleCheckedCitiesChange")
            el-checkbox(v-for="(role,index) in item.list", :label="role.id", :key="role.id") {{role.perName}}
      el-button.btn-100(size='medium', type="primary", @click="roleSave") 确认保存    

    el-dialog(
      :visible.sync="jinyongDialogVisible",
      width="800px",
      :before-close="handleClose",
      center)
      .dialogtitle(slot='title') 已禁用
      .quanxianBody
        el-table.table(:data="QXJYtableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(label="序号", type="index", width="80")
          el-table-column(label="职位名称")
            template(slot-scope="scope")
              span {{scope.row.roleName}}
          el-table-column(label="状态", width='80', align='center')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", @click='roleDisable("2", scope.$index, scope.row)') 恢复
</template>
<script>
import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      tableData: [],
      quanxianDialogVisible: false,
      jinyongDialogVisible: false,
      checkList: [],
      num: 0,
      getData: [],
      roleidSave: 0,
      roleIds: [],
      addquanxian: {},
      QXJYtableData: []
    }
  },
  created () {
    this.getRoleData()
  },
  methods: {
    addquanxianModel () {
      let _this = this
      _this.addquanxian = {}
      _this.$api.getRolePermission()
        .then(function (res) {
          console.log(res)
          if (res.success) {
            _this.getData = res.result
            _this.quanxianDialogVisible = true
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    showquanxian (item) {
      let _this = this
      localStorage.removeItem('setcheckList')
      _this.addquanxian = {}
      _this.addquanxian.roleName = item.roleName
      _this.addquanxian.id = item.id
      var p = {
        rid: item.id
      }
      _this.quanxianDialogVisible = true
      _this.$api.getRolePermission(p)
        .then(function (res) {
          console.log(res)
          if (res.success) {
            _this.getData = res.result
            res.result.map(function (val) {
              val.list.map(function (v) {
                if (v.isChecked == 1) {
                  _this.checkList.push(v.id)
                  localStorage.setItem('setcheckList', _this.checkList)
                }
              })
            })
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    showjinyong () {
      let _this = this
      _this.jinyongDialogVisible = true
      _this.getQXJYRoleData()
    },
    getDeptList () {
      this.$api.getDeptList()
        .then(res => {
          if (res.success) {
            this.deptList = res.result
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    QXClose (done) {
      let _this = this
      _this.checkList = []
      done()
    },
    // 权限管理
    getRoleData () {
      let _this = this
      _this.$api.getRole({
        idValid: 1
      }).then(function (res) {
        if (res.success) {
          _this.tableData = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    getQXJYRoleData () {
      let _this = this
      _this.$api.getRole({
        idValid: 0
      }).then(function (res) {
        if (res.success) {
          _this.QXJYtableData = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    getDisable () {
      let _this = this
      _this.$api.getRoleDisable()
        .then(function (res) {
          if (res.success) {
            _this.num = res.result.num
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    roleDisable (type, index, item) {
      let _this = this
      console.log(item)
      _this.$api.getDisable({id: item.id})
        .then(function (res) {
          if (res.success) {
            if (type == '1') {
              _this.$message.success('状态修改成功!')
              _this.getRoleData()
              _this.getDisable()
            }
            if (type == '2') {
              _this.QXJYtableData.splice(index, 1)
              _this.getRoleData()
              _this.getDisable()
              _this.$message.success('状态修改成功!')
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleClose () {
      let _this = this
      _this.jinyongDialogVisible = false
    },
    roleSave () {
      let _this = this
      if (regExp.trim(_this.addquanxian.roleName) == '') {
        this.$message.error('请填写职务名称！')
        return false
      }
      _this.quanxianDialogVisible = false
      let setcheckList = localStorage.getItem('setcheckList')
      console.log(111)
      console.log(_this.roleidSave)
      if (setcheckList) {
        if (_this.roleidSave == 0) {
          _this.roleidSave = setcheckList
        }
      }
      _this.$api.getRoleSave({
        id: _this.addquanxian.id,
        pids: _this.roleidSave,
        roleName: _this.addquanxian.roleName,
        roleDesc: ''
      })
        .then(function (res) {
          if (res.success) {
            _this.checkList = []
            _this.getRoleData()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleCheckedCitiesChange (key) {
      console.log(key)
      let _this = this
      _this.roleidSave = key.toString()
      console.log(_this.roleidSave)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.myrow
  background $White
  padding 20px 15px
.quanxianBody
  .title
    &:not(:first-child)
      font-size 14px
      margin-top 20px
  .list
    margin 10px 0
.right
  text-align right 
.table
  margin-top 20px
.pagination
  margin-top 20px
  text-align center
.tianjiaDoctor
  .myform
    width 96%
    .el-select, .el-date-editor
      width 100%
  .beizhu
    text-align center
    color $elBlack
    font-size 12px
    margin 20px 0
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
  .addImg
    width 120px
    height 120px
    border 1px solid #e6e6e6
    margin 30px auto 
    overflow hidden
    img
      width 100%
      height 100%
  .bg-right
    border-right 1px solid #e6e6e6
  .bg-bottom
    border-bottom 1px solid #e6e6e6
.ax
  .el-dialog__body
    background-color bule
.btn-100
  width 100%    
.inputfile
  position absolute
  cursor pointer
  overflow hidden
  right 0
  top 0
  opacity 0
.file
  width 100px
  padding 3px 0
  margin 0 auto 
  line-height 20px
  text-align center
  position relative
  border 1px solid #dcdfe6
  border-radius 4px
  color #606266
  cursor pointer
  &:hover
    border 1px solid #dcdfe6
    background #dcdfe6
.name
  font-size 12px
  line-height 1.5
  padding 15px 0
  text-align center
  color $elBlack
</style>

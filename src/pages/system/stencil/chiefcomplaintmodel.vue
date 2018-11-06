<template lang="pug">
  div
    el-row.myrow
      el-col(:span="4")
        el-input(placeholder="请输入模板名称", size='small', v-model="ZSSearch.name", @keyup.enter.native='getTplChiefComplaintListSearch')
          el-button(slot="append", icon="el-icon-search", @click="getTplChiefComplaintListSearch")   
      .right(:span="11")
        el-button(size='small', @click="ZSshowjy") 已禁用（{{ZSForbiddenNum}}）
        el-button(size='small', icon="el-icon-plus", @click="showZStianjia") 新增模板 
    el-table.table(
      :data="ZSTableData",
      stripe,
      border,
      size='medium',
      style="width: 100%"
    )
      el-table-column(prop="tplName", label="模板名称")
      el-table-column(label="模板类型")
        template(slot-scope="scope")
          span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
      el-table-column(prop="createUserName", label="创建人")
      el-table-column(prop="chiefComplaint", label="诊断详情")
      el-table-column(label="状态", width='180')
        template(slot-scope="scope")
          el-button(size='mini', type="primary", v-if="scope.row.isSelf=='1'", @click='ZSShowEdit(scope.row)') 编辑
          el-button(size='mini', v-if="scope.row.isSelf=='1'", @click="TplChiefComplaintSwitch('1', scope.$index, scope.row.id)") {{scope.row.isValid == '1' ? '禁用' : '启用'}}
    .pagination
      el-pagination(
        background,
        :page-size="pageSize",
        layout="total, prev, pager, next, jumper",
        :total="ZSTotal",
        :current-page.sync="ZSPageNum",
        @current-change="getTplChiefComplaintListPage")

    el-dialog(
      :visible.sync="ZStianjiaDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') {{newAddZSModel.id ? '编辑' : '新增'}}主诉模板
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="模板名称")
            el-input(size='medium', placeholder='请填写模板名称', v-model="newAddZSModel.tplName", :maxlength="50")
            .num-text {{newAddZSModel.tplName.length}}/50
          el-form-item(label="模板类型")
            el-select(size='medium', v-model="newAddZSModel.isPublic", placeholder="请选择模板类型")
              el-option(label='公有', value="1")
              el-option(label='私有', value="0")
          el-form-item(label="主诉详情")
            el-input(size='medium', type="textarea", placeholder='请填写模板详情', v-model="newAddZSModel.chiefComplaint", :maxlength="300")
            .num-text {{newAddZSModel.chiefComplaint.length}}/300
        el-button.bigbtn(type="primary", @click="TplChiefComplaintSave", :disabled="TplChiefComplaintSaveLock") 确定{{newAddZSModel.id ? '修改' : '添加'}}

    el-dialog(
      :visible.sync="ZSJYDialogVisible",
      width="900px",
      :before-close="ZSJYClose",
      center)
      .dialogtitle(slot='title') 已禁用
      .quanxianBody
        el-table(:data="ZSJYTableData",
            stripe,
            border,            
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="createAt", label="创建时间")
          el-table-column(label="状态", width='140')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isValid == '0'", @click="TplChiefComplaintSwitch('2', scope.$index, scope.row.id)") 恢复
              el-button(size='mini', v-if="scope.row.isValid == '1'" disabled) 已恢复
              el-button(size='mini', type="danger", v-if="scope.row.isValid != '1'", @click="TplChiefComplaintDel(scope.row.id)") 删除
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="ZSJYTotal",
            :current-page.sync="ZSJYPageNum",
            @current-change="getZSJYListsPage")
</template>
<script>
import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      ZSSearch: {
        name: '',
        isPublic: '',
        isValid: '1'
      },
      ZSTableData: [],
      ZSForbiddenNum: 0,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      ZSTotal: 0,
      ZSPageNum: 1,
      ZStianjiaDialogVisible: false,
      newAddZSModel: {
        id: '',
        tplName: '',
        isPublic: '1',
        chiefComplaint: ''
      },
      ZSJYTableData: [],
      ZSJYDialogVisible: false,
      ZSJYTotal: 0,
      ZSJYPageNum: 1,
      TplChiefComplaintSaveLock: false
    }
  },
  methods: {
    getTplChiefComplaintListSearch () {
      this.ZSPageNum = 1
      this.getTplChiefComplaintList()
    },
    getTplChiefComplaintListPage (val) {
      this.ZSPageNum = val
      this.getTplChiefComplaintList()
    },
    getTplChiefComplaintList () {
      this.$api.getTplChiefComplaintList({
        pageNum: this.ZSPageNum,
        pageSize: this.pageSize,
        param: this.ZSSearch
      }).then(res => {
        if (res.success) {
          this.getTplChiefComplaintDisableNum()
          this.ZSTableData = res.result.data
          this.ZSTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getTplChiefComplaintDisableNum () {
      this.$api.getTplChiefComplaintDisableNum()
        .then(res => {
          if (res.success) {
            this.ZSForbiddenNum = res.result.num
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    showZStianjia () {
      this.TplChiefComplaintSaveLock = false
      this.newAddZSModel = {
        id: '',
        tplName: '',
        isPublic: '1',
        chiefComplaint: ''
      }
      this.ZStianjiaDialogVisible = true
    },
    ZSShowEdit (row) {
      this.TplChiefComplaintSaveLock = false
      this.newAddZSModel = {
        id: row.id,
        tplName: row.tplName,
        isPublic: row.isPublic,
        chiefComplaint: row.chiefComplaint
      }
      this.ZStianjiaDialogVisible = true
    },
    TplChiefComplaintSave () {
      if (regExp.trim(this.newAddZSModel.tplName) === '') {
        this.$message.warning('模版名称不能为空!')
        return
      }
      if (regExp.trim(this.newAddZSModel.chiefComplaint) === '') {
        this.$message.warning('主诉详情不能为空!')
        return
      }
      this.TplChiefComplaintSaveLock = true
      setTimeout(() => {
        this.$api.TplChiefComplaintSave({
          id: this.newAddZSModel.id ? this.newAddZSModel.id : null,
          isPublic: this.newAddZSModel.isPublic ? this.newAddZSModel.isPublic : '',
          tplName: this.newAddZSModel.tplName ? this.newAddZSModel.tplName : '',
          chiefComplaint: this.newAddZSModel.chiefComplaint ? this.newAddZSModel.chiefComplaint : ''
        }).then(res => {
          if (res.success) {
            if (this.newAddZSModel.id) {
              this.$message.success('修改成功!')
            } else {
              this.$message.success('新增成功!')
              this.ZSPageNum = 1
            }
            this.ZStianjiaDialogVisible = false
            this.getTplChiefComplaintList()
          } else {
            this.TplChiefComplaintSaveLock = false
            this.$message.error(res.msg)
          }
        })
      }, 100)
    },
    // 禁用/启用诊断模板
    TplChiefComplaintSwitch (type, index, id) {
      this.$api.TplChiefComplaintSwitch({'id': id})
        .then(res => {
          if (res.success) {
            if (type == '1') {
              this.getTplChiefComplaintList()
              this.$message.success('状态修改成功!')
            }
            if (type == '2') {
              this.ZSJYTableData[index].isValid = this.ZSJYTableData[index].isValid == '1' ? '0' : '1'
              this.$message.success('状态修改成功!')
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    ZSJYClose (done) {
      this.getTplChiefComplaintList()
      done()
    },
    ZSshowjy () {
      this.ZSJYpageNum = 1
      this.getZSJYLists()
    },
    getZSJYListsPage (val) {
      this.ZSJYPageNum = val
      this.getZSJYLists()
    },
    getZSJYLists () {
      this.$api.getTplChiefComplaintList({
        pageNum: this.ZSJYPageNum,
        pageSize: this.pageSize,
        param: {'isValid': '0'}
      }).then(res => {
        if (res.success) {
          this.ZSJYTableData = res.result.data
          this.ZSJYTotal = res.result.total
          this.ZSJYDialogVisible = true
          this.TplChiefComplaintSaveLock = false
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    TplChiefComplaintDel (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.TplChiefComplaintDel({id: id})
          .then(res => {
            if (res.success) {
              this.$message.success('删除成功!')
              this.getZSJYLists()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(error => console.log(error))
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.pagination
  margin-top 20px
  text-align center
.table
  margin-top 20px
.myrow
  .el-col
    &:not(:first-child)
      margin-left 15px
  .right
    text-align right 
.tianjiaDoctor
  .myform
    width 96%
    .el-select, .el-date-editor
      width 100%
  .beizhu
    text-align center
    color $elBlack
    font-size 12px
  .bigbtn
    width 100%
.num-text
  position relative
  top -10px
  height 25px
  font-size 10px
  text-align right
</style>

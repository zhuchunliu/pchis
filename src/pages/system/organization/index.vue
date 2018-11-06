<template lang="pug">
  .pagecontent
    .myrow
      el-row
        el-col(:span="5")
          el-input(placeholder="请输入机构名称", size='small', clearable, v-model="searchval")
            el-button(slot="append", icon="el-icon-search", @click="getOrgList")
        el-col.right(:span="19")
          el-button(size='small', icon="el-icon-plus", @click="addOrg") 新增机构

      el-table.table(:data="tableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
        el-table-column(prop="orgName", label="机构名称")
        el-table-column(prop="categoryStr", label="机构类型")
        el-table-column(prop="levelStr", label="机构等级")
        el-table-column(prop="loginName", label="登录名")
        el-table-column(prop="linkMan", label="联系人")
        el-table-column(prop="mobile", label="联系人手机")
        el-table-column(label="操作", width='140', align='center')
          template(slot-scope="scope")
            el-button(size='mini', type="primary", @click="editOrg(scope.row)") 编辑
            el-button(size='mini', type="danger", @click="orgdel(scope.row)") 删除

      .pagination
        el-pagination(
          background,
          :page-size="pageSize",
          layout="total, prev, pager, next, jumper",
          :total="pageTotal",
          :current-page.sync="pageNum",
          @current-change="getOrgListPage")

    el-dialog(
      :visible.sync="dialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') {{dialogName}}机构
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item.min(label="登录名", v-if='!dialogData.orgCode')
            el-input(size='medium', placeholder='请填写字母加数字组合，并不少于6位', v-model="dialogData.loginName", @blur="loginNameValidte(dialogData.loginName)")
            b.beizhu 注: 一经填写，无法修改
          el-form-item(label="机构名称")
            el-input(size='medium', placeholder='请填写机构名称', v-model="dialogData.orgName")
          el-form-item(label="机构类型")
            el-select(size='medium', v-model="dialogData.category", placeholder="请选择")
              el-option(v-for="item, index in OrgCategoryList", :key='index', :value='item.dicItemCode', :label='item.dicItemName') 
          el-form-item(label="机构等级")
            el-select(size='medium', v-model="dialogData.level", placeholder="请选择")
              el-option(v-for="item, index in OrgLevelList", :key='index', :value='item.dicItemCode', :label='item.dicItemName') 
          el-form-item(label="联系人")
            el-input(size='medium', placeholder='请填写联系人', v-model="dialogData.linkMan")
          el-form-item(label="手机号")
            el-input(size='medium', placeholder='请填写手机号', v-model="dialogData.mobile", type="number")
          el-form-item(label="机构简介")
            el-input(type="textarea", :rows="2", placeholder="请填写", v-model="dialogData.introduction") 
        .bigbtn(@click="save") 确认添加
</template>

<script>
import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      searchval: '',
      tableData: [],
      dialogVisible: false,
      dialogData: {},
      dialogName: '',
      OrgLevel: this.$dicTypeCode.OrgLevel,
      OrgLevelList: [],
      OrgCategory: this.$dicTypeCode.OrgCategory,
      OrgCategoryList: [],
      pageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      pageTotal: 0
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    getOrgListPage (val) {
      this.pageNum = val
      this.getOrgList()
    },
    getOrgList () {
      this.$api.getOrgList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: this.searchval
      }).then(res => {
        if (res.success) {
          this.tableData = res.result.data
          this.pageTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addOrg () {
      this.dialogName = '新增'
      if (sessionStorage.getItem('OrgLevel')) {
        this.OrgLevelList = JSON.parse(sessionStorage.getItem('OrgLevel'))
      } else {
        this.dicItemDicTypeCode(this.OrgLevel)
      }
      if (sessionStorage.getItem('OrgCategory')) {
        this.OrgCategoryList = JSON.parse(sessionStorage.getItem('OrgCategory'))
      } else {
        this.dicItemDicTypeCode(this.OrgCategory)
      }
      this.dialogData = {}
      this.dialogVisible = true
    },
    editOrg (item) {
      this.dialogName = '编辑'
      if (sessionStorage.getItem('OrgLevel')) {
        this.OrgLevelList = JSON.parse(sessionStorage.getItem('OrgLevel'))
      } else {
        this.dicItemDicTypeCode(this.OrgLevel)
      }
      if (sessionStorage.getItem('OrgCategory')) {
        this.OrgCategoryList = JSON.parse(sessionStorage.getItem('OrgCategory'))
      } else {
        this.dicItemDicTypeCode(this.OrgCategory)
      }
      this.dialogData = {}
      this.dialogData = JSON.parse(JSON.stringify(item))
      this.dialogVisible = true
    },
        // 根据字典类型查找字典列表
    dicItemDicTypeCode (code) {
      this.$api.dicItemDicTypeCode({
        dicTypeCode: code
      }).then(res => {
        if (res.success) {
          switch (code) {
            case this.OrgLevel:
              this.OrgLevelList = res.result
              sessionStorage.setItem('OrgLevel', JSON.stringify(this.OrgLevelList))
              break
            case this.OrgCategory:
              this.OrgCategoryList = res.result
              sessionStorage.setItem('OrgCategory', JSON.stringify(this.OrgCategoryList))
              break
          }
        }
      })
      .catch(error => console.log(error))
    },
    save () {
      if (!this.dialogData.loginName) {
        this.$message.error('请填写登录名！')
        return
      }
      if (!this.dialogData.orgCode && regExp.numberletter(this.dialogData.loginName)) {
        this.$message.error('登录名请输入大于6位的字母和数字组合')
        return
      }
      if (this.dialogData.mobile && regExp.mobile(this.dialogData.mobile)) {
        this.$message.error('请填写正确的手机号！')
        return
      }
      if (!this.dialogData.orgName) {
        this.$message.error('请填写机构名称！')
        return
      }
      if (this.dialogData.orgName && regExp.trim(this.dialogData.orgName) == '') {
        this.$message.error('请正确填写机构名称！')
        return
      }
      if (!this.dialogData.category) {
        this.$message.error('请填写机构类型！')
        return
      }
      this.$api.orgsave(
        this.dialogData
      ).then(res => {
        if (res.success) {
          this.getOrgList()
          if (this.dialogData.orgCode) {
            this.$message.success('修改成功!')
          } else {
            this.$message.success('保存成功!')
          }
          this.dialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    orgdel (row) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.orgdel({ orgCode: row.orgCode })
          .then(res => {
            if (res.success) {
              this.getOrgList()
              this.$message.success('删除成功!')
            } else {
              this.$message.error(res.msg)
            }
          }).catch(error => console.log(error))
      })
    },
    loginNameValidte (str) {
      if (str && regExp.numberletter(str)) {
        this.$message.warning('登录名请输入大于6位的字母和数字组合')
      }
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
    color $elBlack
    font-size 12px
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
.min
  margin-bottom -4px
</style>

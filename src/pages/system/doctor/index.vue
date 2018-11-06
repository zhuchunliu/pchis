<template lang="pug">
  .pagecontent
    .myrow
      el-row
        el-col(:span="5")
          el-input(placeholder="请输入员工姓名", size='small', clearable, v-model="searchval", @keyup.enter.native='getDoctorListSearch')
            el-button(slot="append", icon="el-icon-search", @click="getDoctorListSearch")
        el-col.right(:span="19")
          el-button(size='small', @click="YSJYshow") 已禁用（{{YSJYTotal}}）
          el-button(size='small', icon="el-icon-plus", @click='showtianjia') 添加员工
      el-table.table(:data="YStableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
        el-table-column(prop="userName", label="姓名")
        el-table-column(label="性别")
          template(slot-scope="scope")
            span(v-if="scope.row.gender == '0'") 男
            span(v-if="scope.row.gender == '1'") 女
        el-table-column(prop="age", label="年龄")
        el-table-column(prop="mobile", label="手机号")
        el-table-column(prop="deptName", label="科室")
        el-table-column(prop="roleName", label="职务")
        el-table-column(label="状态", width='140', align='center')
          template(slot-scope="scope")
            el-button(size='mini', type="primary", @click='showedit(scope.row.id)') 编辑
            el-button(size='mini', @click="doctorSwitch('1', scope.$index, scope.row.id)") {{scope.row.status == '1' ? '禁用' : '启用'}}
      .pagination
        el-pagination(
          background,
          :page-size="pageSize",
          layout="total, prev, pager, next, jumper",
          :total="listTotal",
          :current-page.sync="pageNum",
          @current-change="getDoctorListPage")

    el-dialog(
      :visible.sync="tianjiaDialogVisible",
      custom-class="ax",
      width="900px",
      center)
      .dialogtitle(slot='title') {{editDialogItem.id?'编辑员工':'添加员工'}}
      .tianjiaDoctor
        el-container
          el-aside(width="160px").bg-right.bg-bottom
            div.addImg
              img(:src="imgUrl ? imgUrl : (editDialogItem.gender == 1 ? women : men)")
            .file
              span 上传员工头像
              input.inputfile(type="file", accept="image/png, image/jpeg, image/gif, image/jpg", @change='uploadImg($event)') 
            //- .name 建议尺寸1000*480
          el-main.bg-bottom
            el-form.elform(:inline="true", label-width="80px", label-position="right")
              el-form-item.elform-item(label="员工姓名")
                el-input.elform-item-input(size='medium', placeholder='请填写员工姓名', v-model="editDialogItem.userName")
              el-form-item.elform-item(label="性别")
                el-select.elform-item-input(size='medium', v-model="editDialogItem.gender", placeholder="请选择性别")
                  el-option(label="男", value="0") 
                  el-option(label="女", value="1") 
            el-form.elform(:inline="true", label-width="80px", label-position="right")  
              el-form-item.elform-item(label="出生年月")
                el-date-picker(size='medium', type='date', v-model="editDialogItem.dateOfBirth", placeholder='请选择出生年月', :picker-options="pickerOptionsone", :editable= 'false')
              el-form-item.elform-item(label="科室")
                el-select(size='medium', v-model="editDialogItem.dept", placeholder="请选择科室")
                  el-option(v-for="item, index in deptList", :key='index', :value='item.id', :label='item.dept')
            el-form.elform(:inline="true", label-width="80px", label-position="right")
              el-form-item.elform-item(label="职称")
                el-select(size='medium', v-model="editDialogItem.duty", placeholder="请选择职称")
                  el-option(v-for="item, index in DutyList", :key='index', :value='item.dicItemCode', :label='item.dicItemName')
              el-form-item.elform-item(label="权限")
                el-select(size='medium', v-model="roleIds", placeholder="请选择职务", multiple)
                  el-option(v-for="item, index in tableData", :key='item.id', :value='item.id', :label='item.roleName')
              //- el-form-item(label="门诊级别")
                el-select(size='medium', v-model="editDialogItem.diagnosLevel", placeholder="请选择级别")
                  el-option(v-for="item, index in DiagnosisLevelList", :key='index', :value='item.dicItemCode', :label='item.dicItemName')
            el-form.elform(:inline="true", label-width="80px", label-position="right")
              el-form-item.elform-item(label="挂号费(元)")
                el-input(size='medium', placeholder='请填写挂号费', v-model="editDialogItem.applyfee", type="number") 
              el-form-item.elform-item(label="手机号")
                el-input(size='medium', placeholder='请填写手机号', v-model='editDialogItem.mobile', type="number")
            el-form(label-width="80px", label-position="right")
              el-form-item(label="擅长疾病")
                el-input(type="textarea", :rows="2", placeholder="请填写擅长诊治的疾病（500字以内）", v-model="editDialogItem.expertin")
            el-form(label-width="80px", label-position="right")
              el-form-item(label="个人简介")
                el-input(type="textarea", :rows="2", placeholder="请填写个人简介，例如：学历、个人荣誉和科研成果等（500字以内）", v-model="editDialogItem.introduction")  
        el-footer
          .beizhu(v-if="!editDialogItem.id") 注：新增账户初始密码为”000000“，请及时修改密码！
          el-button.bigbtn(type="primary", @click="dialogItemSava") {{editDialogItem.id?'保存':'确认添加'}}  

    el-dialog(
      :visible.sync="YSJYDialogVisible",
      width="800px",
      :before-close="YSJYClose",
      center)
      .dialogtitle(slot='title') 已禁用
      .quanxianBody
        el-table.table(:data="YSJYTableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="userName", label="姓名")
          el-table-column(label="性别")
            template(slot-scope="scope")
              span(v-if="scope.row.gender == '0'") 男
              span(v-if="scope.row.gender == '1'") 女
          el-table-column(prop="deptName", label="科室")
          el-table-column(prop="roleName", label="职务")
          el-table-column(label="状态", width='80', align='center')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.status == '0'", @click="doctorSwitch('2', scope.$index, scope.row.id)") 恢复
              el-button(size='mini', v-if="scope.row.status == '1'" disabled) 已恢复
</template>
<script>
import { formatTime, regExp } from '@/assets/js/utils'
const men = require('@/assets/img/men.png')
const women = require('@/assets/img/women.png')
export default {
  data () {
    return {
      men: men,
      women: women,
      userInfo: '',
      searchval: '',
      select: '',
      tableData: [],
      YStableData: [],
      YSJYTableData: [],
      pageNum: 1,
      YSJYPageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      YSJYTotal: 0,
      listTotal: 0,
      DiagnosisLevelList: [],
      DutyList: [],
      deptList: [],
      YSJYDialogVisible: false,
      tianjiaDialogVisible: false,
      editDialogItem: {},
      quanxianDialogVisible: false,
      jinyongDialogVisible: false,
      checkList: [],
      num: '',
      getData: [],
      roleidSave: 0,
      roleIds: [],
      DiagnosisLevel: this.$dicTypeCode.DiagnosisLevel,
      Duty: this.$dicTypeCode.Duty,
      addquanxian: {},
      QXJYtableData: [],
      imgUrl: '',
      pickerOptionsone: {
        disabledDate: time => {
          let tomorrow = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
          let starttime = time.getTime() > tomorrow
          return starttime
        }
      }
    }
  },
  created () {
    let _this = this
    _this.userInfo = _this.$store.state.userInfo
    _this.getDoctorList()
  },
  methods: {
    // 根据字典类型查找字典列表
    dicItemDicTypeCode (code) {
      let _this = this
      _this.$api.dicItemDicTypeCode({
        dicTypeCode: code
      }).then(res => {
        if (res.success) {
          switch (code) {
            case _this.DiagnosisLevel: _this.DiagnosisLevelList = res.result
              break
            case _this.Duty: _this.DutyList = res.result
              break
          }
          _this.category = res.result
        }
      })
      .catch(error => console.log(error))
    },
    showtianjia () {
      let _this = this
      _this.editDialogItem = {
        gender: '0'
      }
      this.roleIds = []
      _this.imgUrl = ''
      // 获取门诊级别
      // _this.dicItemDicTypeCode(_this.DiagnosisLevel)
      // 获取医生职称
      _this.dicItemDicTypeCode(_this.Duty)
      // 获取职务
      _this.getRoleData()
      // 获取科室
      _this.getDeptList()
      this.tianjiaDialogVisible = true
    },
    showedit (id) {
      let _this = this
      _this.roleIds = []
      _this.imgUrl = ''
      // 获取门诊级别
      _this.dicItemDicTypeCode(_this.DiagnosisLevel)
      // 获取医生职称
      _this.dicItemDicTypeCode(_this.Duty)
      // 获取职务
      _this.getRoleData()
      // 获取科室
      _this.getDeptList()
      _this.$api.getDoctorDetail({id: id})
        .then(res => {
          if (res.success) {
            _this.editDialogItem = res.result
            if (_this.editDialogItem.avatar) {
              _this.imgUrl = _this.editDialogItem.avatar
            }
            if (_this.editDialogItem.userRoleVoList) {
              _this.editDialogItem.userRoleVoList.map(item => {
                if (item.isChecked == 1) {
                  _this.roleIds.push(item.roleId)
                }
              })
            }
            _this.tianjiaDialogVisible = true
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    getDeptList () {
      this.$api.getDeptList()
        .then(res => {
          this.deptList = res.result
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
    getRoleData () {
      let _this = this
      let p = {
        idValid: 1
      }
      _this.$api.getRole(p)
        .then(function (res) {
          if (res.statusCode === 'SUCCESS') {
            _this.tableData = res.result
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 医生管理
    YSJYshow () {
      this.YZJYpageNum = 1
      this.YSJYDialogVisible = true
      this.getYZJYDoctorLists()
    },
    YSJYClose (done) {
      this.getDoctorList()
      done()
    },
    getDoctorListSearch () {
      this.pageNum = 1
      this.getDoctorList()
    },
    getDoctorListPage (val) {
      this.pageNum = val
      this.getDoctorList()
    },
    getDoctorList () {
      let _this = this
      _this.$api.getDoctorList({
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        param: {
          userName: _this.searchval,
          status: '1'
        }
      }).then(function (res) {
        console.log(res)
        if (res.statusCode === 'SUCCESS') {
          _this.YStableData = res.result.data
          _this.listTotal = res.result.total
          _this.getDoctorDisabledNum()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    getYZJYDoctorLists () {
      let _this = this
      _this.$api.getDoctorList({
        pageNum: _this.YSJYPageNum,
        pageSize: _this.pageSize,
        param: {
          status: '0'
        }
      }).then(res => {
        _this.YSJYTableData = res.result.data
        _this.YsJYTotal = res.result.total
        console.log(_this.YSJYTableData)
      })
      .catch(error => console.log(error))
    },
    getDoctorDisabledNum () {
      this.$api.getDoctorDisabledNum()
        .then(res => {
          if (res.success) {
            this.YSJYTotal = res.result.num
          }
        })
    },
    doctorSwitch (type, index, id) {
      let _this = this
      _this.$api.doctorSwitch({'id': id})
        .then(res => {
          if (res.success) {
            if (type == '1') {
              // _this.YStableData[index].status = _this.YStableData[index].status == '1' ? '0' : '1'
              _this.getDoctorList()
              _this.getDoctorDisabledNum()
              _this.$message.success('状态修改成功!')
            }
            if (type == '2') {
              _this.YSJYTableData[index].status = _this.YSJYTableData[index].status == '1' ? '0' : '1'
              _this.$message.success('状态修改成功!')
            }
          }
        })
        .catch(error => console.log(error))
    },
    dialogItemSava () {
      let _this = this
      let type = 0
      if (!this.editDialogItem.userName) {
        this.$message.error('请填写医生姓名！')
        return false
      }
      if (this.editDialogItem.userName && regExp.trim(_this.editDialogItem.userName) == '') {
        this.$message.error('请填写医生姓名！')
        return false
      }
      if (_this.editDialogItem.mobile && regExp.mobile(_this.editDialogItem.mobile)) {
        this.$message.error('请填写正确的手机号！')
        return false
      }
      _this.editDialogItem.roleIds = _this.roleIds.toString()
      _this.editDialogItem.avatar = _this.imgUrl
      if (_this.editDialogItem.id) {
        type = 1 // 修改
      } else {
        type = 2 // 添加
      }
      if (_this.editDialogItem.dateOfBirth) {
        _this.editDialogItem.dateOfBirth = formatTime(_this.editDialogItem.dateOfBirth, 'yyyy-MM-dd')
      }
      _this.editDialogVisible = false
      _this.tianjiaDialogVisible = false
      _this.$api.doctorSave(_this.editDialogItem)
        .then(res => {
          console.log(res)
          if (res.success) {
            if (type === 1) {
              _this.getDoctorList()
              if (this.editDialogItem.id == this.$store.state.userInfo.id) {
                this.$store.commit('getUserInfo')
              }
              _this.$message.success('修改成功!')
            }
            if (type === 2) {
              _this.pageNum = 1
              _this.getDoctorList()
              _this.$message.success('添加成功!')
            }
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    // 上传头像
    uploadImg (event) {
      let codeType = ''
      if (event.target.files[0]) {
        this.$api.dicItemDicTypeCode({
          dicTypeCode: 'QnUpType'
        }).then(res => {
          if (res.success) {
            res.result.map(item => {
              if (item.dicItemCode == '2') {
                codeType = item.dicItemCode
              }
            })
            this.$api.getqnToken({
              type: codeType
            }).then(res => {
              console.log('file')
              let formData = new FormData()
              formData.append('file', event.target.files[0])
              formData.append('token', res.result.upToken)
              formData.append('key', res.result.key)
              this.$api.upQnObj(formData)
                .then(res => {
                  if (res.key) {
                    this.imgUrl = this.$qiniu + res.key
                  }
                })
            })
            .catch(error => console.log(error))
          }
        })
        .catch(error => console.log(error))
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
    margin-top 20px
  .bigbtn
    margin-top 20px
    width 100%

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
.elform
  display flex
  flex-direction row
  .elform-item
    flex 1
.elform-item-input
  width 100% !important
</style>

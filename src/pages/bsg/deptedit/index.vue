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
            span(v-else) 否
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
            el-select(size='medium', placeholder='请填写科室名称', filterable, allow-create, default-first-option, v-model="DeptMo.dept")
              el-option(v-for="item, i in demoArr", :label='item', :value='item', :key='i')

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
            el-select(size='medium', placeholder='请填写科室名称', filterable, allow-create, default-first-option, v-model="DeptMo.dept")
              el-option(v-for="item, i in demoArr", :label='item', :value='item', :key='i')

            // el-input(size='medium', placeholder='请填写科室名称',v-model='DeptMo.dept')
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
      DeptMo: {},
      demoArr: ['神经内科', '呼吸内科', '心血管科', '消化内科', '肾内科', '血液内科', '内分泌科', '风湿代谢科', '肿瘤内科', '风湿免疫科', '普通内科', '急诊科', '感染内科', '变态反应科', '老年医学科', '基本外科', '普通外科', '胸外科', '神经外科', '甲乳科', '胃肠外科', '肝胆胰脾外科', '肛肠科', '泌尿外科', '整形外科', '肿瘤外科', '烧伤科', '血管外科', '骨科', '乳腺外科', '心外科', '脊柱外科', '妇科', '产科', '儿科', '生殖内分泌', '计划生育', '妇泌尿', '眼科', '耳鼻喉科', '口腔科', '皮肤科', '肿瘤科', '康复科', '中医科', '核医学科', '超声诊断', '感染科', '传染科', '精神科', '麻醉科', '放射科', '耳鼻喉科', '病理科', '营养科', '心理医学科', '检验科', '体检中心']
    }
  },
  created () {
    let _this = this
    _this.getDeptList()
  },
  methods: {
    getDeptList () {
      if (!this.$route.query.orgCode) {
        this.$message.error('查不到医院！')
        setTimeout(() => {
          this.$router.go(-1)
        }, 2000)
        return false
      }
      this.$api.deptList({
        orgCode: this.$route.query.orgCode
      })
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
        superiorityFlag: 1
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
      _this.DeptMo.orgCode = this.$route.query.orgCode
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

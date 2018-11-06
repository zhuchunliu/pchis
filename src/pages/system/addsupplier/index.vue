<template lang="pug">
  .pagecontent
    .content
      .my-row
        .my-col-input
          el-input(placeholder="请输入内容", size='small', clearable, v-model="searchval")
            el-button(slot="append", icon="el-icon-search", @click="getsupplylistByPage")
        // .my-col-select
          el-select(placeholder="请选择", v-model="select", size='small')
            el-option(value='1', label='全部')
        .my-col
          el-button(icon="el-icon-plus", size='small', @click='daoruClick') 新增供应商
      el-row.table
        el-table(:data="tableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="supplyerName", label="供货商名称")
          el-table-column(prop="abbrName", label="简称")
          el-table-column(prop="linkMan", label="联系人")
          el-table-column(prop="mobile", label="联系方式")
          el-table-column(prop="address", label="地址")
          el-table-column(prop="busiscope", label="业务范围")
          el-table-column(label="操作", width='80', align='center')
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click='editItem(scope.row)') 编辑
              //- el-button(type="danger", size='mini', @click='tuikuan(scope.row)') 移除
      .pagination
        el-pagination(
          background,
          :page-size="pageSize",
          layout="total, prev, pager, next, jumper",
          :total="totalNum",
          :current-page.sync="pageNum",
          @current-change="getsupplylistByPageChange")

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') {{itemName}}供货商
      .addgys
        el-form(label-width="90px", label-position="right")
          el-form-item(label="供货商名称")
            el-input(size='medium', v-model='addItem.supplyerName', placeholder='请输入供货商名称')
          el-form-item(label="简称")
            el-input(size='medium', v-model='addItem.abbrName', placeholder='请输入简称')
          el-form-item(label="联系人")
            el-input(size='medium', v-model='addItem.linkMan', placeholder='请输入联系人姓名')
          el-form-item(label="手机号")
            el-input(size='medium', v-model='addItem.mobile', placeholder='请输入联系人手机号', type="number")
          el-form-item(label="地址")
            el-input(size='medium', v-model='addItem.address', placeholder='请输入地址')
          el-form-item(label="业务范围")
            el-input(type="textarea", :rows="2", v-model='addItem.busiscope', placeholder='请输入业务范围')
        .bigbtn(@click='save') 确认

</template>

<script>
import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      searchval: '',
      centerDialogVisible: false,

      tableData: [],
      pageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      totalNum: 0,
      addItem: {},
      itemName: ''
    }
  },
  methods: {
    daoruClick () {
      this.itemName = '新增'
      this.addItem = {}
      this.centerDialogVisible = true
    },
    getsupplylistByPageChange (val) {
      this.pageNum = val
      this.getsupplylistByPage()
    },
    getsupplylistByPage () {
      this.$api.getsupplylistByPage({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: this.searchval
      }).then(res => {
        if (res.success) {
          this.tableData = res.result.data
          this.totalNum = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    editItem (data) {
      this.itemName = '编辑'
      this.addItem = JSON.parse(JSON.stringify(data))
      this.centerDialogVisible = true
    },
    save () {
      if (regExp.trim(this.addItem.supplyerName) === '') {
        this.$message.error('请填写供货商名称！')
        return false
      }
      if (this.addItem.mobile && regExp.mobile(this.addItem.mobile)) {
        this.$message.error('请填写有效的手机号！')
        return false
      }
      this.$api.savesupply(
        this.addItem
      ).then(res => {
        console.log(res)
        if (res.success) {
          if (!this.addItem.id) {
            this.$message.success('新增成功！')
          }
          if (this.addItem.id) {
            this.$message.success('修改成功！')
          }
          this.getsupplylistByPage()
          this.centerDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    this.getsupplylistByPage()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.addgys
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

.table
  margin-top 20px

.pagination
  margin-top 20px
  text-align center
.content
  min-height 300px
  padding 20px 15px
  background $White
.my-row
  display flex
  flex-flow row nowrap
  align-items center
  justify-content flex-start
  .my-col-input
    flex 0 0 260px
    margin-right 15px
  .my-col-select
    flex 0 0 200px
    margin-right 15px
  .my-col
    flex 1
    text-align right
</style>

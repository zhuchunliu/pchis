<template lang="pug">
  .pagecontent
    .content
      .my-row
        .my-col-input
          el-input(placeholder="请输入厂商名称或厂商拼音首字母", size='small', clearable, v-model="searchval")
            el-button(slot="append", icon="el-icon-search", @click="getManufacturer")
        // .my-col-select
          el-select(placeholder="请选择", v-model="select", size='small')
            el-option(value='1', label='全部')
        .my-col
          el-button(icon="el-icon-plus", size='small', @click='daoruClick') 新增厂商
      el-row.table
        el-table(:data="tableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="licenceNo", label="许可编号")
          el-table-column(prop="name", label="厂商名称")
          el-table-column(prop="address", label="地址")
          el-table-column(prop="scope", label="生产范围")
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
          @current-change="getManufacturerPage")

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') {{itemName}}生产厂商
      .addgys
        el-form(label-width="90px", label-position="right")
          el-form-item(label="厂商名称")
            el-input(size='medium', v-model='addItem.name', placeholder='请输入厂商名称')
          el-form-item(label="许可编号")
            el-input(size='medium', v-model='addItem.licenceNo', placeholder='请输入许可编号')
          el-form-item(label="地址")
            el-input(size='medium', v-model='addItem.address', placeholder='请输入地址')
          el-form-item(label="生产范围")
            el-input(size='medium', v-model='addItem.scope', placeholder='请输入生产范围')
        .bigbtn(@click='save') 确认

    //- el-dialog(
      :visible.sync="editDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 编辑供应商
      .addgys
        el-form(label-width="90px", label-position="right", :model="sup")
          el-form-item(label="供应商名称")
            el-input(size='medium', placeholder='请输入供应商名称')
          el-form-item(label="供应商地址")
            el-col(:span='11')
              el-select(size='medium', placeholder='选择', v-model="sup.sel")
                el-option(label='北京', value="1")
                el-option(label='江苏', value="2")
            el-col(:span='12', :offset='1')
              el-select(size='medium', placeholder='选择', v-model="sup.sel")
                el-option(label='北京', value="1")
                el-option(label='南京', value="2")
          el-form-item(label="联系人姓名")
            el-input(size='medium', placeholder='请输入联系人姓名')
          el-form-item(label="座机号")
            el-input(size='medium', placeholder='请输入座机号')
          el-form-item(label="手机号")
            el-input(size='medium', placeholder='请输入手机号')
          el-form-item(label="银行账号")
            el-input(size='medium', placeholder='请输入银行账号')
        .bigbtn 确认保存

</template>

<script>
import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      searchval: '',
      // select: '1',
      // sup: {
      //   sel: '',
      // },
      centerDialogVisible: false,
      editDialogVisible: false,

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
    getManufacturerPage (val) {
      this.pageNum = val
      this.getManufacturer()
    },
    getManufacturer () {
      this.$api.getmanufacturerlist({
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
      if (regExp.trim(this.addItem.name) === '') {
        this.$message.error('请填写厂商名称！')
        return false
      }
      this.$api.savemanufacturer(
        this.addItem
      ).then(res => {
        console.log(res)
        if (res.success) {
          if (this.itemName == '新增') {
            this.$message.success('新增成功！')
          }
          if (this.itemName == '编辑') {
            this.$message.success('修改成功！')
          }
          this.getManufacturer()
          this.centerDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    this.getManufacturer()
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
    flex 0 0 300px
    margin-right 15px
  .my-col-select
    flex 0 0 200px
    margin-right 15px
  .my-col
    flex 1
    text-align right
</style>

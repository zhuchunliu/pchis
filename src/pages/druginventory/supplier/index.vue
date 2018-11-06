<template lang="pug">
  .pagecontent
    .content
      .my-row
        // .my-col-input
          el-input(placeholder="请输入内容", size='small', v-model="searchval")
            el-button(slot="append", icon="el-icon-search")
        // .my-col-select
          el-select(placeholder="请选择", v-model="select", size='small')
            el-option(value='1', label='全部')
        .my-col
          el-button(icon="el-icon-plus", size='small', @click='daoruClick') 关联供应商
      el-row.table
        el-table(:data="tableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="supplyerName", label="供货商名称")
          el-table-column(prop="address", label="地址")
          el-table-column(prop="linkMan", label="联系人", align='center')
          el-table-column(prop="mobile", label="联系方式", align='center')
          el-table-column(prop="busiscope", label="业务范围", align='center')
          el-table-column(prop="comment", label="备注", align='center')
          el-table-column(label="操作", width='80', align='center')
            template(slot-scope="scope")
              el-button(type="danger", size='mini', @click='tuikuan(scope.row)') 移除
      // .pagination
        el-pagination(
          background,
          :page-size="100",
          layout="total, prev, pager, next, jumper",
          :total="1000")

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 关联供应商
      .daorubody
        .my-row
          // .my-col-select
            el-select(placeholder="请选择", v-model="drugTypeSelect", size='small', @change='getDrugdict')
              el-option(:value='-1', label='全部分类')
              el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in drugType", :key="index")
          .my-col-input
            el-input(placeholder="请输入供应商名称或其拼音首字母", size='small', v-model="gysSearchval", @keyup.enter.native='gysList')
              el-button(slot="append", icon="el-icon-search", @click='gysList')
          .my-col
            el-button(type='primary', size='small', @click='addsupplyer') 新增
            el-button(type='primary', size='small', @click='daoru') 确定关联({{selectNum}})
        el-table.table(
          stripe,
          border,
          size='medium',
          :data='gysTableData',
          style="width: 100%",
          @selection-change='tbsel'
        )
          //- abbrName (string, optional): 简名 ,
          //- address (string, optional): 地址 ,
          //- busiscope (string, optional): 业务范围 ,
          //- comment (string, optional): 备注 ,
          //- id (integer, optional): id ,
          //- linkMan (string, optional): 联系人 ,
          //- mobile (string, optional): 联系人手机 ,
          //- pinYin (string, optional): 拼音 ,
          //- supplyerName (string, optional): 供货商名称
          el-table-column(type="selection", width="55")
          el-table-column(prop="supplyerName", label="供货商名称", align='center')
          el-table-column(prop="address", label="地址", align='center')
          el-table-column(prop="linkMan", label="联系人", align='center')
          el-table-column(prop="mobile", label="联系方式", align='center')
        //- .pagination
        //-   el-pagination(
        //-     background,
        //-     :page-size="gysPageSize",
        //-     layout="total, prev, pager, next, jumper",
        //-     :total="gysTotal",
        //-     :current-page.sync="gysPageNum",
        //-     @current-change='gysList')

    el-dialog(
      :visible.sync="addsupplyerDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 新增供货商
      .addgys
        el-form(label-width="90px", label-position="right")
          el-form-item(label="供货商名称")
            el-input(size='medium', v-model='addsupplyerItem.supplyerName', placeholder='请输入供货商名称')
          el-form-item(label="简称")
            el-input(size='medium', v-model='addsupplyerItem.abbrName', placeholder='请输入简称')
          el-form-item(label="联系人")
            el-input(size='medium', v-model='addsupplyerItem.linkMan', placeholder='请输入联系人姓名')
          el-form-item(label="手机号")
            el-input(size='medium', v-model='addsupplyerItem.mobile', placeholder='请输入联系人手机号', type="number")
          el-form-item(label="地址")
            el-input(size='medium', v-model='addsupplyerItem.address', placeholder='请输入地址')
          el-form-item(label="业务范围")
            el-input(type="textarea", :rows="2", v-model='addsupplyerItem.busiscope', placeholder='请输入业务范围')
        .bigbtn(@click='savesupplyer') 确认

</template>

<script>
import { regExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      searchval: '',
      select: '1',
      sup: {
        sel: ''
      },
      centerDialogVisible: false,
      addsupplyerDialogVisible: false,

      gysSearchval: '',
      gysTableData: [],
      gysPageSize: this.$store.state.userAgent ? 8 : 20,
      gysPageNum: 1,
      gysTotal: 0,
      selectNum: 0,
      codeStr: '',
      addsupplyerItem: {}
    }
  },
  computed: {
    tableData () {
      return this.$store.state.supplylist
    }
  },
  methods: {
    daoruClick (data) {
      this.gysList()
      this.centerDialogVisible = true
    },
    getGys () {
      console.log('gys')
    },
    tbsel (arr) {
      let codeStr = ''
      this.selectNum = arr.length
      console.log(arr)
      for (let i = 0; i < arr.length; i++) {
        codeStr += arr[i].id + ','
      }
      this.codeStr = codeStr.slice(0, codeStr.length - 1)
      console.log(this.codeStr)
    },
    daoru () {
      if (!this.codeStr || this.codeStr.length < 1) {
        this.$message.error('请选择供应商')
        return false
      }
      this.$api.supplyvsorgaddSupplys({
        supplyIds: this.codeStr
      }).then(res => {
        if (res.success) {
          this.$message.success('关联成功！')
          this.$store.commit('getSupplyList')
          this.centerDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    tuikuan (row) {
      this.$confirm('确定移除' + row.supplyerName + '供应商吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.supplyvsorgRemoveSupply({
          supplyId: row.id
        }).then(res => {
          if (res.success) {
            this.$message.success('移除成功！')
            this.$store.commit('getSupplyList')
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    gysList () {
      this.$api.getsupplylist({
        // pageNum: this.gysPageNum,
        // pageSize: this.gysPageSize,
        param: this.gysSearchval === '' ? null : this.gysSearchval
      }).then(res => {
        if (res.success) {
          console.log(res.result)
          this.gysTableData = res.result
          // this.gysTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addsupplyer () {
      this.addsupplyerItem = {}
      this.addsupplyerDialogVisible = true
    },
    savesupplyer () {
      if (regExp.trim(this.addsupplyerItem.supplyerName) === '') {
        this.$message.error('请填写供货商名称！')
        return false
      }
      if (this.addsupplyerItem.mobile && regExp.mobile(this.addsupplyerItem.mobile)) {
        this.$message.error('请填写有效的手机号！')
        return false
      }
      this.$api.savesupply(
        this.addsupplyerItem
      ).then(res => {
        console.log(res)
        if (res.success) {
          // this.addsupplyerItem.id = res.result.id
          this.$message.success('新增成功！')
          this.gysList()
          this.addsupplyerDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    this.$store.commit('getSupplyList')
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

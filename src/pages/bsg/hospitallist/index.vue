<template lang="pug">
  .pagecontent
    .topnavinfo
      .left
      .right
        el-button(type="success", size='mini',@click="gotoedit") 新增医院
    .con 
      el-row.top
        el-col(:span="4")
          el-select(placeholder="选择城市", v-model="cityId0", size='small', @change='areabsg')
            el-option(:value='item.id', :label='item.shortName', v-for="item, index in areaArr", :key='index')
        el-col(:span="4")
          el-select(placeholder="选择城市", v-model="cityId", size='small', @change='inventoryauditlist')
            el-option(:value='item.id', :label='item.shortName', v-for="item, index in areaArr2", :key='index')
        el-col(:span="5")
          el-input(placeholder="请输入医院名称", size='small', v-model="orgName", @keyup.enter.native='inventoryauditlist')
            el-button(slot="append", icon="el-icon-search", @click='inventoryauditlist')
      
      el-table.table(
        stripe,
        border,
        :data='tableData',
        size='medium',
        style="width: 100%"
      )
        // el-table-column(type="selection", width="55")
        el-table-column(prop="orgName", label="机构名称")
        el-table-column(prop="telephone", label="机构电话", align='center')
        el-table-column(prop="gradeOnePrice", label="普通", align='center')
        el-table-column(prop="gradeTwoPrice", label="专家", align='center')
        el-table-column(prop="gradeThreePrice", label="指定专家", align='center')
        el-table-column(prop="gradeFourPrice", label="知名专家", align='center')
        el-table-column(prop="accompanyingPrice", label="陪诊费", align='center')
        el-table-column(label="操作", align='center', width='300')
          template(slot-scope="scope")
            el-button(type='', size='mini', @click='showInfo(scope.row)') 设置挂号费
            el-button(type='primary', size='mini', @click='godeptedit(scope.row)') 科室管理
            el-button(type='success', size='mini', @click='gotoedit(scope.row)') 编辑
            el-button(type="danger", size='mini', @click='inventorydel(scope.row.orgCode)') 删除
      
      .pagination
        el-pagination(
          background,
          layout="total, prev, pager, next, jumper",
          :page-size="pageSize",
          :current-page.sync="pageNum",
          :total="totalNum",
          @current-change='inventoryauditlist')

    el-dialog(
      :visible.sync="centerDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 设置挂号费
      .daorubody
        el-form(label-width="90px", label-position="right")
          el-form-item(label="普通")
            el-input(size='medium', placeholder='普通挂号费', v-model="oneprice")
          el-form-item(label="专家")
            el-input(size='medium', placeholder='专家挂号费', v-model="twoprice")
          el-form-item(label="指定专家")
            el-input(size='medium', placeholder='指定专家挂号费', v-model="threeprice")
          el-form-item(label="知名专家")
            el-input(size='medium', placeholder='知名专家挂号费', v-model="fourprice")
          el-form-item(label="陪诊费")
            el-input(size='medium', placeholder='陪诊费', v-model="accompanyingPrice")
        .bigbtn(@click='setprice') 确认保存
</template>
<script>
import { formatTime } from '@/assets/js/utils'
export default {
  data () {
    return {
      centerDialogVisible: false,
      orgName: '',
      cityId0: '',
      cityId: '',
      date: '',
      hasPermission: '',
      tableData: [],
      pageSize: this.$store.state.userAgent ? 8 : 20,
      pageNum: 1,
      totalNum: 0,
      dateOption: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchval: '',

      dataInfo: [],
      dataInfostatus: '',
      dataInfodate: '',

      areaArr: [],
      areaArr2: [],
      orgCode: '',
      oneprice: 0,
      twoprice: 0,
      threeprice: 0,
      fourprice: 0,
      accompanyingPrice: 0
    }
  },
  filters: {
    datefilters (val) {
      if (val) {
        return formatTime(val, 'yyyy-MM-dd')
      } else {
        return ''
      }
    }
  },
  computed: {
    drugType () {
      return this.$store.state.drugType
    }
  },
  methods: {
    gotoedit (row) {
      if (!row.orgCode) {
        this.$router.push({path: '/bsg/hospitaledit'})
      } else {
        console.log(row)
        this.$setStore('bsghospital', row)
        this.$router.push({path: '/bsg/hospitaledit', query: {orgCode: row.orgCode}})
      }
    },
    inventorypermission () {
      this.$api.inventorypermission()
        .then(res => {
          if (res.success) {
            this.hasPermission = res.result.hasPermission
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    inventoryauditlist () {
      this.$api.orgbsglistpagepc({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgName: this.orgName,
        cityId: this.cityId
      }).then(res => {
        if (res.success) {
          this.tableData = res.result.data
          this.totalNum = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    editstorage (row) {
      console.log(row)
      this.$confirm('确定编辑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({path: '/druginventory/stockcheck', query: {id: row.id, inventoryNo: row.inventoryNo, date: row.date}})
      })
    },
    showInfo (row) {
      this.centerDialogVisible = true
      console.log(row)
      this.orgCode = row.orgCode
      this.oneprice = row.gradeOnePrice
      this.twoprice = row.gradeTwoPrice
      this.threeprice = row.gradeThreePrice
      this.fourprice = row.gradeFourPrice
      this.accompanyingPrice = row.accompanyingPrice
    },
    setprice () {
      if (!this.oneprice || !this.twoprice || !this.threeprice || !this.fourprice) {
        this.$message.error('请设置挂号费用！')
        return false
      }
      if (!this.accompanyingPrice) {
        this.$message.error('请设置陪诊费！')
        return false
      }
      this.$api.accompanyingsetprice({
        accompanyingPrice: this.accompanyingPrice,
        gradeOnePrice: this.oneprice,
        gradeThreePrice: this.threeprice,
        gradeFourPrice: this.fourprice,
        gradeTwoPrice: this.twoprice,
        orgCode: this.orgCode
      }).then(res => {
        if (res.success) {
          this.centerDialogVisible = false
          this.inventoryauditlist()
          this.$message.success('设置成功！')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    inventorydel (id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.orgdel({
          orgCode: id
        }).then(res => {
          if (res.success) {
            this.$message.success('已删除')
            this.inventoryauditlist()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    godeptedit (row) {
      this.$router.push({path: '/bsg/deptedit', query: {orgCode: row.orgCode}})
      console.log(row)
    },
    inventoryreject (id) {
      this.$confirm('确定驳回吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.inventoryreject({
          id: id
        }).then(res => {
          if (res.success) {
            this.$message.success('驳回成功')
            this.inventoryauditlist()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    areabsg (pid) {
      this.$api.areabsg({
        pid: pid
      }).then(res => {
        if (res.success) {
          this.areaArr2 = res.result

          // 二级城市
          if (pid !== 0) {
            this.cityArr2 = res.result
            this.cityId = this.cityArr2[0].id
            this.inventoryauditlist()
          } else {
            // 一级省
            this.areaArr = res.result
            this.cityId0 = this.cityArr[0].id
            this.areabsg(this.areaArr[0].id)
          }
          console.log(res.result)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    // this.inventorypermission()
    this.areabsg(0)
    this.inventoryauditlist()
    // this.$store.commit('getDrugType')
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.topnavinfo
  display flex
  flex-flow row no-warp
  justify-content space-between
  align-items center
  padding 0 0 15px 0
  .left
    font-size 14px
    color $lBlack
    span
      color $Black
.fayaobody
  position relative
  .topinfo
    span
      display inline-block
      width 50%
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

.el-row.top
  .el-col
    margin-right 15px
.rightcol
  text-align right
  height 32px
  display flex
  align-items center
  justify-content flex-end
  span
    margin-right 20px
    color $Danger
.con
  padding 20px 15px
  background $White

.table
  margin-top 20px
.pagination
  margin-top 20px
  text-align center

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
.daorubody
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
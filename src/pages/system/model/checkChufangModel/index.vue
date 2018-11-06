<template lang="pug">
  .pagecontent
    el-row.conbody
      .top
        .l {{tplName}}
        .r
          el-button(size='medium', type="primary", @click="save", v-show="!isDisabled") 保存
          el-button(size='medium', type="primary", @click="isDisabled = false", v-show="isDisabled", v-if="isSelf=='1'") 编辑
          el-button(size='medium', @click='cancle') 取消
          // el-button(size='medium') 返回上一级
      
      el-col(:span='24').mt
        el-table(
          :data="tabledata",
          size='medium',
          stripe,
          border,
          style="width: 100%"
        )
          el-table-column(prop="categoryName", label="检查名称")
          el-table-column(prop="fee", label="单价(元)")
          el-table-column(label="检查目的")
            template(slot-scope="scope")
              el-input(size="small", v-model="scope.row.aim", :disabled="isDisabled")
          el-table-column(label="检查部位")
            template(slot-scope="scope")
              el-input(size="small", v-model="scope.row.part", :disabled="isDisabled")
          el-table-column(label="备注")
            template(slot-scope="scope")
              el-input(size="small", v-model="scope.row.memo", :disabled="isDisabled")
          el-table-column(label="状态", width='140')
            template(slot-scope="scope")
              el-button(size='mini', type="danger", @click="deleteCheck(scope.$index)", v-show="!isDisabled") 删除
      el-col(:span='24').mt
        el-button(type="primary", icon="el-icon-plus", round, style='margin:0 auto;display:block;', @click='showAside', v-show="!isDisabled") 添加

    // 右侧栏显示 药品处方添加
    rightAside(ref='rightAside')
      .asideTab
        .top
          .title.active 检查
        .asideCon
          .acon
            .search
              el-input(placeholder="请输入内容", size='small', v-model='searchval')
                el-button(slot="append", icon="el-icon-search", @click="getFeeList")
            .asidetable
              el-table(
                :data="checkLists"
                @selection-change="handleSelectionChange"
                stripe,
                size='medium',
                :height="rightTableHeight",
                style="width: 100%"
              )
                el-table-column(type="selection", width="55")
                el-table-column(prop="categoryName", label="名称")
                el-table-column(prop="itemPrice", label="单价")
        .asideBtns
          el-button(type='primary', size='small', @click="addCheckToModel(0)") 添加
          el-button(type='success', size='small', @click="addCheckToModel(1)") 添加并关闭
</template>
<script>
import rightAside from '@/components/rightAside'
export default {
  components: {
    rightAside
  },
  data () {
    return {
      tabledata: [],
      checkLists: [],
      addCheckLists: [],
      isDisabled: false,
      isSelf: '1',
      tplName: '',
      searchval: '',
      InspectCategory: this.$dicTypeCode.InspectCategory
    }
  },
  computed: {
    rightTableHeight () {
      return document.body.clientHeight - 132 - 46 - 70
    }
  },
  created () {
    let _this = this
    _this.isSelf = _this.$route.query.isSelf
    switch (_this.$route.query.isEdit) {
      case '1': _this.isDisabled = false
        break
      case '2': _this.isDisabled = true
        break
    }
    _this.tplName = _this.$route.query.tplName
    _this.getTplPrescripTplDetail(_this.$route.query.id)
  },
  methods: {
    showAside () {
      this.$refs.rightAside.show()
      this.getFeeList()
    },
    getTplPrescripTplDetail (id) {
      let _this = this
      _this.$api.getTplPrescripTplDetail({id: id})
        .then((res) => {
          console.log(res)
          if (res.success) {
            _this.tabledata = res.result
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    getFeeList () {
      let _this = this
      _this.$api.getFeeList({
        feeCategory: this.InspectCategory,
        categoryName: this.searchval
      })
        .then((res) => {
          if (res.success) {
            _this.checkLists = res.result
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    addCheckToModel (type) {
      let _this = this
      let checkLists = []
      if (type) {
        _this.$refs.rightAside.hide()
      }
      _this.tabledata.map(item => {
        _this.addCheckLists.map((_item, i) => {
          if (item.category == _item.category) {
            _this.addCheckLists.splice(i, 1)
          }
        })
      })
      _this.addCheckLists.forEach(item => {
        item.fee = item.itemPrice
        checkLists.push(item)
      })
      let ttt = [..._this.tabledata, ...checkLists]
      _this.tabledata = ttt
    },
    deleteCheck (index) {
      let _this = this
      _this.tabledata.splice(index, 1)
    },
    handleSelectionChange (val) {
      let _this = this
      _this.addCheckLists = val
    },
    save () {
      let _this = this
      let list = _this.tabledata
      let parmas = {
        list: list,
        tplId: _this.$route.query.id
      }
      _this.$api.TplPrescripTplInspectSave(parmas)
        .then((res) => {
          if (res.success) {
            let row = {
              activeName: '1'
            }
            _this.$router.replace({path: '/system/stencil', query: row})
          } else {
            _this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    cancle () {
      let _this = this
      let row = {
        activeName: '1'
      }
      _this.$router.replace({path: '/system/stencil', query: row})
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../../assets/css/var.styl'
.mt
  margin-top 20px
.conbody
  background $White
  padding 20px 15px
  .top
    display flex
    justify-content space-between
    align-items center
    .l
      flex 0 0 400px
      height 30px
      line-height 30px
      font-size 17px
    .r
      flex 1
      text-align right 

.asideTab
  width 100%
  height 100vh
  .top
    height 50px
    display flex
    flex-flow row nowarp
    justify-content center
    align-items center
    .title
      flex 1
      text-align center
      background $elSilver
      height 50px
      line-height 50px
      color $elBlack
      font-size 14px
      &.active
        background $Blue
        color $White
  .asideCon
    height calc(100vh - 100px)
    padding 5px 0
    .search
      padding 20px 50px
    .asidetable
      padding 0 10px
  .asidepagination
    text-align center
    padding 10px 0
  .asideBtns
    height 70px
    text-align center
</style>

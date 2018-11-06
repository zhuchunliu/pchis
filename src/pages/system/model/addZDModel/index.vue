<template lang="pug">
  .pagecontent
    el-row.conbody
      .top
        .l {{info.tplName}}
        .r
          el-button(size='medium', type="primary", @click="save", v-show="!isDisabled") 保存
          el-button(size='medium', type="primary", @click="isDisabled = false", v-show="isDisabled", v-if="isSelf=='1'") 编辑
          el-button(size='medium', @click='cancle') 取消
          // el-button(size='medium') 返回上一级
      el-form.myform(label-width="100px",label-position="right")       
        el-input(size='medium', type="textarea", placeholder='请填写详情', v-model="info.diagnosis", :disabled="isDisabled")
</template>
<script>
export default {
  data () {
    return {
      info: {},
      isDisabled: false,
      isSelf: '1'
    }
  },
  created () {
    let _this = this
    let query = _this.$route.query
    _this.isSelf = query.isSelf
    switch (query.isEdit) {
      case '1': _this.isDisabled = false
        break
      case '2': _this.isDisabled = true
        break
    }
    for (let key in query) {
      _this.info[key] = query[key]
    }
  },
  methods: {
    save () {
      let _this = this
      if (_this.info.diagnosis && _this.info.diagnosis.length > 500) {
        _this.$message.warning('详情字数不能超过500!')
        return
      }
      _this.$api.TplDiagnosisSave(_this.info)
        .then(res => {
          console.log(res)
          if (res.success) {
            let row = {
              activeName: '3'
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
        activeName: '3'
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
  .myform
    margin-top 40px
</style>

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
        el-form-item(label="主诉")
          el-input(size='medium', type="textarea", placeholder='请填写主诉病状(500字以内)', v-model="info.chiefComplaint", :disabled="isDisabled")
        el-form-item(label="诊断详情")
          el-input(size='medium', type="textarea", placeholder='请填写诊断详情(500字以内)', v-model="info.diagnosis", :disabled="isDisabled")
        // el-form-item(label="医生建议")
        //   el-input(size='medium', type="textarea", placeholder='请填写医生建议情(500字以内)', v-model="info.advice", :disabled="isDisabled")
        // el-form-item(label="备注")
        //   el-input(size='medium', type="textarea", placeholder='请填写备注(500字以内,可不填)', v-model="info.remark", :disabled="isDisabled")
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
    _this.isSelf = _this.$route.query.isSelf
    switch (_this.$route.query.isEdit) {
      case '1': _this.isDisabled = false
        break
      case '2': _this.isDisabled = true
        break
    }
    _this.info = _this.$route.query
  },
  methods: {
    save () {
      let _this = this
      if (_this.info.chiefComplaint && _this.info.chiefComplaint.length > 500) {
        _this.$message.warning('主诉的字数不能超过500!')
        return
      }
      if (_this.info.diagnosis && _this.info.diagnosis.length > 500) {
        _this.$message.warning('诊断详情的字数不能超过500!')
        return
      }
      // if (_this.info.advice && _this.info.advice.length > 500) {
      //   _this.$message.warning('医生建议的字数不能超过500!')
      //   return
      // }
      // if (_this.info.remark && _this.info.remark.length > 500) {
      //   _this.$message.warning('备注的字数不能超过500!')
      //   return
      // }
      _this.$api.medicalRecordSave(_this.info)
        .then(res => {
          if (res.success) {
            let row = {
              activeName: '2'
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
        activeName: '2'
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

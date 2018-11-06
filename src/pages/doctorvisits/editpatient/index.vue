<template lang="pug">
  .pagecontent
    .topnavinfo
      .left 当前科室：
        span {{$store.state.userInfo.deptName}}
      .right
        el-button(type="primary", size='mini', @click='updata') 保存
        el-button(size='mini', type="info", plain, @click='$router.go(-1)') 取消
    
    el-row.con
      el-col.left(:xs="6", :sm="6", :md="6", :lg="4", :xl="4")
        el-form(label-width="80px", label-position="left", :model="patientinfo")
          el-form-item(label="姓名:", required)
            el-input(size='medium', placeholder='填写姓名', v-model="patientinfo.patientName")
          el-form-item(label="手机号:", required)
            el-input(size='medium', placeholder='填写手机号', v-model="patientinfo.mobile", type="number")
          el-form-item(label="身份证:")
            el-input(size='medium', placeholder='填写身份证', v-model="patientinfo.idCard", @blur="getGenderDateOfBirth")
          el-form-item(label="性别:", required)
            el-select.datepk(size='medium', placeholder='选择性别', v-model="patientinfo.gender")
              el-option(label='男', value="0")
              el-option(label='女', value="1")
          el-form-item(label="出生日期:")
            el-date-picker.datepk(
              size='medium',
              align="right",
              type="date",
              :editable= 'false',
              v-model="patientinfo.dateOfBirth",
              placeholder="选择出生日期",
              :picker-options="pickerOptionsones")
            i.itext *身份证和出生日期必填一项
          el-form-item(label="社保号:")
            el-input(size='medium', placeholder='可暂不填写', v-model="patientinfo.socialCard")
        el-form(label-position="top")
          // el-form-item(label="住址：")
            el-col(:span='12')
              el-select(size='medium', placeholder='省', v-model="patientinfo.sex")
                el-option(label='北京', value="1")
            el-col(:span='11', :offset="1")
              el-select(size='medium', placeholder='市', v-model="patientinfo.sex")
                el-option(label='北京', value="1")
            el-col(:span='24')
              el-select(size='medium', placeholder='区', v-model="patientinfo.sex")
                el-option(label='北京', value="1")
            el-col(:span='24')
              el-input(type="textarea", placeholder='请输入详细地址')
          el-form-item(label="住址:")
            el-col(:span='24')
              el-input(type="textarea", placeholder='请输入详细地址', v-model="patientinfo.address")
          
          // el-form-item(label="过敏史：")
            el-col(:span='24')
              el-input(type="textarea", placeholder='请输入过敏史')


      el-col.right(:xs="18", :sm="18", :md="18", :lg="20", :xl="20")
        el-form
          el-row
            el-col(:span='6')
              el-form-item(label="身高／cm")
                el-col(:span='12')
                  el-input(size='medium', placeholder='身高', v-model="patientinfo.height", type="number")
            el-col(:span='6')
              el-form-item(label="体重／kg")
                el-col(:span='12')
                  el-input(size='medium', placeholder='体重', v-model="patientinfo.weight", type="number")
            el-col(:span='12')
              el-form-item(label="血型")
                el-col(:span='8')
                  el-select(size='medium', placeholder='血型', v-model="patientinfo.blood")
                    el-option(label='A', value="A")
                    el-option(label='B', value="B")
                    el-option(label='AB', value="AB")
                    el-option(label='O', value="O")
                el-col(:span='8', :offset='1')
                  el-select(size='medium', placeholder='血型', v-model="patientinfo.bloodType")
                    el-option(label='RH阴性', value="RH阴性")
                    el-option(label='RH阳性', value="RH阳性")

          el-row
            el-col(:span='6')
              el-form-item(label="左耳听力")
                el-col(:span='12')
                  // el-select(size='medium', placeholder='左耳', v-model="patientinfo.sex")
                    el-option(label='正常', value="1")
                  el-input(size='medium', placeholder='左耳', v-model="patientinfo.leftEar")
            el-col(:span='6')
              el-form-item(label="右耳听力")
                el-col(:span='12')
                  el-input(size='medium', placeholder='右耳', v-model="patientinfo.rightEar")
            el-col(:span='12')
              el-form-item(label="视力")
                el-col(:span='8')
                  el-input(size='medium', placeholder='左眼视力', v-model="patientinfo.leftEye")
                el-col(:span='8', :offset='1')
                  el-input(size='medium', placeholder='右眼视力', v-model="patientinfo.rightEye")

          el-row.mt
            el-col(:span='10')
              el-form-item(label="紧急联系人")
                el-col(:span='15')
                  el-input(size='medium', placeholder='请输入姓名', v-model="patientinfo.emergencyContact")
            el-col(:span='6')
              el-form-item(label="关系")
                el-col(:span='12')
                  el-input(size='medium', placeholder='关系', v-model="patientinfo.relation")
                  // el-select(size='medium', placeholder='关系', v-model="patientinfo.sex")
                    el-option(label='父母', value="1")
            el-col(:span='8')
              el-form-item(label="紧急联系人电话")
                el-col(:span='12')
                  el-input(size='medium', placeholder='请输入电话', v-model="patientinfo.emergencyMobile", type="number")

          el-row.mt
            el-col(:span='24')
              el-form-item(label="过敏史：")
                el-col(:span='18')
                  el-input(type="textarea", placeholder='请输入过敏史', v-model="patientinfo.anaphylaxis")
            el-col(:span='24')
              el-form-item(label="个人史：")
                el-col(:span='18')
                  el-input(type="textarea", placeholder='请输入个人史', v-model="patientinfo.personalHistory")
            el-col(:span='24')
              el-form-item(label="家族史：")
                el-col(:span='18')
                  el-input(type="textarea", placeholder='请输入家族史', v-model="patientinfo.familyHistory")
</template>

<script>
import rightAside from '@/components/rightAside'
import { formatTime, regExp } from '@/assets/js/utils'
export default {
  components: {
    rightAside
  },
  data () {
    return {
      patientinfo: {
        patientName: '', // 患者姓名
        gender: '', // 性别 0:男;1:女
        idCard: '', // 身份证号码
        socialCard: '', // 社保卡
        mobile: '', // 手机号
        address: '', // 地址
        height: '', // 身高
        weight: '', // 体重
        blood: '', // 血型 O A B AB
        bloodType: '', // 血型 Rh阴性 Rh阳性
        leftEar: '', // 左耳听力
        rightEar: '', // 右耳听力
        leftEye: '', // 左眼视力
        rightEye: '', // 右眼视力
        emergencyContact: '', // 紧急联系人
        relation: '', // 关系
        emergencyMobile: '', // 紧急联系人号码
        anaphylaxis: '', // 过敏史
        personalHistory: '', // 个人史
        familyHistory: '', // 家族史

        id: '', // 主键
        blackFlag: '', // 是否是黑名单 0不是黑名单 1 是黑名单
        createAt: '', // 创建时间
        createBy: '', // 创建用户
        dateOfBirth: '', // 出生日期
        age: '', // 年龄
        inputCode: '', // 患者姓名拼音
        modifyAt: '', // 修改时间
        modifyBy: '', // 修改用户
        orgCode: '', // 机构id
        patientId: '' // 患者id
      },
      pickerOptionsones: {
        disabledDate: time => {
          return time.getTime() > new Date()
        }
      }
    }
  },
  methods: {
    updata () {
      if (!regExp.trim(this.patientinfo.patientName)) {
        this.$message.error('姓名格式不正确！')
        return false
      }
      if (!this.patientinfo.gender) {
        this.$message.error('请选择性别！')
        return false
      }
      if (!this.patientinfo.dateOfBirth && !this.patientinfo.idCard) {
        this.$message.error('身份证和出生日期需填其中一个！')
        return false
      }
      if (!regExp.trim(this.patientinfo.mobile) || regExp.mobile(this.patientinfo.mobile)) {
        this.$message.error('手机号格式不正确！')
        return false
      }
      if (this.patientinfo.idCard && regExp.idCard(this.patientinfo.idCard)) {
        this.$message.error('请填写有效的身份证号')
        return false
      }
      if (this.patientinfo.dateOfBirth) {
        this.patientinfo.dateOfBirth = formatTime(this.patientinfo.dateOfBirth, 'yyyy-MM-dd')
      }
      this.$api.patientItemUpdate(this.patientinfo).then(res => {
        if (res.success) {
          this.$message.success('保存成功！')
          this.$router.go(-1)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getGenderDateOfBirth (e) {
      if (e.target.value && !regExp.idCard(e.target.value)) {
        let genderNum = Number(e.target.value.slice(16, 17)) % 2
        let year = e.target.value.slice(6, 10)
        let month = e.target.value.slice(10, 12)
        let date = e.target.value.slice(12, 14)
        this.patientinfo.dateOfBirth = year + '-' + month + '-' + date
        this.patientinfo.gender = genderNum ? '0' : '1'
      } else if (e.target.value && regExp.idCard(e.target.value)) {
        this.$message.error('请填写有效的身份证')
      }
    }
  },
  created () {
    let ptinfo = this.$getStore('patientEditInfo')
    if (!ptinfo || !ptinfo.id) {
      this.$message.error('获取不到患者信息！')
      this.$router.go(-1)
    }
    this.patientinfo.patientName = ptinfo && ptinfo.patientName ? ptinfo.patientName : ''
    this.patientinfo.gender = ptinfo && ptinfo.gender ? ptinfo.gender : ''
    this.patientinfo.idCard = ptinfo && ptinfo.idCard ? ptinfo.idCard : ''
    this.patientinfo.dateOfBirth = ptinfo && ptinfo.dateOfBirth ? ptinfo.dateOfBirth : ''
    this.patientinfo.socialCard = ptinfo && ptinfo.socialCard ? ptinfo.socialCard : ''
    this.patientinfo.mobile = ptinfo && ptinfo.mobile ? ptinfo.mobile : ''
    this.patientinfo.address = ptinfo && ptinfo.address ? ptinfo.address : ''
    this.patientinfo.height = ptinfo && ptinfo.height ? ptinfo.height : ''
    this.patientinfo.weight = ptinfo && ptinfo.weight ? ptinfo.weight : ''
    this.patientinfo.blood = ptinfo && ptinfo.blood ? ptinfo.blood : ''
    this.patientinfo.bloodType = ptinfo && ptinfo.bloodType ? ptinfo.bloodType : ''
    this.patientinfo.leftEar = ptinfo && ptinfo.leftEar ? ptinfo.leftEar : ''
    this.patientinfo.rightEar = ptinfo && ptinfo.rightEar ? ptinfo.rightEar : ''
    this.patientinfo.leftEye = ptinfo && ptinfo.leftEye ? ptinfo.leftEye : ''
    this.patientinfo.rightEye = ptinfo && ptinfo.rightEye ? ptinfo.rightEye : ''
    this.patientinfo.emergencyContact = ptinfo && ptinfo.emergencyContact ? ptinfo.emergencyContact : ''
    this.patientinfo.relation = ptinfo && ptinfo.relation ? ptinfo.relation : ''
    this.patientinfo.emergencyMobile = ptinfo && ptinfo.emergencyMobile ? ptinfo.emergencyMobile : ''
    this.patientinfo.anaphylaxis = ptinfo && ptinfo.anaphylaxis ? ptinfo.anaphylaxis : ''
    this.patientinfo.personalHistory = ptinfo && ptinfo.personalHistory ? ptinfo.personalHistory : ''
    this.patientinfo.familyHistory = ptinfo && ptinfo.familyHistory ? ptinfo.familyHistory : ''
    this.patientinfo.id = ptinfo && ptinfo.id ? ptinfo.id : ''
  }
}
</script>

<style lang="stylus">
.tpdr.el-textarea
  textarea
    padding-right 60px
</style>

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
    height 50px
    text-align center
.mt
  margin-top 10px
  position relative
.el-tag
  cursor pointer
  margin-right 15px
.el-tab-pane
  padding 15px 0
.btninput
  width 100px
  margin-right 15px
.abbutton
  position absolute
  right 10px
  top 6px
  z-index 9
.con
  .left
    background $dWhite
    border-right 1px solid $elSilver
    padding 5px
    min-height 630px
  .right
    background $White
    padding 15px
    min-height 630px
.el-form-item
  margin-bottom 10px
.datepk
  width 100% !important
.itext
  font-size 12px
  font-weight normal
  color red
</style>

<template lang="pug">
  .pagecontent
    .content
      .my-row
        .my-col-select
          el-select(placeholder="请选择", v-model="drugTypeSelect", size='small', @change='getDrugdict')
            el-option(:value='-1', label='全部分类')
            el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in drugType", :key="index")
        .my-col-select
          el-select(placeholder="请选择", v-model="isHandle", size='small', @change='getDrugdict')
            el-option(:value='-1', label='全部')
            el-option(:value='0', label='未维护')
            el-option(:value='1', label='已维护')
        .my-col-input
          el-input(placeholder="请输入药品名称或者别名", size='small', v-model="nameSearchval")
            el-button(slot="append", icon="el-icon-search", @click='getDrugdict')
        .my-col
          el-button(icon="el-icon-plus", size='small', @click="showTianjia()") 新增药品字典
      el-row.table
        el-table(:data="dictTableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="name", label="药品名称")
          el-table-column(prop="goodsName", label="别名")
          el-table-column(prop="categoryName", label="药品分类名称", width='120')
          el-table-column(prop="manufacturerName", label="生产厂家")
          el-table-column(prop="prescriptionTypeName", label="处方类型", width='120')
          el-table-column(prop="drugFormName", width='100', label="剂型")
          el-table-column(prop="spec", label="药品规格")
          el-table-column(label="是否维护", width='100', align='center')
            template(slot-scope="scope")
              span {{scope.row.isHandle == 1 ? '已维护' : (scope.row.isHandle === 0 ? '未维护' : '')}}
          el-table-column(label="操作", width='140', align='center')
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click="showTianjia(scope.row.id)") 编辑
              el-button(type="danger", size='mini', @click='delDrug(scope.row)') 删除
      .pagination
        el-pagination(
          background,
          :page-size="dictPageSize",
          layout="total, prev, pager, next, jumper",
          :total="dictTotal",
          :current-page.sync="dictPageNum",
          @current-change='getDrugdictPage')
    el-dialog(
      :visible.sync="addDialogVisible",
      width="800px",
      fullscreen,
      center)
      .dialogtitle(slot='title') {{addDialogName}}药品字典
      .daorubody
        el-row
          .title 药品分类
          .group
            el-col.addgroup.W32
              .addgroupTitle 国家基本药物
              .input
                el-select(placeholder="请选择", v-model="addForm.isEssential", size='mini')
                  el-option(label="是", :value='1')
                  el-option(label="否", :value='2')
            el-col.addgroup.W32
              .addgroupTitle.important 药品分类
              .input
                el-select(placeholder="请选择", v-model="addForm.category", size='mini')
                  el-option(v-for="item, index in DrugClassificationList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
            el-col.addgroup.W32
              .addgroupTitle.important 处方类型
              .input
                el-select(placeholder="请选择", v-model="addForm.prescriptionType", size='mini')
                  el-option(v-for="item, index in PrescriptionList", :key='index', :label="item.dicItemName", :value='+item.dicItemCode')
        el-row
          .group
            el-col.addgroup.W32
              .addgroupTitle(:class="[addForm.category != zhongcaoyaoType ? 'important' : '']") 药品剂型
              .input
                el-select(placeholder="请选择", v-model="addForm.drugForm", size='mini')
                  el-option(v-for="item, index in DrugFormList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
        el-row
          .title.marginTop25 药品信息
          .group
            el-col.addgroup.W50
              .addgroupTitle.important 药品名称
              .input
                el-input(size='mini', v-model="addForm.name", @blur='blurName')
            el-col.addgroup.W50
              .addgroupTitle.important 别名
              .input
                el-input(size='mini', v-model='addForm.goodsName')
        el-row
          .group
            el-col.addgroup.W50
              .addgroupTitle(:class="[addForm.category != zhongcaoyaoType ? 'important' : '']") 生产厂家
              el-autocomplete.input(class="inline-input", size='mini', v-model='addForm.manufacturerName', :fetch-suggestions="selectChangjia", :trigger-on-focus="false", @select="handleSelect")
        el-row
          .title.marginTop25 药品规格
          .group
            el-col.addgroup.W50
              .addgroupTitle.important 每(大单位)
              .input
                el-select.input(v-model="addForm.unit", size='mini')
                  el-option(v-for="item, index in UnitList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
            el-col.addgroup.W50
              .addgroupTitle.important 有(换算量)
              .input
                el-input(size='mini', v-model="addForm.conversion", type="number")
                el-select(placeholder="请选择", v-model="addForm.minUnit", size='mini')
                  el-option(v-for="item, index in UnitList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
        el-row
          .group
            el-col.addgroup.W50
              .addgroupTitle 有(剂量)
              .input
                el-input(size='mini', v-model="addForm.dose", type="number")
                el-select(placeholder="请选择", v-model="addForm.doseUnit", size='mini', clearable)
                  el-option(v-for="item, index in UnitList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
            el-col.addgroup.W50
              .addgroupTitle 规格
              .input
                el-input(size='mini', v-model="addForm.spec", disabled)
        el-row
          .title.marginTop25 用法用量
          .group
            el-col.addgroup.W50
              .addgroupTitle(:class="[addForm.category != zhongcaoyaoType ? 'important' : '']") 药品用法
              .input
                el-select.input(placeholder="请选择", v-model="addForm.useage", size='mini')
                  el-option(v-for="item, index in UseageList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
            el-col.addgroup.W50
              .addgroupTitle(:class="[addForm.category != zhongcaoyaoType ? 'important' : '']") 用药频度
              .input
                el-select.input(placeholder="请选择", v-model="addForm.frequency", size='mini')
                  el-option(v-for="item, index in DrugFrequencyList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
        el-row
          .group
            el-col.addgroup.W50
              .addgroupTitle 单次用量
              .input
                el-input(size='mini', v-model="addForm.singleDose", type="number")
                el-select(v-model="addForm.singleDoseUnit", size='mini')
                  el-option(v-for="item, index in singleDoseList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
        el-row  
          el-col.addgroup
            .addgroupTitle 用法用量
            .input
              #spans(v-html="addForm.instructions")
              //- el-input(type='textarea', size='mini', v-model="addForm.instructions", disabled)
        el-row
          .title.marginTop25 药品说明
          el-col.addgroup
            .addgroupTitle 适应症状
            .input
              el-input(type='textarea', :rows='2', v-model="addForm.symptoms", placeholder="填写适应症状。示例：本品解热镇痛。用于感冒引起的头痛，发热，鼻塞，流涕，咽痛等。")
          el-col.addgroup
            .addgroupTitle 药品性状
            .input
              el-input(type='textarea', :rows='2', v-model="addForm.characters", placeholder="填写药品性状。示例：浅棕色至深棕色的颗粒，味甜、微苦。")
          el-col.addgroup
            .addgroupTitle 不良反应
            .input
              el-input(type='textarea', :rows='2', v-model="addForm.reactions", placeholder="填写不良反应。示例：偶见皮疹、荨麻疹、药热及粒细胞减少；可见困倦、嗜睡、口渴、虚弱感；长期大量用药会导致肝肾功能异常。")
          el-col.addgroup
            .addgroupTitle 注意事项
            .input
              el-input(type='textarea', :rows='2', v-model="addForm.matters", placeholder="填写注意事项。示例：1.忌烟，酒及辛辣，生冷，油腻食物。")
          el-col.addgroup
            .addgroupTitle 药品禁忌
            .input
              el-input(type='textarea', :rows='2', v-model="addForm.taboo")
            //- el-select.input(placeholder="请选择", v-model="select", size='mini')
            //-   el-option(label="餐厅名", value="1")
        el-row
          .title.marginTop25 其他信息
          .group
            el-col.addgroup.W50
              .addgroupTitle 药品条码
              .input
                el-input(size='mini', v-model="addForm.barcode")
            el-col.addgroup.W50
              .addgroupTitle 原产地
              .input
                el-input(size='mini', v-model="addForm.origin")
        .bigbtn(@click='addNew') 确认保存
</template>

<script>
import { htmlDecodeByRegExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      addDialogVisible: false,
      isHandle: -1,
      addForm: {},
      DrugClassification: this.$dicTypeCode.DrugClassification,
      DrugClassificationList: [],
      Prescription: this.$dicTypeCode.Prescription,
      PrescriptionList: [],
      DrugForm: this.$dicTypeCode.DrugForm,
      DrugFormList: [],
      DrugFrequency: this.$dicTypeCode.DrugFrequency,
      DrugFrequencyList: [],
      Useage: this.$dicTypeCode.Useage,
      UseageList: [],
      Unit: this.$dicTypeCode.Unit,
      UnitList: [],
      // MinUnit: this.$dicTypeCode.MinUnit,
      // MinUnitList: [],
      // DoseUnit: this.$dicTypeCode.DoseUnit,
      // DoseUnitList: [],
      changjiaList: [],
      select: '',
      addDialogName: '',

      dictTableData: [],
      dictTotal: 0,
      dictPageNum: 1,
      dictPageSize: this.$store.state.userAgent ? 8 : 20,
      drugTypeSelect: -1,
      nameSearchval: '',
      zhongcaoyaoType: ''
    }
  },
  computed: {
    drugType () {
      return this.$store.state.drugType
    },
    singleDoseList () {
      let list = []
      if (this.addForm.minUnit) {
        this.UnitList.map(item => {
          if (this.addForm.minUnit == item.dicItemCode) {
            list.push(item)
          }
        })
      }
      if (this.addForm.doseUnit) {
        this.UnitList.map(item => {
          if (this.addForm.doseUnit == item.dicItemCode) {
            list.push(item)
          }
        })
      }
      console.log(list)
      return list
    }
  },
  methods: {
    // 根据字典类型查找字典列表
    dicItemDicTypeCode (code) {
      this.$api.dicItemDicTypeCode({
        dicTypeCode: code
      }).then(res => {
        if (res.success) {
          switch (code) {
            case this.DrugClassification :
              this.DrugClassificationList = res.result
              sessionStorage.setItem('DrugClassification', JSON.stringify(this.DrugClassificationList))
              break
            case this.Prescription :
              this.PrescriptionList = res.result
              sessionStorage.setItem('Prescription', JSON.stringify(this.PrescriptionList))
              break
            case this.DrugForm :
              this.DrugFormList = res.result
              sessionStorage.setItem('DrugForm', JSON.stringify(this.DrugFormList))
              break
            case this.DrugFrequency :
              this.DrugFrequencyList = res.result
              sessionStorage.setItem('DrugFrequency', JSON.stringify(this.DrugFrequencyList))
              break
            case this.Useage :
              this.UseageList = res.result
              sessionStorage.setItem('Useage', JSON.stringify(this.UseageList))
              break
            case this.Unit :
              this.UnitList = res.result
              sessionStorage.setItem('Unit', JSON.stringify(this.UnitList))
              break
            // case this.MinUnit :
            //   this.MinUnitList = res.result
            //   sessionStorage.setItem('MinUnit', JSON.stringify(this.MinUnitList))
            //   break
            // case this.DoseUnit :
            //   this.DoseUnitList = res.result
            //   sessionStorage.setItem('DoseUnit', JSON.stringify(this.DoseUnitList))
            //   break
          }
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    selectChangjia (queryString, cb) {
      if (queryString) {
        this.$api.manufacturerList({
          name: queryString
        }).then(res => {
          if (res.success) {
            this.changjiaList = res.result
            this.changjiaList.map(item => {
              item.value = item.name
            })
            cb(this.changjiaList)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    handleSelect (item) {
      this.addForm.manufacturer = item.id
    },
    getDrugdictPage (val) {
      this.dictPageNum = val
      this.getDrugdict()
    },
    getDrugdict () {
      this.$api.drugdictlist({
        pageNum: this.dictPageNum,
        pageSize: this.dictPageSize,
        param: {
          isHandle: this.isHandle < 0 ? null : this.isHandle,
          category: this.drugTypeSelect < 0 ? null : this.drugTypeSelect,
          name: this.nameSearchval === '' ? null : this.nameSearchval
        }
      }).then(res => {
        if (res.success) {
          this.dictTableData = res.result.data
          this.dictTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showTianjia (id) {
      this.addForm = {
        unit: 1,
        goodsName: ''
      }
      if (id) {
        this.addDialogName = '编辑'
        this.$api.drugdictdetail({
          id: id
        }).then(res => {
          if (res.success) {
            this.addForm = res.result
            this.addForm.instructions = htmlDecodeByRegExp(this.addForm.instructions)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.addDialogName = '新增'
      }
      // 获取药品分类
      if (sessionStorage.getItem('DrugClassification')) {
        this.DrugClassificationList = JSON.parse(sessionStorage.getItem('DrugClassification'))
      } else {
        this.dicItemDicTypeCode(this.DrugClassification)
      }
      // 获取处方类型
      if (sessionStorage.getItem('Prescription')) {
        this.PrescriptionList = JSON.parse(sessionStorage.getItem('Prescription'))
      } else {
        this.dicItemDicTypeCode(this.Prescription)
      }
      // 获取药品剂型
      if (sessionStorage.getItem('DrugForm')) {
        this.DrugFormList = JSON.parse(sessionStorage.getItem('DrugForm'))
      } else {
        this.dicItemDicTypeCode(this.DrugForm)
      }
      // 获取频率
      if (sessionStorage.getItem('DrugFrequency')) {
        this.DrugFrequencyList = JSON.parse(sessionStorage.getItem('DrugFrequency'))
      } else {
        this.dicItemDicTypeCode(this.DrugFrequency)
      }
      // 获取药品使用方法
      if (sessionStorage.getItem('Useage')) {
        this.UseageList = JSON.parse(sessionStorage.getItem('Useage'))
      } else {
        this.dicItemDicTypeCode(this.Useage)
      }
      // 获取药品大单位
      if (sessionStorage.getItem('Unit')) {
        this.UnitList = JSON.parse(sessionStorage.getItem('Unit'))
      } else {
        this.dicItemDicTypeCode(this.Unit)
      }
      this.addDialogVisible = true
    },
    addNew () {
      // 新增
      if (this.addForm.category === '') {
        this.$message.error('请选择药品分类！')
        return false
      }
      if (!this.addForm.prescriptionType) {
        this.$message.error('请选择处方类型！')
        return false
      }
      if (this.addForm.category != this.zhongcaoyaoType && !this.addForm.drugForm) {
        this.$message.error('请选择药品剂型！')
        return false
      }
      if (!this.addForm.name) {
        this.$message.error('请填写药品名称！')
        return false
      }
      if (this.addForm.category != this.zhongcaoyaoType && !this.addForm.manufacturerName) {
        this.$message.error('请填写生产厂家！')
        return false
      }
      if (!this.addForm.unit) {
        this.$message.error('请选择药品大单位！')
        return false
      }
      if (!this.addForm.conversion) {
        this.$message.error('请填写换算量 ！')
        return false
      }
      if (!this.addForm.minUnit) {
        this.$message.error('请选择换算量单位 ！')
        return false
      }
      // if (!this.addForm.dose) {
      //   this.$message.error('请填写剂量 ！')
      //   return false
      // }
      // if (!this.addForm.doseUnit) {
      //   this.$message.error('请选择剂单位 ！')
      //   return false
      // }
      if (this.addForm.category != this.zhongcaoyaoType && !this.addForm.useage) {
        this.$message.error('请选择药品用法 ！')
        return false
      }
      if (this.addForm.category != this.zhongcaoyaoType && !this.addForm.frequency) {
        this.$message.error('请选择用药频度 ！')
        return false
      }
      if (!this.addForm.goodsName) {
        this.$message.error('请填写别名 ！')
        return false
      }
      this.$api.drugdictupdate(this.addForm)
        .then(res => {
          if (res.success) {
            this.$message.success('添加成功!')
            this.getDrugdict()
            this.addDialogVisible = false
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    delDrug (row) {
      console.log(row)
      this.$confirm('确定删除：' + row.name + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$api.drugdictdel({
          id: row.id
        }).then(res => {
          if (res.success) {
            this.getDrugdict()
            this.$message.success('删除成功!')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        // this.$message.info('已取消删除！')
      })
    },
    blurName (e) {
      console.log(e)
      if (this.addForm.goodsName == '') {
        this.addForm.goodsName = e.target.value
      }
    }
  },
  created () {
    if (this.$store.state.drugType.length > 0) {
      this.$store.state.drugType.map(item => {
        if (item.dicItemName === '中草药') {
          this.zhongcaoyaoType = item.dicItemCode
        }
      })
    } else {
      this.$api.dicItemdicTypeCode('DrugClassification').then(res => {
        if (res.success) {
          this.$store.state.drugType = res.result
          this.$store.state.drugType.map(item => {
            if (item.dicItemName === '中草药') {
              this.zhongcaoyaoType = item.dicItemCode
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
    this.getDrugdict()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
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
  .title
    color #0bbde3
    font-size 12px
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

.marginTop25
  margin-top 25px

.pagination
  margin-top 20px
  text-align center
.content
  min-height 300px
  padding 20px 15px
  background $White

.W32
  width 32%

.W50
  width 49%

.group
  display flex
  flex-direction row
  justify-content space-between    
.addgroup
  display flex
  flex-direction row
  margin-top 10px
  .addgroupTitle
    display flex
    flex-direction row
    justify-content center
    align-items center
    width 110px
    border-left 1px solid $wBlack
    border-top 1px solid $wBlack
    border-bottom 1px solid $wBlack
    border-radius 4px
  .important
    border-left 2px solid $Danger
  .input
    flex 1
    display flex
    flex-direction row
#spans
  width 100%
  border 1px solid $wBlack
  border-radius 4px
  padding 5px
  color #b1b1b1
  font-weight normal
</style>

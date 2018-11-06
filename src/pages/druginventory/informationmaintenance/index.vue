<template lang="pug">
  .pagecontent
    .content
      .my-row
        .my-col-select
          el-select(placeholder="请选择", v-model="listTypeSelect", size='small', @change='druglist')
            el-option(:value='-1', label='全部分类')
            el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in drugType", :key="index")
        .my-col-input
          el-input(placeholder="请输入药品名称或者别名", size='small', v-model="listSearchval", @keyup.enter.native='druglistSearch')
            el-button(slot="append", icon="el-icon-search", @click='druglistSearch')
        .my-col
          el-button(type='primary', size='small', @click='daoruClick') 导入药品信息
          el-button(type='success', size='small', @click="improtdrugfileVisible") 导入药品信息文件
          //- .file
          //-   span 导入药品信息文件
          //-   input.inputfile(type="file", single, accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel", @change='uploadExcel($event)')
          //- el-button(type='info', size='small', plain, @click="exportdrugfile") 导出药品信息文件
          el-button(icon="el-icon-plus", size='small', @click="showTianjia()") 新增药品
      el-row.table
        el-table(:data="listTableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          //- bid (number, optional): 进价 ,
          //- category (string, optional): 药品分类 0:西药；1：中成药；2：中药；3：血液制品；4：诊断试剂 ,
          //- classification (string, optional): 药品类型 0:OTC药品; 1:处方药品 ,
          //- drugCode (string, optional): 药品编码 ,
          //- drugForm (string, optional): 剂型 ,
          //- goodsName (string, optional): 商品名称 ,
          //- id (integer, optional): 药品id ,
          //- manufacturer (integer, optional): 生产厂家 ,
          //- manufacturerName (string, optional): 生产厂家名称 ,
          //- markonpercent (number, optional): 加成率 ,
          //- memo (string, optional): 药品备注 ,
          //- name (string, optional): 药品名称 ,
          //- num (number, optional): 库存数量 ,
          //- orgCode (integer, optional): 医疗机构编码 ,
          //- packNum (integer, optional): 包装数量 ,
          //- packUnit (string, optional): 包装单位 ,
          //- retailPrice (number, optional): 零售价 ,
          //- spec (string, optional): 药品规格 ,
          //- unit (string, optional): 计价单位 ,
          //- useage (string, optional): 使用方法
          el-table-column(prop="name", label="药品名称")
          el-table-column(prop="goodsName", label="别名")
          el-table-column(prop="categoryName", label="药品分类名称")
          el-table-column(prop="manufacturerName", label="生产厂家")
          el-table-column(prop="prescriptionTypeName", label="处方类型")
          el-table-column(prop="drugFormName", width='60', label="剂型")
          el-table-column(label="是否有效", width='80', align='center')
            template(slot-scope="scope")
              i(class="el-icon-success valided", v-if="scope.row.isValid == 1")
              i(class="el-icon-error", v-else)
              //- span {{scope.row.isValid == 1 ? '是' : (scope.row.isValid === 0 ? '否' : '')}}
          el-table-column(prop="spec", label="药品规格")
          el-table-column(label="操作", width='200' align='center')
            template(slot-scope="scope")
              el-button(type="primary", size='mini', @click="showTianjia(scope.row.id)") 编辑
              el-button(type="danger", size='mini', @click='delDrug(scope.row)') 删除
              el-button(type="primary", size='mini', v-if='!scope.row.isValid', @click="validSwitch(scope.row)") 启用
              el-button(type="info", size='mini', v-if='scope.row.isValid', @click="validSwitch(scope.row)") 禁用
      .pagination
        el-pagination(
          background,
          :page-size="listPageSize",
          layout="total, prev, pager, next, jumper",
          :total="listTotal",
          :current-page.sync="listPageNum",
          @current-change='druglistPage')
    el-dialog(
      :visible.sync="centerDialogVisible",
      width="1100px",
      :close-on-click-modal="false",
      top="5vh",
      center)
      .dialogtitle(slot='title') 导入
      .daorubody.disrow
        .daorubodyleft
          .my-row
            //- .my-col-select
            //-   el-select(placeholder="请选择", v-model="drugTypeSelect", size='small', @change='getDrugdict')
            //-     el-option(:value='-1', label='全部分类')
            //-     el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in drugType", :key="index")
            .my-col-input
              el-input(placeholder="请输入药品名称，进行搜索", size='small', clearable, v-model="nameSearchval", @keyup.enter.native='getDrugdictSearch')
                el-button(slot="append", icon="el-icon-search", @click='getDrugdictSearch')
            .my-col-select
              //- el-button(type='primary', size='small', @click='daoru') 确定导入({{selectNum}})
          .tabletitle 待选列表
          div.isShowloadingDialog(v-if="!isShowLoading")
            i.icon-his-loading
          .tablezIndex(v-if="isShowLoading")
            el-table(
              stripe,
              :empty-text="emptyText",
              border,
              size='medium',
              :data='dictTableData',
              style="width: 100%",
              height="580",
              @selection-change='tbsel'
            )
              el-table-column(type="selection", width="55")
              el-table-column(prop="goodsName", label="药品名", width="120")
              el-table-column(prop="manufacturerName", label="生产厂商", width="120")
              el-table-column(prop="categoryName", label="分类", align='center', width="120")
              el-table-column(prop="drugFormName", label="剂型", align='center', width="120")
              el-table-column(prop="spec", label="规格", align='center', width="120")
            .pagination
              el-pagination(
                background,
                :page-size="dictPageSize",
                layout="total, prev, pager, next, jumper",
                :total="dictTotal",
                :current-page.sync="dictPageNum",
                @current-change='getDrugdictPage')
        .daorubodycenter
          .arrowright(@click="daururight")
            i.el-icon-arrow-right
        .daorubodyright
          .my-row
            .my-col
              el-button(type='primary', size='small', @click="daoru") 确定导入
          .tabletitle 已选列表
          el-table(
            stripe,
            border,
            size='medium',
            style="width: 100%",
            height="580",
            :data="dictTableDataList"
          )
            el-table-column(prop="goodsName", label="药品名", width="120")
            el-table-column(prop="manufacturerName", label="生产厂商", width="120")
            el-table-column(label="操作", align='center', width="70")
              template(slot-scope="scope")
                el-button(type="danger", size='mini', @click="deteldaururight(scope.$index)") 删除
    el-dialog(
      :visible.sync="addDialogVisible",
      width="800px",
      fullscreen,
      @close='druglist',
      center)
      .dialogtitle(slot='title') {{addDialogName}}药品
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
              .addgroupTitle.important(v-if="addForm.category != zhongcaoyaoType") 药品剂型
              .addgroupTitle(v-if="addForm.category == zhongcaoyaoType") 药品剂型
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
              .addgroupTitle.important(v-if="addForm.category != zhongcaoyaoType") 生产厂家
              .addgroupTitle(v-if="addForm.category == zhongcaoyaoType") 生产厂家
              .input
                el-autocomplete.autocomplete(class="inline-input", size='mini', v-model='addForm.manufacturerName', :fetch-suggestions="selectChangjia", :trigger-on-focus="false", @select="handleSelect")
                el-button(size='mini', @click="addManufacture") +
            el-col.addgroup.W50  
              .addgroupTitle 最低库存量
              .input
                el-input(size='mini', v-model='addForm.safetyNum', type="number")
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
              //- .addgroupTitle(:class="[addForm.category != zhongcaoyaoType ? 'important' : '']") 药品用法
              .addgroupTitle.important(v-if="addForm.category != zhongcaoyaoType") 药品用法
              .addgroupTitle(v-if="addForm.category == zhongcaoyaoType") 药品用法
              .input
                el-select.input(placeholder="请选择", v-model="addForm.useage", size='mini')
                  el-option(v-for="item, index in UseageList", :key='index', :value='+item.dicItemCode', :label='item.dicItemName')
            el-col.addgroup.W50
              //- .addgroupTitle(:class="[addForm.category != zhongcaoyaoType ? 'important' : '']") 用药频度
              .addgroupTitle.important(v-if="addForm.category != zhongcaoyaoType") 用药频度
              .addgroupTitle(v-if="addForm.category == zhongcaoyaoType") 用药频度
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
              //- el-input(type='textarea', size='mini', v-model="addForm.instructions", disabled)
              #spans(v-html="addForm.instructions")
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
        el-button.bigbtn(type='primary', @click='addNew') 确认保存
        //- category (string, optional): 药品分类 0:西药；1：中成药；2：中药；3：血液制品；4：诊断试剂 ,
        //- classification (string, optional): 药品类型 0:OTC药品; 1:处方药品 ,
        //- drugForm (string, optional): 剂型 ,
        //- goodsName (string, optional): 商品名称 ,
        //- id (integer, optional): 药品id ,
        //- manufacturer (integer, optional): 生产厂家 ,
        //- markonpercent (number, optional): 加成率 ,
        //- memo (string, optional): 药品备注 ,
        //- name (string, optional): 药品名称 ,
        //- packNum (integer, optional): 包装数量 ,
        //- packUnit (string, optional): 包装单位 ,
        //- spec (string, optional): 药品规格 ,
        //- unit (string, optional): 计价单位 ,
        //- useage (string, optional): 使用方法
    el-dialog(
      :visible.sync="addManufactureDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 新增生产厂商
      .addgys
        el-form(label-width="90px", label-position="right")
          el-form-item(label="厂商名称")
            el-input(size='medium', v-model='addManufactureItem.name', placeholder='请输入厂商名称')
          el-form-item(label="许可编号")
            el-input(size='medium', v-model='addManufactureItem.licenceNo', placeholder='请输入许可编号')
          el-form-item(label="地址")
            el-input(size='medium', v-model='addManufactureItem.address', placeholder='请输入地址')
          el-form-item(label="生产范围")
            el-input(size='medium', v-model='addManufactureItem.scope', placeholder='请输入生产范围')
        el-button.bigbtn(type='primary', @click='saveManufacture') 确认

    el-dialog(
      :visible.sync="exportdrugfileDialog",
      width="450px",
      center)
      .dialogtitle(slot='title') 导出药品信息文件
      .addgys
        el-radio(v-model="exportType", :label="1") 导出2007版Excel
        el-radio(v-model="exportType", :label="0") 导出97-2003版Excel
        el-button.bigbtn(type='primary', @click="exportdrugfileExcel") 导出

    el-dialog(
      :visible.sync="improtdrugfileDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 导入药品信息文件
      .addgys
        div 温馨提示:
        div 导入的Excel表格，请按照版本格式正确填写
        .improtdrugfilebody
          .file
            span 导入药品信息文件
            input.inputfile(type="file", single, accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel", @change="drugimporttem($event)")
          el-button.mobanbuttom(type='primary', size='small', @click="exportmodel") 模版下载
</template>

<script>
import { regExp, htmlDecodeByRegExp } from '@/assets/js/utils'
import { hisUrl } from '@/api/config'
export default {
  data () {
    return {
      centerDialogVisible: false,
      addDialogVisible: false,
      addManufactureDialogVisible: false,

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
      listSearchval: '',
      listTypeSelect: -1,
      listPageSize: this.$store.state.userAgent ? 8 : 20,
      listPageNum: 1,
      listTotal: 0,
      listTableData: [],

      nameSearchval: '',
      drugTypeSelect: -1,
      dictPageSize: this.$store.state.userAgent ? 8 : 20,
      dictPageNum: 1,
      dictTotal: 0,
      selectNum: 0,
      dictTableData: [],
      nameStr: '',
      codeStr: '',

      changjiaList: [],
      select: '',
      addDialogName: '',

      addManufactureItem: {},
      zhongcaoyaoType: '',

      exportdrugfileDialog: false,
      exportType: 1,
      uploadaction: hisUrl + 'drug/import',
      dictTableDataList: [],
      selectLists: [],
      improtdrugfileDialogVisible: false,
      emptyText: '请输入药品名称,点击搜索按钮进行查询',
      isShowLoading: true
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
    save () {
      this.$api.drugupdate(this.editForm).then(res => {
        if (res.success) {
          this.$message.success('保存成功!')
          this.editDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSelect (item) {
      this.addForm.manufacturer = item.id
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
    showTianjia (id) {
      this.addForm = {
        unit: 1,
        goodsName: ''
      }
      if (id) {
        this.addDialogName = '编辑'
        this.$api.drugdetail({
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
      // 获取药品小单位
      // if (sessionStorage.getItem('MinUnit')) {
      //   this.MinUnitList = JSON.parse(sessionStorage.getItem('MinUnit'))
      // } else {
      //   this.dicItemDicTypeCode(this.MinUnit)
      // }
      // 获取药品剂量单位（最小单位）
      // if (sessionStorage.getItem('DoseUnit')) {
      //   this.DoseUnitList = JSON.parse(sessionStorage.getItem('DoseUnit'))
      // } else {
      //   this.dicItemDicTypeCode(this.DoseUnit)
      // }
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
      this.$api.drugupdate(this.addForm).then(res => {
        if (res.success) {
          this.$message.success('添加成功!')
          this.getDrugdict()
          this.addDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    daoruClick (data) {
      this.dictTableData = []
      this.dictTableDataList = []
      this.dictTotal = 0
      this.codeStr = ''
      this.nameSearchval = ''
      this.emptyText = '请输入药品名称,点击搜索按钮进行查询'
      this.centerDialogVisible = true
    },
    delDrug (row) {
      console.log(row)
      this.$confirm('确定删除：' + row.name + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$api.drugdel({
          id: row.id
        }).then(res => {
          if (res.success) {
            this.druglist()
            this.$message.success('删除成功!')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        // this.$message.info('已取消删除！')
      })
    },
    getDrugdictSearch () {
      this.isShowLoading = false
      this.dictPageNum = 1
      this.getDrugdict()
    },
    getDrugdictPage (val) {
      this.isShowLoading = false
      this.dictPageNum = val
      this.getDrugdict()
    },
    getDrugdict () {
      this.$api.drugdict({
        pageNum: this.dictPageNum,
        pageSize: this.dictPageSize,
        param: {
          category: this.drugTypeSelect < 0 ? null : this.drugTypeSelect,
          name: this.nameSearchval === '' ? null : this.nameSearchval
        }
      }).then(res => {
        if (res.success) {
          console.log(res.result)
          this.dictTableData = JSON.parse(JSON.stringify(res.result.data))
          this.dictTotal = res.result.total
          this.emptyText = res.result.total == 0 ? '抱歉,暂时查询不到您的搜索内容' : '请输入药品名称,点击搜索按钮进行查询'
          this.isShowLoading = true
        } else {
          this.isShowLoading = true
          this.$message.error(res.msg)
        }
      })
    },
    tbsel (arr) {
      // let nameStr = ''
      // let codeStr = ''
      // this.selectNum = arr.length
      // console.log(arr)
      // for (let i = 0; i < arr.length; i++) {
      //   nameStr += arr[i].name + ','
      //   codeStr += arr[i].id + ','
      // }
      // this.nameStr = nameStr.slice(0, nameStr.length - 1)
      // this.codeStr = codeStr.slice(0, codeStr.length - 1)
      this.selectLists = arr
      // this.daururight()
    },
    daoru () {
      if (this.dictTableDataList.length == 0) {
        this.$message.warning('请将药品导入到【已选列表】中，再进行导入操作')
        return
      }
      this.codeStr = ''
      this.dictTableDataList.map(item => {
        this.codeStr += item.id + ','
      })
      this.$confirm('确定导入吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.codeStr = this.codeStr.slice(0, this.codeStr.length - 1)
        // 确定导入
        this.$api.drugbatch({
          codes: this.codeStr
        }).then(res => {
          if (res.success) {
            this.centerDialogVisible = false
            this.druglist()
            this.$message.success('导入成功!')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消导入！')
      })
    },
    // 获取list
    druglistSearch () {
      this.listPageNum = 1
      this.druglist()
    },
    druglistPage (val) {
      this.listPageNum = val
      this.druglist()
    },
    druglist () {
      this.$api.druglist({
        pageNum: this.listPageNum,
        pageSize: this.listPageSize,
        param: {
          category: this.listTypeSelect < 0 ? null : this.listTypeSelect,
          name: this.listSearchval === '' ? null : this.listSearchval
        }
      }).then(res => {
        if (res.success) {
          console.log(res.result)
          this.listTableData = res.result.data
          this.listTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    validSwitch (row) {
      if (row.needSupplement == 1) {
        this.$message.error('请先编辑完善药品信息后再启用药品')
        return
      }
      this.$api.drugswitch({
        id: row.id
      }).then(res => {
        if (res.success) {
          this.druglist()
          if (row.isValid) {
            this.$message.success('药品已禁用!')
          } else {
            this.$message.success('药品已启用!')
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addManufacture () {
      this.addManufactureItem = {}
      this.addManufactureDialogVisible = true
    },
    saveManufacture () {
      if (regExp.trim(this.addManufactureItem.name) === '') {
        this.$message.error('请填写厂商名称！')
        return false
      }
      this.$api.savemanufacturer(
        this.addManufactureItem
      ).then(res => {
        console.log(res)
        if (res.success) {
          this.$message.success('新增成功！')
          this.addForm.manufacturerName = this.addManufactureItem.name
          this.addManufactureDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 导出药品信息文件
    exportdrugfile () {
      this.exportdrugfileDialog = true
    },
    exportdrugfileExcel () {
      window.location = hisUrl + '/drugdict/export?type=' + this.exportType
      this.exportdrugfileDialog = false
    },
    uploadExcel (event) {
      if (event.target.files[0]) {
        let formData = new FormData()
        formData.append('file', event.target.files[0])
        this.$api.uploadExcel(formData)
          .then(res => {
            if (res.success) {
              this.$message.success('导入成功')
              this.druglist()
            } else {
              this.$message.error(res.msg)
            }
          }).catch(error => console.log(error))
      }
    },
    blurName (e) {
      if (this.addForm.goodsName == '') {
        this.addForm.goodsName = e.target.value
      }
    },
    daururight () {
      let delayselect = JSON.parse(JSON.stringify(this.selectLists))
      if (this.dictTableDataList.length > 0) {
        this.dictTableDataList.map(_item => {
          delayselect.map((item, index) => {
            if (item.id == _item.id) {
              delayselect.splice(index, 1)
            }
          })
        })
      }
      delayselect.map(item => {
        this.dictTableDataList.push(item)
      })
    },
    deteldaururight (index) {
      this.dictTableDataList.splice(index, 1)
    },
    improtdrugfileVisible () {
      this.improtdrugfileDialogVisible = true
    },
    exportmodel () {
      window.location = hisUrl + '/drug/export/templet'
    },
    drugimporttem (event) {
      if (event.target.files[0]) {
        let formData = new FormData()
        formData.append('file', event.target.files[0])
        this.$api.drugimporttem(formData)
          .then(res => {
            if (res.success) {
              this.improtdrugfileDialogVisible = false
              this.$message.success('导入成功')
              this.druglist()
            } else {
              this.$message.error(res.msg)
            }
          }).catch(error => console.log(error))
      }
    }
  },
  created () {
    if (this.$store.state.drugType > 0) {
      this.$store.state.drugType.map(item => {
        if (item.dicItemName === '中草药') {
          this.zhongcaoyaoType = item.dicItemCode
        }
      })
    } else {
      this.$api.dicItemdicTypeCode('DrugClassification').then(res => {
        if (res.success) {
          console.log(res)
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
    this.druglist()
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
    flex 1.5
    margin-right 15px
  .my-col-select
    flex 1
    margin-right 15px
  .my-col
    flex 4
    display flex
    flex-flow row nowrap
    justify-content flex-end
    .upload
      margin 0 10px
.daorubody
  .daorubodyleft
    flex 2
    margin-right 15px
    position relative
  .daorubodyright
    flex 1
    margin-left 15px
  .daorubodycenter
    display flex
    flex-flow row nowrap
    align-items center
    justify-content center
    .arrowright
      width 40px
      height 40px
      border-radius 50%
      display flex
      flex-flow row nowrap
      align-items center
      justify-content center
      background-color $Silver
      color $White
      cursor pointer
      &:hover
        background-color $lSilver
      &:active
        background-color $elSilver
  .title
    color #0bbde3
    font-size 12px
  .bigbtn
    width 100%
    margin-top 20px
    // text-align center
    // padding 6px 0
    // background $Blue
    // border-radius 4px
    // color $White
    // transition all .2s ease
    // cursor pointer
    // &:hover
    //   background lighten($Blue, 20%)

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
    .autocomplete
      flex 1
.addgys
  .bigbtn
    width 100%
    margin-top 20px
#spans
  width 100%
  border 1px solid $wBlack
  border-radius 4px
  padding 12px
  color #b1b1b1
  font-weight normal
  letter-spacing 2px
.improtdrugfilebody
  display flex
  flex-direction column
  align-items center

.file
  width 200px
  height 33px
  position relative
  color #fff
  background-color #67c23a
  border-color #67c23a
  border-radius 3px
  cursor pointer
  text-align center
  line-height 24px
  margin 20px 0
  font-weight normal
  font-size 12px
  &:hover, &:focus
    background #85ce61
    border-color #85ce61
    color #fff
  &:active
    background #5daf34
    border-color #5daf34
    color #fff
    outline 0
  span
    position relative
    z-index 1
    top 4px
    cursor pointer
  .inputfile
    width 200px
    height 33px
    position absolute
    cursor pointer
    overflow hidden
    z-index 10
    top 0
    left 0
    opacity 0
.mobanbuttom
  width 200px
.disrow
  display flex
  flex-direction row
.tabletitle
  font-size 18px
  text-align center
  padding 10px 0
.isShowloadingDialog
  height 580px
  width 100%
  display flex 
  align-items center
  justify-content center
.icon-his-loading
  color #0bbde3
  font-size 30px
</style>

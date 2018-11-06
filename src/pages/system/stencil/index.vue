<template lang="pug">
  .pagecontent
    el-tabs(type="border-card", v-model="activeName", @tab-click="handleClick")
      el-tab-pane(label='处方模板维护', name="1")
        el-row.myrow
          el-col(:span="5")
            el-input(placeholder="请输入模板名称", size='small', clearable, v-model="searchval.tplName", @keyup.enter.native='getTplPrescripTplListSearch')
              el-button(slot="append", icon="el-icon-search", @click="getTplPrescripTplListSearch")
          el-col(:span="4")
            el-select(size='small', placeholder='处方类型', v-model="searchval.category", clearable, @change="getTplPrescripTplList")
              el-option(label='药品处方', value="1")
              el-option(label='检查处方', value="2")
          el-col(:span="4")
            el-select(size='small', placeholder='模板类型', v-model="searchval.isPublic", clearable, @change="getTplPrescripTplList")
              el-option(label='公有', value="1")
              el-option(label='私有', value="0")
          .right(:span="8")
            el-button(size='small', type="primary", v-if="$store.state.userStatus > 0", @click="getGlobalModel") 导入公共模版
            el-button(size='small', @click="CFshowjy") 已禁用（{{CFForbiddenNum}}）
            el-button(size='small', icon="el-icon-plus", @click='CFshowtianjia') 新增模板
        el-table.table(
          :data="CFTableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="处方类型")
            template(slot-scope="scope")
              span {{scope.row.category  == '1' ? '药品处方' : (scope.row.category  == '2' ? '检查处方' : '')}}
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="description", label="模板说明")
          el-table-column(label="状态", width='180')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isSelf=='1'", @click='CFshowedit("1", scope.row)') 编辑
              el-button(size='mini', type="success", @click='CFshowedit("2", scope.row)') 详情
              el-button(size='mini', v-if="scope.row.isSelf=='1'", @click="tplPrescripTplItemSwitch('1', scope.$index, scope.row)") {{scope.row.isValid == '1' ? '禁用' : '启用'}}
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="CFTotal",
            :current-page.sync="CFpageNum",
            @current-change="getTplPrescripTplListPage")
      el-tab-pane(label='病历模板维护', name="2")
        el-row.myrow
          el-col(:span="4")
            el-input(placeholder="请输入模板名称", size='small', clearable, v-model="searchval.tplName", @keyup.enter.native='getTplMedicalRecordListSearch')
              el-button(slot="append", icon="el-icon-search", @click="getTplMedicalRecordListSearch")          
          el-col(:span="3")
            el-select(size='small', placeholder='模板类型', v-model="searchval.isPublic", clearable, @change="getTplMedicalRecordList")
              el-option(label='公有', value="1")
              el-option(label='私有', value="0")
          el-col(:span="3")
            el-select(size='small', placeholder='所属科室', v-model="searchval.dept", clearable, @change="getTplMedicalRecordList")
              el-option(v-for="item, index in deptList", :key='index', :value='item.id', :label='item.dept')
          .right(:span="11")
            el-button(size='small', @click="BLshowjy") 已禁用（{{BLForbiddenNum}}）
            el-button(size='small', icon="el-icon-plus", @click='showBLtianjia') 新增模板
        el-table.table(
          :data="BLTableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")          
          el-table-column(prop="declaratives", label="模板说明")
          el-table-column(label="所属科室")
            template(slot-scope="scope")
              span {{scope.row.deptName}}
              //- el-select(size='small', v-model="scope.row.dept", disabled)
              //-   el-option(v-for="item, index in deptList", :key='item.id', :value='item.id', :label='item.dept')
          el-table-column(label="状态", width='180')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isSelf=='1'", @click='BLShowEdit("1", scope.row)') 编辑
              el-button(size='mini', type="success", @click='BLShowEdit("2", scope.row)') 详情
              el-button(size='mini', v-if="scope.row.isSelf=='1'", @click="switchMedicalRecordModel('1',scope.$index, scope.row)") {{scope.row.isValid == '1' ? '禁用' : '启用'}}
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="BLTotal",
            :current-page.sync="BLpageNum",
            @current-change="getTplMedicalRecordListPage")
      el-tab-pane(label='诊断模板维护', name="3")
        el-row.myrow
          el-col(:span="4")
            el-input(placeholder="请输入模板名称", size='small', clearable, v-model="ZDSearch.name", @keyup.enter.native='getTplDiagnosisListSearch')
              el-button(slot="append", icon="el-icon-search", @click="getTplDiagnosisListSearch")
          .right(:span="11")
            el-button(size='small', @click="ZDshowjy") 已禁用（{{ZDForbiddenNum}}）
            el-button(size='small', icon="el-icon-plus", @click='showZDtianjia') 新增模板 
        el-table.table(
          :data="ZDTableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(label="诊断详情")
            template(slot-scope="scope")
              el-tag.ZDTag(v-for="tag, i in scope.row.diagnosisLists", :key="i")
                span {{tag.length > 20 ? tag.slice(0, 21) + '...' : tag}}
          el-table-column(label="状态", width='180')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isSelf=='1'", @click='ZDShowEdit("1", scope.row)') 编辑
              // el-button(size='mini', type="success", @click='ZDShowEdit("2", scope.row)') 详情
              el-button(size='mini', v-if="scope.row.isSelf=='1'", @click="TplDiagnosisSwitch('1',scope.$index,scope.row.id)") {{scope.row.isValid == '1' ? '禁用' : '启用'}}
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="ZDTotal",
            :current-page.sync="ZDPageNum",
            @current-change="getTplDiagnosisListPage")
      // el-tab-pane(label='医嘱模板维护', name="4")
        el-row.myrow
          el-col(:span="4")
            el-input(placeholder="请输入模板名称", size='small', v-model="ZDSearch.name", @keyup.enter.native='getTplAdviceList')
              el-button(slot="append", icon="el-icon-search", @click="getTplAdviceList")   
          .right(:span="11")
            el-button(size='small', @click="YZshowjy") 已禁用（{{YZForbiddenNum}}）
            el-button(size='small', icon="el-icon-plus", @click='showYZtianjia') 新增模板 
        el-table.table(
          :data="YZTableData",
          stripe,
          border,
          size='medium',
          style="width: 100%"
        )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="createAt", label="创建时间")
          el-table-column(label="状态", width='180')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isSelf=='1'", @click='YZShowEdit("1", scope.row)') 编辑
              el-button(size='mini', type="success", @click='YZShowEdit("2", scope.row)') 详情
              el-button(size='mini', v-if="scope.row.isSelf=='1'", @click="TplAdviceSwitch('1',scope.$index, scope.row.id)") {{scope.row.isValid == '1' ? '禁用' : '启用'}}
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="YZTotal",
            :current-page.sync="YZPageNum",
            @current-change="getTplAdviceListPage")
      el-tab-pane(label='主诉模板维护', name="5")
        chiefcomplaintmodel(ref="chiefcomplain")
    el-dialog(
      :visible.sync="CFtianjiaDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 新增处方模板
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="模板名称")
            el-input(size='medium', placeholder='请填写模板名称', v-model="newAddCFModel.tplName")
          el-form-item(label="处方类型")
            el-select(size='medium', v-model="newAddCFModel.category", placeholder="请选择处方类型")
              el-option(label='药品处方', value="1")
              el-option(label='检查处方', value="2")
          el-form-item(label="模板类型")
            el-select(size='medium', v-model="newAddCFModel.isPublic", placeholder="请选择模板类型")
              el-option(label='公有', value="1")
              el-option(label='私有', value="0")
          el-form-item(label="模板说明")
            el-input(size='medium', type="textarea", placeholder='请填写模板说明（可不填写）', v-model="newAddCFModel.description")
        el-button.bigbtn(type="primary", @click='tplPrescripTplSave(newAddCFModel)') 确定添加

    el-dialog(
      :visible.sync="BLtianjiaDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 新增病历模板
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="模板名称")
            el-input(size='medium', placeholder='请填写模板名称', v-model="newAddBLModel.tplName")
          el-form-item(label="模板分类")
            el-select(size='medium', v-model="newAddBLModel.category", placeholder="请选择模板分类")
              el-option(v-for="item, index in category", :key='index', :label='item.dicItemName', :value="item.dicItemCode")
          el-form-item(label="模板类型")
            el-select(size='medium', v-model="newAddBLModel.isPublic", placeholder="请选择模板类型")
              el-option(label='公有', value="1")
              el-option(label='私有', value="0")
          el-form-item(label="模板说明")
            el-input(size='medium', type="textarea", placeholder='请填写模板说明（可不填写）', v-model="newAddBLModel.declaratives")
        el-button.bigbtn(type="primary", @click='medicalRecordSave(newAddBLModel)') 确定添加

    el-dialog(
      :visible.sync="ZDtianjiaDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') {{newAddZDModel.id ? '编辑' : '新增'}}诊断模板
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="模板名称")
            el-input(size='medium', placeholder='请填写模板名称', v-model="newAddZDModel.tplName", :maxlength="50")
            .ZDnewAddZDModellist-num {{newAddZDModel.tplName.length}}/50
          // el-form-item(label="诊断分类")
          //   el-select(size='medium', v-model="newAddZDModel.category", placeholder="请选择诊断分类")
          //     el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in category", :key='index')
          el-form-item(label="模板类型")
            el-select(size='medium', v-model="newAddZDModel.isPublic", placeholder="请选择模板类型")
              el-option(label='公有', value="1")
              el-option(label='私有', value="0")
          el-form-item(label="模板详情")
            .ZDnewAddZDModellist(v-for="item, i in ZDnewAddZDModellist", :key="i")
              el-input(type="textarea", :autosize="{minRows: 2}", size='medium', placeholder='请填写诊断详情', v-model="ZDnewAddZDModellist[i]", :maxlength="300")
              .ZDnewAddZDModellist-num {{ZDnewAddZDModellist[i].length}}/300
            el-button(size="medium", @click="ZDnewAddZDModellist.push('')") + 新增
        el-button.bigbtn(type="primary", @click='TplDiagnosisSave', :disabled="ZDLock") 确定添加

    el-dialog(
      :visible.sync="YZtianjiaDialogVisible",
      width="450px",
      center)
      .dialogtitle(slot='title') 新增医嘱模板
      .tianjiaDoctor
        el-form.myform(label-width="80px", label-position="right")
          el-form-item(label="模板名称")
            el-input(size='medium', placeholder='请填写模板名称', v-model="newAddYZModel.tplName")
          el-form-item(label="诊断分类")
            el-select(size='medium', v-model="newAddYZModel.category", placeholder="请选择诊断分类")
              el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in category", :key='index')
          el-form-item(label="模板类型")
            el-select(size='medium', v-model="newAddYZModel.isPublic", placeholder="请选择模板类型")
              el-option(label='公有', value="1")
              el-option(label='私有', value="0")
          el-form-item(label="模板详情")
            el-input(size='medium', type="textarea", placeholder='请填写模板详情', v-model="newAddYZModel.advice")
        el-button.bigbtn(type="primary", @click='TplAdviceSave(newAddYZModel)') 确定添加

    el-dialog(
      :visible.sync="CFJYDialogVisible",
      width="900px",
      :before-close="CFJYClose",
      center)
      .dialogtitle(slot='title') 已禁用
      .quanxianBody
        el-table(:data="CFJYTableData",
            stripe,
            border,            
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="处方类型")
            template(slot-scope="scope")
              span {{scope.row.category  == '1' ? '药品处方' : (scope.row.category  == '2' ? '检查处方' : '')}}
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="description", label="模板说明")
          el-table-column(label="状态", width='140')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isValid == '0'", @click="tplPrescripTplItemSwitch('2', scope.$index, scope.row)") 恢复
              el-button(size='mini', v-if="scope.row.isValid == '1'" disabled) 已恢复
              el-button(size='mini', type="danger", v-if="scope.row.isValid != '1'", @click="prescripTplDel(scope.$index, scope.row)") 删除
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="CFJYTotal",
            :current-page.sync="CFJYpageNum",
            @current-change="getCFJYListsPage")
    el-dialog(
      :visible.sync="BLJYDialogVisible",
      width="900px",
      :before-close="BLJYClose",
      center)
      .dialogtitle(slot='title') 已禁用
      .quanxianBody
        el-table(:data="BLJYTableData",
            stripe,
            border,            
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="tplName", label="模板名称")         
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="declaratives", label="模板说明")
          el-table-column(label="状态", width='140')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isValid == '0'", @click="switchMedicalRecordModel('2', scope.$index, scope.row)") 恢复
              el-button(size='mini', v-if="scope.row.isValid == '1'" disabled) 已恢复
              el-button(size='mini', type="danger", v-if="scope.row.isValid != '1'", @click="medicalRecordDel(scope.$index, scope.row)") 删除
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="BLJYTotal",
            :current-page.sync="BLJYpageNum",
            @current-change="getBLJYListsPage")
    el-dialog(
      :visible.sync="ZDJYDialogVisible",
      width="900px",
      :before-close="ZDJYClose",
      center)
      .dialogtitle(slot='title') 已禁用
      .quanxianBody
        el-table(:data="ZDJYTableData",
            stripe,
            border,            
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="createAt", label="创建时间")
          el-table-column(label="状态", width='140')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isValid == '0'", @click="TplDiagnosisSwitch('2', scope.$index, scope.row.id)") 恢复
              el-button(size='mini', v-if="scope.row.isValid == '1'" disabled) 已恢复
              el-button(size='mini', type="danger", v-if="scope.row.isValid != '1'", @click="TplDiagnosisDel(scope.$index, scope.row)") 删除
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="ZDJYTotal",
            @current-change="getZDJYListsPage")
    el-dialog(
      :visible.sync="YZJYDialogVisible",
      width="900px",
      :before-close="YZJYClose",
      center)
      .dialogtitle(slot='title') 已禁用
      .quanxianBody
        el-table(:data="YZJYTableData",
            stripe,
            border,            
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="createAt", label="创建时间")
          el-table-column(label="状态", width='140')
            template(slot-scope="scope")
              el-button(size='mini', type="primary", v-if="scope.row.isValid == '0'", @click="TplAdviceSwitch('2', scope.$index, scope.row.id)") 恢复
              el-button(size='mini', v-if="scope.row.isValid == '1'" disabled) 已恢复
              el-button(size='mini', type="danger", v-if="scope.row.isValid != '1'", @click="TplAdviceDel(scope.$index, scope.row)") 删除
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="YZJYTotal",
            @current-change="getYZJYListsPage")

    // 获取公共模版列表
    el-dialog(
      :visible.sync="GMDialogVisible",
      width="900px",
      center)
      .dialogtitle(slot='title') 公共模版
      .quanxianBody
        .my-row
          .my-col-input
            el-input(placeholder="请输入模版名称", size='small', clearable, v-model="GMsearchname", @keyup.enter.native='getGMLists')
              el-button(slot="append", icon="el-icon-search", @click='getGMLists')
          .my-col
            el-button(type='primary', size='small', @click="GMimport") 确定导入
        el-table.table(:data="GMTableData",
            stripe,
            border,            
            size='medium',
            style="width: 100%",
            @selection-change='GMselect'
          )
          el-table-column(type="selection", width="55")
          el-table-column(prop="tplName", label="模板名称")
          el-table-column(label="处方类型")
            template(slot-scope="scope")
              span {{scope.row.category  == '1' ? '药品处方' : (scope.row.category  == '2' ? '检查处方' : '')}}
          el-table-column(label="模板类型")
            template(slot-scope="scope")
              span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
          el-table-column(prop="createUserName", label="创建人")
          el-table-column(prop="description", label="模板说明")
        .pagination
          el-pagination(
            background,
            :page-size="pageSize",
            layout="total, prev, pager, next, jumper",
            :total="GMTotal",
            @current-change="getGMListsPage")
</template>
<script>
import { regExp } from '@/assets/js/utils'
import chiefcomplaintmodel from './chiefcomplaintmodel'
export default {
  components: { chiefcomplaintmodel },
  data () {
    return {
      activeName: '1',
      searchval: {
        tplName: '',
        category: '',
        isPublic: '',
        dept: '',
        isValid: '1'
      },
      ZDSearch: {
        name: '',
        isPublic: '',
        isValid: '1'
      },
      deptList: [],
      category: [],

      CFTableData: [],
      CFTotal: 0,
      CFForbiddenNum: 0,
      CFpageNum: 1,
      newAddCFModel: {},
      CFJYTableData: [],
      CFJYTotal: 0,
      CFJYpageNum: 1,
      CFJYDialogVisible: false,
      CFtianjiaDialogVisible: false,

      BLTableData: [],
      BLTotal: 0,
      BLForbiddenNum: 0,
      BLpageNum: 1,
      newAddBLModel: {
        tplName: '',
        category: '',
        isPublic: '0',
        declaratives: ''
      },
      BLJYTableData: [],
      BLJYTotal: 0,
      BLJYpageNum: 1,
      BLJYDialogVisible: false,
      BLtianjiaDialogVisible: false,

      ZDTableData: [],
      ZDTotal: 0,
      ZDForbiddenNum: 0,
      ZDPageNum: 1,
      newAddZDModel: {
        id: '',
        tplName: '',
        isPublic: '1',
        diagnosis: ''
      },
      ZDJYTableData: [],
      ZDJYTotal: 0,
      ZDJYpageNum: 1,
      ZDJYDialogVisible: false,
      ZDtianjiaDialogVisible: false,
      ZDnewAddZDModellist: [],
      ZDLock: false,

      YZTableData: [],
      YZTotal: 0,
      newAddYZModel: {},
      YZJYTableData: [],
      YZJYTotal: 0,
      YZJYpageNum: 1,
      YZJYDialogVisible: false,
      YZForbiddenNum: 0,
      YZPageNum: 1,
      YZtianjiaDialogVisible: false,

      pageSize: this.$store.state.userAgent ? 8 : 20,
      // 公共模版
      GMDialogVisible: false,
      GMTotal: 0,
      GMTableData: [],
      GMpageNum: 1,
      GMselectLists: '',
      GMsearchname: ''
    }
  },
  created () {
    this.getDeptList()
    let query = this.$route.query.activeName
    if (query) {
      this.activeName = query
    }
    switch (this.activeName) {
      case '1': this.getTplPrescripTplList()
        break
      case '2': this.getTplMedicalRecordList()
        break
      case '3': this.getTplDiagnosisList()
        break
      case '4': this.getTplAdviceList()
        break
      case '5': this.$refs.chiefcomplain.getTplChiefComplaintList()
        break
    }
  },
  methods: {
    handleClick () {
      let _this = this
      _this.PageNum = 1
      _this.searchval = {
        tplName: '',
        category: '',
        isPublic: '',
        dept: '',
        isValid: '1'
      }
      _this.ZDSearch = {
        name: '',
        isPublic: '',
        isValid: '1'
      }
      switch (_this.activeName) {
        case '1': _this.getTplPrescripTplList()
          break
        case '2': _this.getTplMedicalRecordList()
          break
        case '3': _this.getTplDiagnosisList()
          break
        case '4': _this.getTplAdviceList()
          break
        case '5': this.$refs.chiefcomplain.getTplChiefComplaintList()
          break
      }
    },
    CFshowtianjia () {
      this.newAddCFModel = {}
      this.CFtianjiaDialogVisible = true
    },
    showBLtianjia () {
      this.newAddBLModel = {
        tplName: '',
        category: '',
        isPublic: '0',
        declaratives: ''
      }
      this.dicItemDicTypeCode(this.$dicTypeCode.MedicalRecordTpl)
      this.BLtianjiaDialogVisible = true
    },
    showZDtianjia () {
      this.ZDLock = false
      this.newAddZDModel = {
        id: '',
        tplName: '',
        isPublic: '1',
        diagnosis: ''
      }
      this.ZDnewAddZDModellist = []
      // this.dicItemDicTypeCode(this.$dicTypeCode.DiagnosisTpl)
      this.ZDtianjiaDialogVisible = true
    },
    showYZtianjia () {
      this.newAddYZModel = {}
      this.dicItemDicTypeCode(this.$dicTypeCode.AdviceTpl)
      this.YZtianjiaDialogVisible = true
    },
    CFshowjy () {
      this.CFJYpageNum = 1
      this.CFJYDialogVisible = true
      this.getCFJYLists()
    },
    CFJYClose (done) {
      this.getTplPrescripTplList()
      done()
    },
    BLshowjy () {
      this.BLJYpageNum = 1
      this.BLJYDialogVisible = true
      this.getBLJYLists()
    },
    BLJYClose (done) {
      this.getTplMedicalRecordList()
      done()
    },
    ZDshowjy () {
      this.ZDJYpageNum = 1
      this.ZDJYDialogVisible = true
      this.getZDJYLists()
    },
    ZDJYClose (done) {
      this.getTplDiagnosisList()
      done()
    },
    YZshowjy () {
      this.YZJYpageNum = 1
      this.YZJYDialogVisible = true
      this.getYZJYLists()
    },
    YZJYClose (done) {
      this.getTplAdviceList()
      done()
    },
    // 获取科室
    getDeptList () {
      this.$api.getDeptList()
        .then(res => {
          if (res.success) {
            this.deptList = res.result
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 根据字典类型查找字典列表
    dicItemDicTypeCode (code) {
      let _this = this
      _this.$api.dicItemDicTypeCode({
        dicTypeCode: code
      }).then(res => {
        if (res.success) {
          _this.category = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 编辑处方
    CFshowedit (type, row) {
      let _this = this
      let params = {
        category: row.category,
        id: row.id,
        tplName: row.tplName,
        isEdit: type,
        isSelf: row.isSelf
      }
      switch (row.category) {
        case '1': _this.$router.push({path: '/system/addstenciltemplate', query: params})
          break
        case '2': _this.$router.push({path: '/system/checkchufangmodel', query: params})
          break
      }
    },
    // 编辑病历
    BLShowEdit (type, row) {
      row.isEdit = type
      this.$router.push({path: '/system/addbinglistenciltemplate', query: row})
    },
    // 编辑诊断
    ZDShowEdit (type, row) {
      // row.isEdit = type
      // this.$router.push({path: '/system/systemaddzdmodel', query: row})
      this.ZDLock = false
      this.newAddZDModel = {
        id: row.id,
        tplName: row.tplName,
        isPublic: row.isPublic,
        diagnosis: row.diagnosis
      }
      this.ZDnewAddZDModellist = row.diagnosisLists
      console.log(this.ZDnewAddZDModellist)
      this.ZDtianjiaDialogVisible = true
    },
    // 编辑医嘱
    YZShowEdit (type, row) {
      row.isEdit = type
      this.$router.push({path: '/system/systemaddyzmodel', query: row})
    },
    // 处方模板列表
    getTplPrescripTplListSearch () {
      this.CFpageNum = 1
      this.getTplPrescripTplList()
    },
    getTplPrescripTplListPage (val) {
      this.CFpageNum = val
      this.getTplPrescripTplList()
    },
    getTplPrescripTplList () {
      let _this = this
      _this.$api.getTplPrescripTplList({
        pageNum: _this.CFpageNum,
        pageSize: _this.pageSize,
        param: _this.searchval
      }).then(res => {
        if (res.success) {
          _this.getTplPrescripTplDisableNum()
          _this.CFTableData = res.result.data
          _this.CFTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 获取处方已禁用列表
    getCFJYListsPage (val) {
      this.CFJYpageNum = val
      this.getCFJYLists()
    },
    getCFJYLists () {
      let _this = this
      _this.$api.getTplPrescripTplList({
        pageNum: _this.CFJYpageNum,
        pageSize: _this.pageSize,
        param: {'isValid': '0'}
      }).then(res => {
        if (res.success) {
          _this.CFJYTableData = res.result.data
          _this.CFJYTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 新增处方模板
    tplPrescripTplSave (json) {
      let _this = this
      if (regExp.trim(json.tplName) === '' || regExp.trim(json.category) === '') {
        _this.$message.warning('模版名称和处方类型不能为空!')
        return
      }
      _this.tianjiaDialogVisible = false
      _this.$api.tplPrescripTplSave(json)
        .then(res => {
          if (res.success) {
            if (json.category == '1') {
              _this.$router.push({path: '/system/addstenciltemplate', query: {id: res.result.id}})
            }
            if (json.category == '2') {
              _this.$router.push({path: '/system/checkchufangmodel', query: {id: res.result.id}})
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 删除处方模板
    prescripTplDel (index, row) {
      let _this = this
      _this.$confirm('确定删除：' + row.tplName + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.prescripTplDel({id: row.id})
          .then(res => {
            if (res.success) {
              _this.CFJYTableData.splice(index, 1)
              _this.$message.success('删除成功!')
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(error => console.log(error))
      })
    },
    // 获取处方模板已禁用数
    getTplPrescripTplDisableNum () {
      let _this = this
      _this.$api.getTplPrescripTplDisableNum()
        .then(res => {
          if (res.success) {
            _this.CFForbiddenNum = res.result.num
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 禁用/启用处方模板
    tplPrescripTplItemSwitch (type, index, row) {
      let _this = this
      if (type == '1' && row.isSelf == '0') {
        _this.$message.warning('不能操作他人模板!')
        return
      }
      _this.$api.tplPrescripTplItemSwitch({'id': row.id})
        .then(res => {
          if (res.success) {
            if (type == '1') {
              // _this.CFTableData[index].isValid = _this.CFTableData[index].isValid == '1' ? '0' : '1'
              _this.getTplPrescripTplList()
              _this.getTplPrescripTplDisableNum()
              _this.$message.success('修改成功!')
            }
            if (type == '2') {
              _this.CFJYTableData[index].isValid = _this.CFJYTableData[index].isValid == '1' ? '0' : '1'
              _this.$message.success('修改成功!')
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 病历模板列表
    getTplMedicalRecordListSearch () {
      this.BLpageNum = 1
      this.getTplMedicalRecordList()
    },
    getTplMedicalRecordListPage (val) {
      this.BLpageNum = val
      this.getTplMedicalRecordList()
    },
    getTplMedicalRecordList () {
      let _this = this
      _this.$api.getMedicalRecordList({
        pageNum: _this.BLpageNum,
        pageSize: _this.pageSize,
        param: _this.searchval
      }).then(res => {
        console.log(res)
        if (res.success) {
          _this.medicalRecordForbiddenNum()
          _this.BLTableData = res.result.data
          _this.BLTableData.map(item => {
            _this.deptList.map(_item => {
              if (item.dept == _item.id) {
                item.deptName = _item.dept
              }
            })
          })
          _this.BLTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 获取病历已禁用列表
    getBLJYListsPage (val) {
      this.BLJYpageNum = val
      this.getBLJYLists()
    },
    getBLJYLists () {
      let _this = this
      _this.$api.getMedicalRecordList({
        pageNum: _this.BLJYpageNum,
        pageSize: _this.pageSize,
        param: {'isValid': '0'}
      }).then(res => {
        if (res.success) {
          _this.BLJYTableData = res.result.data
          _this.BLJYTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 删除病历模板
    medicalRecordDel (index, row) {
      let _this = this
      _this.$confirm('确定删除：' + row.tplName + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.medicalRecordDel({id: row.id})
          .then(res => {
            if (res.success) {
              _this.BLJYTableData.splice(index, 1)
              _this.$message.success('删除成功!')
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(error => console.log(error))
      })
    },
    // 新增病历模板
    medicalRecordSave (json) {
      let _this = this
      if (regExp.trim(json.tplName) === '' || regExp.trim(json.category) === '') {
        _this.$message.warning('模版名称和模板分类不能为空!')
        return
      }
      _this.BLtianjiaDialogVisible = false
      _this.$api.medicalRecordSave(json)
        .then(res => {
          if (res.success) {
            json.id = res.result
            this.$router.push({path: '/system/addbinglistenciltemplate', query: json})
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 启用/禁用病历模板
    switchMedicalRecordModel (type, index, row) {
      let _this = this
      if (type == '1' && row.isSelf == '0') {
        _this.$message.warning('不能操作他人模板!')
        return
      }
      switch (row.isValid) {
        case '0': _this.openMedicalRecordUsing(type, index, row.id)
          break
        case '1': _this.closeMedicalRecordUsing(index, row.id)
          break
      }
    },
    // 启用病历模板
    openMedicalRecordUsing (type, index, id) {
      let _this = this
      _this.$api.medicalRecordUsing({'id': id})
        .then(res => {
          if (res.success) {
            _this.$message.success('已启用!')
            if (type == '1') {
              _this.medicalRecordForbiddenNum()
              _this.BLTableData[index].isValid = '1'
            }
            if (type == '2') {
              _this.BLJYTableData[index].isValid = '1'
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 禁用病历模板
    closeMedicalRecordUsing (index, id) {
      let _this = this
      _this.$api.medicalRecordForbidden({'id': id})
        .then(res => {
          if (res.success) {
            _this.$message.success('已禁用!')
            _this.getTplMedicalRecordList()
            _this.medicalRecordForbiddenNum()
            // _this.BLTableData[index].isValid = '0'
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 获取病历模板已禁用病历数
    medicalRecordForbiddenNum () {
      let _this = this
      _this.$api.medicalRecordForbiddenNum()
        .then(res => {
          if (res.success) {
            _this.BLForbiddenNum = res.result
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 诊断模板列表
    getTplDiagnosisListSearch () {
      this.ZDPageNum = 1
      this.getTplDiagnosisList()
    },
    getTplDiagnosisListPage (val) {
      this.ZDPageNum = val
      this.getTplDiagnosisList()
    },
    getTplDiagnosisList () {
      let _this = this
      _this.$api.getTplDiagnosisList({
        pageNum: _this.ZDPageNum,
        pageSize: _this.pageSize,
        param: _this.ZDSearch
      }).then(res => {
        if (res.success) {
          _this.getTplDiagnosisDisableNum()
          _this.ZDTableData = res.result.data
          this.ZDTableData.map(item => {
            if (item.diagnosis) {
              item.diagnosisLists = item.diagnosis.split('&&|&&')
            }
          })
          _this.ZDTotal = res.result.total
          // this.ZDLock = false
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 获取诊断已禁用列表
    getZDJYListsPage (val) {
      this.ZDJYPageNum = val
      this.getZDJYLists()
    },
    getZDJYLists () {
      let _this = this
      _this.$api.getTplDiagnosisList({
        pageNum: _this.ZDJYPageNum,
        pageSize: _this.pageSize,
        param: {'isValid': '0'}
      }).then(res => {
        if (res.success) {
          _this.ZDJYTableData = res.result.data
          _this.ZDJYTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 获取诊断模板已禁用数
    getTplDiagnosisDisableNum () {
      let _this = this
      _this.$api.getTplDiagnosisDisableNum()
        .then(res => {
          if (res.success) {
            _this.ZDForbiddenNum = res.result.num
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 添加、编辑诊断模板
    TplDiagnosisSave (json) {
      this.newAddZDModel.diagnosis = ''
      if (regExp.trim(this.newAddZDModel.tplName) === '') {
        this.$message.warning('模版名称!')
        return
      }
      if (this.newAddZDModel.tplName.length > 50) {
        this.$message.warning('模版名称字数超出限制')
        return
      }
      if (this.ZDnewAddZDModellist.length == 0) {
        this.$message.warning('请新增模版详情')
        return
      }
      if (this.ZDnewAddZDModellist.length == 1) {
        this.newAddZDModel.diagnosis = this.ZDnewAddZDModellist.toString()
      } else if (this.ZDnewAddZDModellist.length > 1) {
        this.ZDnewAddZDModellist.map((item, i) => {
          if (i === 0) {
            if (regExp.trim(item)) {
              this.newAddZDModel.diagnosis = item
            }
          } else {
            if (regExp.trim(item)) {
              this.newAddZDModel.diagnosis += '&&|&&' + item
            }
          }
        })
      }
      if (this.newAddZDModel.diagnosis.length == 0) {
        this.$message.warning('模版详情不能为空')
        return
      }
      this.ZDLock = true
      setTimeout(() => {
        this.$api.TplDiagnosisSave({
          id: this.newAddZDModel.id ? this.newAddZDModel.id : '',
          isPublic: this.newAddZDModel.isPublic ? this.newAddZDModel.isPublic : '',
          tplName: this.newAddZDModel.tplName ? this.newAddZDModel.tplName : '',
          diagnosis: this.newAddZDModel.diagnosis ? this.newAddZDModel.diagnosis : ''
        }).then(res => {
          if (res.success) {
            this.ZDtianjiaDialogVisible = false
            if (this.newAddZDModel.id) {
              this.$message.success('修改成功!')
            } else {
              this.$message.success('新增成功!')
              this.ZDPageNum = 1
            }
            this.getTplDiagnosisList()
          } else {
            this.ZDLock = false
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
      }, 100)
    },
    // 删除诊断模板
    TplDiagnosisDel (index, row) {
      let _this = this
      _this.$confirm('确定删除：' + row.tplName + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.TplDiagnosisDel({id: row.id})
          .then(res => {
            if (res.success) {
              _this.$message.success('删除成功!')
              this.getZDJYLists()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(error => console.log(error))
      })
    },
    // 禁用/启用诊断模板
    TplDiagnosisSwitch (type, index, id) {
      let _this = this
      _this.$api.TplDiagnosisSwitch({'id': id})
        .then(res => {
          if (res.success) {
            if (type == '1') {
              // _this.ZDTableData[index].isValid = _this.ZDTableData[index].isValid == '1' ? '0' : '1'
              _this.getTplDiagnosisList()
              _this.getTplDiagnosisDisableNum()
              _this.$message.success('状态修改成功!')
            }
            if (type == '2') {
              _this.ZDJYTableData[index].isValid = _this.ZDJYTableData[index].isValid == '1' ? '0' : '1'
              _this.$message.success('状态修改成功!')
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    delZDnewAddZDModellist (index) {
      this.ZDnewAddZDModellist.splice(index, 1)
    },
    // 医嘱模板列表
    getTplAdviceListPage (val) {
      this.YZPageNum = val
      this.getTplAdviceList()
    },
    getTplAdviceList () {
      let _this = this
      _this.$api.getTplAdviceList({
        pageNum: _this.YZPageNum,
        pageSize: _this.pageSize,
        param: _this.ZDSearch
      }).then(res => {
        if (res.success) {
          _this.getTplAdviceDisableNum()
          _this.YZTableData = res.result.data
          _this.YZTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    getYZJYListsPage (val) {
      this.YZJYPageNum = val
      this.getYZJYLists()
    },
    getYZJYLists () {
      let _this = this
      _this.$api.getTplAdviceList({
        pageNum: _this.YZJYPageNum,
        pageSize: _this.pageSize,
        param: {'isValid': '0'}
      }).then(res => {
        if (res.success) {
          _this.YZJYTableData = res.result.data
          _this.YZJYTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => console.log(error))
    },
    // 获取医嘱模板已禁用数
    getTplAdviceDisableNum () {
      let _this = this
      _this.$api.getTplAdviceDisableNum()
        .then(res => {
          if (res.success) {
            _this.YZForbiddenNum = res.result.num
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 禁用/启用医嘱模板
    TplAdviceSwitch (type, index, id) {
      let _this = this
      _this.$api.TplAdviceSwitch({'id': id})
        .then(res => {
          if (res.success) {
            if (type == '1') {
              // _this.YZTableData[index].isValid = _this.YZTableData[index].isValid == '1' ? '0' : '1'
              _this.getTplAdviceList()
              _this.getTplAdviceDisableNum()
              _this.$message.success('状态修改成功!')
            }
            if (type == '2') {
              _this.YZJYTableData[index].isValid = _this.YZJYTableData[index].isValid == '1' ? '0' : '1'
              _this.$message.success('状态修改成功!')
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 添加、编辑医嘱模板
    TplAdviceSave (json) {
      let _this = this
      if (regExp.trim(json.tplName) === '' || regExp.trim(json.category) === '') {
        _this.$message.warning('模版名称和诊断分类不能为空!')
        return
      }
      if (json.advice && json.advice.length > 500) {
        _this.$message.warning('模版详情字数不能超过500!')
        return
      }
      _this.YZtianjiaDialogVisible = false
      _this.$api.TplAdviceSave(json)
        .then(res => {
          if (res.success) {
            _this.$message.success('新增成功!')
            _this.YZPageNum = 1
            _this.getTplAdviceList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => console.log(error))
    },
    // 删除医嘱模板
    TplAdviceDel (index, row) {
      let _this = this
      _this.$confirm('确定删除：' + row.tplName + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.TplAdviceDel({id: row.id})
          .then(res => {
            if (res.success) {
              _this.YZJYTableData.splice(index, 1)
              _this.$message.success('删除成功!')
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(error => console.log(error))
      })
    },
    // 导入公共模版
    getGlobalModel () {
      this.GMDialogVisible = true
      this.getGMLists()
    },
    getGMListsPage (val) {
      this.GMpageNum = val
      this.getGMLists()
    },
    getGMLists () {
      this.$api.tplPrescripTplGlobal({
        pageNum: this.GMpageNum,
        pageSize: this.pageSize,
        param: this.GMsearchname
      }).then(res => {
        if (res.success) {
          this.GMTableData = res.result.data
          this.GMTotal = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    GMselect (arr) {
      this.GMselectLists = ''
      arr.map(item => {
        this.GMselectLists += item.id + ','
      })
    },
    GMimport () {
      this.$api.tplPrescripTplImport({
        ids: this.GMselectLists
      }).then(res => {
        if (res.success) {
          this.$message.success('导入成功!')
          this.GMDialogVisible = false
          this.getTplPrescripTplList()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
.myrow
  .el-col
    &:not(:first-child)
      margin-left 15px
  .right
    text-align right 
.quanxianBody
  .title
    &:not(:first-child)
      font-size 14px
      margin-top 20px
  .list
    margin-top 20px
.table
  margin-top 20px
.pagination
  margin-top 20px
  text-align center
.tianjiaDoctor
  .myform
    width 96%
    .el-select, .el-date-editor
      width 100%
  .beizhu
    text-align center
    color $elBlack
    font-size 12px
  .bigbtn
    width 100%
.my-row
  display flex
  flex-flow row nowrap
  align-items center
  justify-content flex-start
  .my-col-input
    flex 0 0 260px
    margin-right 15px
  .my-col
    flex 1
    display flex
    flex-flow row nowrap
    justify-content flex-end
.table
  margin-top 20px
.ZDTag
  display block
  margin-bottom 5px
  font-size 16px
.ZDnewAddZDModellist-num
  position relative
  top -10px
  height 25px
  font-size 10px
  text-align right
</style>

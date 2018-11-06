<template lang="pug">
  div
    el-tabs(v-model="activetab", type="card", @tab-click="activetabClick")
      // 病历tab 选项卡
      el-tab-pane(label="病历", name="one")
        el-row
          el-col(:span='24')
            el-button(size="small", type='success', @click="blModel") 选择病历模板

        el-row
          el-form(label-width="90px", label-position="right", :model="record").mt
            el-col(:xs="11", :sm="11", :md="11", :lg="9", :xl="6")
              el-form-item(label="发病日期", required)
                el-date-picker(
                  size='medium',
                  align="right",
                  type="date",
                  :clearable="false"
                  :editable= 'false',
                  v-model="record.date",
                  placeholder="选择日期",
                  :picker-options="{ disabledDate(time) {return time.getTime() > Date.now()} }")
            el-col(:span="12", :offset="1")
              el-form-item(label="接诊类型")
                el-radio(v-model="record.isFirst", label="1") 初诊
                el-radio(v-model="record.isFirst", label="2") 复诊
                // el-select(size='medium', placeholder='选择', v-model="record.isFirst")
                //   el-option(label='初诊', value="1")
                //   el-option(label='复诊', value="0")
            // el-col(:span='6')
            //   el-form-item(label="是否传染")
            //     el-select(size='medium', placeholder='选择', v-model="record.isContagious")
            //       el-option(label='是', value="1")
            //       el-option(label='否', value="0")

        el-row
          el-form(label-width="90px", label-position="right", :model="record").mt
            el-col(:span='24').mt
              el-form-item(label="主诉", required)
                el-input(type="textarea", placeholder='请输入主诉, 500字以内', v-model="record.chiefComplaint", :maxlength="500", :autosize="{minRows: 3}", @focus="tagchieffocus")
                transition(name="fade")
                  .tags(v-if="showTags")
                    .tags-nodata(v-if="ChiefComplaintlist.length==0") 无可用模版，请在模版维护中进行添加
                    el-tag(v-for="tag, i in ChiefComplaintlist", :key="i", @click.native="selectTag(i)", v-if="ChiefComplaintlist.length>0")
                      span {{tag.tplname}}
                    i.tags-close(class="el-icon-circle-close", @click="tagsChiefClose")
            el-col(:span='24').mt
              // el-button.abbutton(size='small', icon="el-icon-plus", @click='zdModel')
              el-form-item(label="诊断详情", required)
                // el-input.tpdr(type="textarea", placeholder='请输入诊断详情, 500字以内', v-model="record.diagnosis", :maxlength="500", :autosize="{minRows: 3}", @focus="diagnosisFocus")
                .diagnosis-input(@click="diagnosisFocus")
                  .eltags(v-for="tag, i in diagnosisTags", :key="i",)
                    i.eltags-close(class="el-icon-circle-close", @click="handleDiagnosisClose(i)")
                    span {{tag}}
                  el-input.diagnosis-text(placeholder='请输入诊断详情, 500字以内', :maxlength="500", v-model="diagnosisText")
                transition(name="fade")
                  .tags(v-if="showDiagnosisTags")
                    .tags-nodata(v-if="diagnosislist.length==0") 无可用模版，请在模版维护中进行添加
                    el-tag(v-for="tag, i in diagnosislist", :key="i", @click.native="selectDiagnosisTag(i)", v-if="diagnosislist.length>0")
                      span {{tag.tplname}}
                    i.tags-close(class="el-icon-circle-close", @click="tagsDiagnosisClose")
        el-row
          el-col.col(:span='24')
            el-button(size="small", type='info', @click="blempty") 一键清空
            el-button(size="small", type='success', @click='postPre(0)') 保存病历
        el-dialog(
          :visible.sync="blDialogVisible",
          width="900px",
          center)
          .dialogtitle(slot='title') 选择病历模板
          .daorubody
            .my-row
              .my-col-select
                el-select(placeholder="请选择", v-model="bingliMoban.dept", size='small', @change='medicalRecordTpllist')
                  el-option(value='0', label='全部科室')
                  el-option(:value='item.id', :label='item.dept', v-for="item, index in deptLists", :key="index")
              .my-col-input
                el-input(placeholder="模板名或拼音", size='small', v-model="bingliMoban.tplName")
                  el-button(slot="append", icon="el-icon-search", @click='medicalRecordTpllistsearch')
              // .my-col
                el-button(type='primary', size='small', @click='daoru') 确定导入({{selectNum}})
            el-table.table(
              stripe,
              border,
              size='medium',
              :data='bingliMoban.data',
              style="width: 100%",
              @selection-change='medicalRecordTpllist'
            )
              el-table-column(prop="tplName", label="模板名称")
              el-table-column(label="模板类型")
                template(slot-scope="scope")
                  span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
              el-table-column(prop="createUserName", label="创建人")
              el-table-column(prop="declaratives", label="模板说明")
              el-table-column(prop="category", label="操作", align='center', width='80')
                template(slot-scope="scope")
                  el-button(type='primary', size='mini', @click='useBlmoban(scope.row)') 使用
            .pagination
              el-pagination(
                background,
                :page-size="bingliMoban.pageSize",
                layout="total, prev, pager, next, jumper",
                :total="bingliMoban.total",
                :current-page.sync="bingliMoban.pageNum",
                @current-change='medicalRecordTpllistPage')

        el-dialog(
          :visible.sync="zdDialogVisible",
          width="600px",
          center)
          .dialogtitle(slot='title') 选择诊断模板
          .daorubody
            .my-row
              .my-col-input
                el-input(placeholder="模板名或拼音", size='small', v-model="zhenduanMoban.name")
                  el-button(slot="append", icon="el-icon-search", @click='getTplDiagnosisListsearch')
              .my-col
                el-button(type='primary', size='small', @click='daoruZd') 确定选择({{zhenduanMoban.list.length}})
            el-table.table(
              stripe,
              border,
              size='medium',
              :data='zhenduanMoban.data',
              style="width: 100%",
              @selection-change='zdSelct'
            )
              el-table-column(type="selection", width="55")
              el-table-column(prop="tplName", label="模板名称")
              el-table-column(label="模板类型")
                template(slot-scope="scope")
                  span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
              el-table-column(prop="createUserName", label="创建人")
            .pagination
              el-pagination(
                background,
                :page-size="zhenduanMoban.pageSize",
                layout="total, prev, pager, next, jumper",
                :total="zhenduanMoban.total",
                :current-page.sync="zhenduanMoban.pageNum",
                @current-change='getTplDiagnosisListPage')

        el-dialog(
            :visible.sync="yzDialogVisible",
            width="600px",
            center)
            .dialogtitle(slot='title') 选择医嘱模板
            .daorubody
              .my-row
                .my-col-input
                  el-input(placeholder="模板名或拼音", size='small', v-model="yizhuMoban.name")
                    el-button(slot="append", icon="el-icon-search", @click='getTplAdviceList')
                .my-col
                  el-button(type='primary', size='small', @click='daoruYz') 确定选择({{yizhuMoban.list.length}})
              el-table.table(
                stripe,
                border,
                size='medium',
                :data='yizhuMoban.data',
                style="width: 100%",
                @selection-change='yzSelct'
              )
                el-table-column(type="selection", width="55")
                el-table-column(prop="tplName", label="模板名称")
                el-table-column(label="模板类型")
                  template(slot-scope="scope")
                    span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
                el-table-column(prop="createUserName", label="创建人")
              .pagination
                el-pagination(
                  background,
                  :page-size="yizhuMoban.pageSize",
                  layout="total, prev, pager, next, jumper",
                  :total="yizhuMoban.total",
                  :current-page.sync="yizhuMoban.pageNum",
                  @current-change='getTplAdviceListPage')




      // 处方tab 选项卡
      el-tab-pane(label="处方", name="two")
        el-row
          el-col(:span='24')
            el-tag(
              :key="index",
              v-for="tag, index in dynamicTags",
              closable,
              :type="index == tagtype ? '': 'info'",
              :disable-transitions="false",
              @close="handleClose(index)",
              @click.native='changetype(index)') {{tag.name + (index+1)}}
                span(v-if='tag.type == -1') (检查处方)
                span(v-if='item.dicItemCode == tag.type', v-for="item, index in drugType", :key="index")
                //- span(v-if='item.dicItemCode == tag.type', v-for="item, index in drugType", :key="index") ({{item.dicItemName}})
            // el-input.btninput(
              class="input-new-tag",
              v-if="inputVisible",
              v-model="inputValue",
              ref="saveTagInput",
              size="small",
              @keyup.enter.native="handleInputConfirm",
              @blur="handleInputConfirm")
            // el-button(v-else, size="small", @click="showInput") + 新处方
            el-button(size="small", @click="handleInputConfirm") + 新处方
            el-button(size="small", type='success', @click="addNewForModel") 从模板添加
        .fayaobody(ref='printdynamicBody', style='display:none')
          div(style="width:700px;margin: 0 auto;box-sizing: border-box;")
            div
              button.noprint(onclick='window.print()') 打印
              button.noprint(onclick='window.close()', style='margin-left:10px;') 关闭页面
            h1(style='font-size:33px;text-align:center;margin-bottom: 50px;letter-spacing: 2px;') {{$store.state.userInfo.orgName}}处方笺
            div(style='float:left;width:100%;margin-bottom: 10px;padding:30px 25px 0 25px;border-top:2px solid #000;box-sizing: border-box;')
              p(style='width: 38%;display: inline-block;margin:0;') 处方编号：
                span(style="color: red;") {{prescriptionNo ? prescriptionNo : prescriptionNoT}}
              p(style='width: 33%;display: inline-block;margin:0;') 开方日期：{{printdynamicDate}}
              p(style='width: 28%;display: inline-block;margin:0;') 费用类别：自费

            div(style='float:left;width:100%;margin-bottom: 10px;padding:0 25px;box-sizing: border-box;')
              p(style='width: 38%;display: inline-block;margin:0;') 姓名：{{patientinfo.patientName}}
              p(style='width: 33%;display: inline-block;margin:0;') 性别：
                span(v-if="patientinfo.gender == 0") 男
                span(v-if="patientinfo.gender == 1") 女
              p(style='width: 28%;display: inline-block;margin:0;') 年龄：{{patientinfo.age}}岁

            div(style='float:left;width:100%;margin-bottom: 10px;padding:0 25px;box-sizing: border-box;')
              p(style='width: 38%;display: inline-block;margin:0;') 所属科室：{{$store.state.userInfo.deptName}}
              p(style='width: 33%;display: inline-block;margin:0;') 联系方式：{{patientinfo.mobile}}
              p(style='width: 28%;display: inline-block;margin:0;')

            div(style='float:left;width:100%;padding:0 25px 30px 25px;border-bottom:2px solid #000;box-sizing: border-box;')
              p(style='display: inline-block;margin:0;') 诊断详情：
                span(v-for="item, i in diagnosisTags", :key="i", v-if="i==0") {{item}}
                span(v-else) , {{item}}
                span(v-if="diagnosisTags.length > 0 && diagnosisText != ''") , {{diagnosisText}}
                span(v-if="diagnosisTags.length == 0 && diagnosisText != ''") {{diagnosisText}}

            div(style="font-size:33px;font-style:'FZDBSJW--GB1-0';padding: 20px 25px") Rp.

            div(style="display:flex;flex-direction:row;box-sizing: border-box;margin:0 25px 20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
              span(style="flex:1;") 序号
              span(style="flex:2;") 药品名称
              span(style="flex:2;") 规格
              span(style="flex:1;") 总量
            div(v-for="tag, index in dynamicTags", :key="index", v-if="index == tagtype && tag.type != -1", style='margin-bottom: 20px;')
              div(v-for="item, i in tag.itemList", :key="i",style="box-sizing: border-box;margin:0 25px 20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
                div(style="display:flex;flex-direction:row;padding-bottom:10px;")
                  span(style="flex:1;") {{i+1}}
                  span(style="flex:2;") {{item.drugName}}
                  span(style="flex:2;") {{item.drugSpec ? item.drugSpec : item.spec}}
                  span(style="flex:1;") {{item.num}}
                    span(v-if="item.unitType == 1") {{item.unitName}}
                    span(v-if="item.unitType == 2 && item.minPriceUnitType == 1") {{item.minUnitName}}
                    span(v-if="item.unitType == 2 && item.minPriceUnitType == 2") {{item.doseUnitName}}
                div(style="display:flex;flex-direction:row;padding-bottom:10px;")
                  span(style="flex:1;")
                  span(style="flex:5;") 用法:
                    span(style="color:#666666") {{item.useageName}}
                    span(style='padding-left: 10px;color:#666666') {{item.singleDose ? '每次' + item.singleDose : ''}}{{item.singleDose ? item.singleDoseUnitName : ''}}
                    span(v-for="drug in pinciList", :key="drug.dicItemCode", v-if="item.frequency == drug.dicItemCode", style='padding-left: 10px;color:#666666') {{drug.dicItemName}}
                div(style="display:flex;flex-direction:row;")
                  span(style="flex:1;")
                  span(style="flex:5;") 备注: 
                    span(style="color:#666666") {{item.memo}}
              div(style="text-align:center;margin-bottom:100px;") 以下空白
            div(style='font-size:16px;margin-bottom:10px;padding-top:10px;border-top:2px solid #000;') 医生签名：
            div(style='font-size:16px;display:flex;flex-direction:row;')
              span(style="flex:1;") 审核药师：
              span(style="flex:1;") 调配药师/士：
              span(style="flex:1;") 核对、发药药师：
            // div(v-if="printIndex < 7", style="position:fixed;bottom:0;width:100%")
            //   div(style='font-size:16px;margin-bottom:10px;padding-top:10px;border-top:2px solid #000;') 医生签名：
            //   div(style='font-size:16px;display:flex;flex-direction:row;')
            //     span(style="flex:1;") 审核药师：
            //     span(style="flex:1;") 调配药师/士：
            //     span(style="flex:1;") 核对、发药药师：
        el-row
          el-col.mt(
              :span='24'
              :key="index",
              v-for="tag, index in dynamicTags",
              v-show="index == tagtype && tag.type != -1"
            )
            el-table(
              :data="tag.itemList",
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              el-table-column(prop="drugName", label="药品名称", align='center')
              el-table-column(prop="manufacturerName", label="生产厂家", align='center')
              el-table-column(prop="date", label="单价（元）", align='center', min-width='80')
                template(slot-scope="scope")
                  span(v-if="scope.row.unitType == '1'") {{scope.row.retailPrice}}
                  span(v-if="scope.row.unitType == '2'") {{scope.row.minRetailPrice}}
              el-table-column(label="数量", align='center', min-width='160')
                template(slot-scope="scope")
                  el-input(size='mini', placeholder='数量', v-model="scope.row.num", type="number", :disabled="scope.row.payStatus == 1")
                    el-select.select(slot="append", v-model="scope.row.unitType", placeholder="请选择", :disabled="scope.row.payStatus == 1")
                      el-option(:label="scope.row.unitName", :value="1")
                      el-option(:label="scope.row.minUnitName", :value="2", v-if="scope.row.minPriceUnitType == 1")
                      el-option(:label="scope.row.doseUnitName", :value="2", v-if="scope.row.minPriceUnitType == 2")
                      // el-option(label="二级单位", :value="2")
              el-table-column(prop="date", label="单次剂量", align='center', min-width='140')
                template(slot-scope="scope")
                  el-input(size='mini', placeholder='数量', v-model="scope.row.singleDose", type="number", :disabled="scope.row.payStatus == 1")
                    el-button.danwei(slot="append") {{scope.row.singleDoseUnitName}}
              el-table-column(prop="date", label="使用频次", align='center', min-width='120')
                template(slot-scope="scope")
                  el-select(size='mini', v-model="scope.row.frequency", placeholder="使用频次", :disabled="scope.row.payStatus == 1")
                    el-option(v-for="drug in pinciList", :key="drug.dicItemCode", :label="drug.dicItemName", :value="+drug.dicItemCode")
              el-table-column(prop="date", label="备注", align='center', min-width="80")
                template(slot-scope="scope")
                  .menospan(@click="memoModel(scope.row, scope.$index)", :class="[scope.row.payStatus == 1 ? 'disabled' : '']") {{scope.row.memo}}
                  //- el-input(size='mini', placeholder='备注', v-model="scope.row.memo", :disabled="scope.row.payStatus == 1")
              el-table-column(label="操作", width='60', align='center')
                template(slot-scope="scope")
                  el-button(size='mini', icon="el-icon-delete", @click='delDrug(scope.$index)', v-if="scope.row.payStatus != 1")
        el-row
          el-col.mt(
              :span='24',
              :key="index + '1'",
              v-for="tag, index in dynamicTags",
              v-show="index == tagtype && tag.type == -1"
            )
            el-table(
              :data="tag.inspectList",
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              el-table-column(prop="categoryName", label="检查类型", align='center')
              el-table-column(label="检查目的", align='center')
                template(slot-scope="scope")
                  el-input(size='mini', placeholder='检查目的', v-model="scope.row.aim", :disabled="scope.row.payStatus == 1")

              el-table-column(label="检查部位", align='center')
                template(slot-scope="scope")
                  el-input(size='mini', placeholder='检查部位', v-model="scope.row.part", :disabled="scope.row.payStatus == 1")

              el-table-column(label="备注", align='center')
                template(slot-scope="scope")
                  el-input(size='mini', placeholder='备注', v-model="scope.row.memo", :disabled="scope.row.payStatus == 1")

              el-table-column(label="操作", align='center', width='60')
                template(slot-scope="scope")
                  el-button(size='mini', icon="el-icon-delete", @click='delJiancha(scope.$index)', :disabled="scope.row.payStatus == 1")

        el-row
          el-col(:span='24').mt
            el-button(type="primary", icon="el-icon-plus", round, style='margin:0 auto;display:block;', @click='showAside') 添加药品
          // el-col(:span='24').mt
            el-form(
              label-position="top",
              :model="patientinfo", 
              v-for="tag, index in dynamicTags",
              :key="index",
              v-if="index == tagtype")
              el-form-item(label="要求",)
                el-input(type="textarea", v-model="tag.requirement", placeholder='要求（可不填写）')
              el-form-item(label="服药备注")
                el-input(type="textarea", v-model="tag.remark", placeholder='服药备注（可不填写）')
        el-row
          el-col.col(:span='24')
            el-button(size="small", type='success', @click='postPre(0)') 保存信息
            el-button(size="small", type='info', @click="doprintdynamic") 打印处方
        el-dialog(
            :visible.sync="chufangDialogVisible",
            width="800px",
            center)
            .dialogtitle(slot='title') 选择处方模板
            .daorubody
              .my-row
                el-row.myrow
                  el-col(:span="8")
                    el-input(placeholder="请输入模板名称", size='small', v-model="chufangMoban.name")
                      el-button(slot="append", icon="el-icon-search", @click="getTplPrescripTplList")
                  el-col(:span="6", :offset='1')
                    el-select(size='small', placeholder='处方类型', v-model="chufangMoban.category", @change="getTplPrescripTplList")
                      el-option(label='全部', value="")
                      el-option(label='药品处方', value="1")
                      el-option(label='检查处方', value="2")
                  el-col(:span="6", :offset='1')
                    el-select(size='small', placeholder='模板类型', v-model="chufangMoban.isPublic", @change="getTplPrescripTplList")
                      el-option(label='全部', value="")
                      el-option(label='公有', value="1")
                      el-option(label='私有', value="0")
                // .my-col-input
                  el-input(placeholder="模板名或拼音", size='small', v-model="chufangMoban.name")
                    el-button(slot="append", icon="el-icon-search", @click='getTplAdviceList')
              el-table.table(
                stripe,
                border,
                size='medium',
                :data='chufangMoban.data',
                style="width: 100%",
                @selection-change='yzSelct'
              )
                el-table-column(prop="tplName", label="模板名称")
                el-table-column(label="处方类型")
                  template(slot-scope="scope")
                    span {{scope.row.category == '1' ? '药品处方' : '检查处方'}}
                el-table-column(label="模板类型")
                  template(slot-scope="scope")
                    span {{scope.row.isPublic  == '1' ? '公有' : '私有'}}
                el-table-column(prop="createUserName", label="创建人")

                el-table-column(label="操作", align='center', width='80')
                  template(slot-scope="scope")
                    el-button(size='mini', type='primary', @click='useChufangMoban(scope.row)') 使用
              .pagination
                el-pagination(
                  background,
                  :page-size="chufangMoban.pageSize",
                  layout="total, prev, pager, next, jumper",
                  :total="chufangMoban.total",
                  :current-page.sync="chufangMoban.pageNum",
                  @current-change='getTplPrescripTplListPage')
      // 费用tab 选项卡
      el-tab-pane(label="费用", name="three")
        el-row
          el-col(:span='24')
            h3 收费项目
          el-col(:span='24')
            el-table(
              size='medium',
              stripe,
              :data='allList',
              border,
              style="width: 100%"
            )
              el-table-column(prop="name", label="名称")
              el-table-column(prop="manufacturerName", label="生产厂商")
              el-table-column(prop="onePrice", label="单价")
              el-table-column(prop="num", label="数量")
              el-table-column(prop="price", label="金额")
          el-col(:span='24').mt
            h3 附加费用
          el-col(:span='24')
            el-table(
              size='medium',
              stripe,
              border,
              :data="FjfData",
              style="width: 66%"
            )
              el-table-column(prop="categoryName", label="名称", align='center')
              el-table-column(prop="itemPrice", label="价格", align='center')
              el-table-column(label="操作", align='center')
                template(slot-scope="scope")
                  el-button(size='mini', icon="el-icon-delete", @click='delFjf(scope.$index)', v-if="scope.row.payStatus != 1")
          el-button.mt(@click='showFjf') 添加附加费
        el-col(:span='24').mt
          h2 总费用：
            span(style='color:red;') ¥{{allPrice}}
          el-dialog(
            :visible.sync="fjfDialogVisible",
            width="900px",
            center)
            .dialogtitle(slot='title') 选择附加费
            .daorubody
              // .my-row
                .my-col-select
                  el-select(placeholder="请选择", v-model="FjfData.dept", size='small', @change='medicalRecordTpllist')
                    el-option(value='0', label='全部科室')
                    el-option(:value='item.id', :label='item.dept', v-for="item, index in deptLists", :key="index")
                .my-col-input
                  el-input(placeholder="模板名或拼音", size='small', v-model="FjfData.tplName")
                    el-button(slot="append", icon="el-icon-search", @click='medicalRecordTpllist')
                .my-col
                  el-button(type='primary', size='small', @click='daoru') 确定导入({{selectNum}})
              el-table.table(
                stripe,
                border,
                size='medium',
                :data='FjfMoban',
                style="width: 100%",
                @selection-change='medicalRecordTpllist'
              )
                el-table-column(prop="categoryName", label="费用名称", align='center')
                el-table-column(prop="itemPrice", label="价格", align='center')
                el-table-column(prop="category", label="操作", align='center', width='80')
                  template(slot-scope="scope")
                    el-button(type='primary', size='mini', @click='usefjfmoban(scope.row)') 添加

      el-tab-pane(label="注射单", name="four")
        el-row
          .rowcol
            el-button(type="primary", size='small', @click='addZSDGroup') 添加分组
            el-button(size='small', @click='doprint') 打印注射单
        el-row
          .fayaobody(ref='printBody', style='display:none')
            div(style="width:700px;margin: 0 auto;box-sizing: border-box;display:flex;flex-direction:column;")
              div
                button.noprint(onclick='window.print()') 打印处方
                button.noprint(onclick='window.close()', style='margin-left:10px;') 关闭页面
              h1(style='font-size:33px;text-align:center;margin-bottom: 50px;letter-spacing: 2px;') {{$store.state.userInfo.orgName}}注射单
              div(style='display:flex;flex-direction:row;width:100%;font-size:18px;margin-bottom: 10px;padding:30px 25px 0 25px;border-top:2px solid #000;box-sizing: border-box;')
                p(style='width: 33%;display: inline-block;margin:0;') 医生：{{$store.state.userInfo.userName}}
                p(style='width: 33%;display: inline-block;margin:0;') 门诊编号：{{clinicNo ? clinicNo : clinicNoT}}
                p(style='width: 33%;display: inline-block;margin:0;') 日期：{{printdynamicDate}}

              div(style='display:flex;flex-direction:row;width:100%;font-size:18px;padding:0 25px 30px 25px;margin-bottom: 30px;border-bottom:2px solid #000;box-sizing: border-box;')
                p(style='width: 33%;display: inline-block;margin:0;') 姓名：{{patientinfo.patientName}}
                p(style='width: 33%;display: inline-block;margin:0;') 性别：
                  span(v-if="patientinfo.gender == 0") 男
                  span(v-if="patientinfo.gender == 1") 女
                p(style='width: 33%;display: inline-block;margin:0;') 年龄：{{patientinfo.age}}

              div(style="display:flex;flex-direction:row;box-sizing: border-box;margin:0 25px 20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
                span(style="flex:1;") 序号
                span(style="flex:1;") 药品名称
                span(style="flex:1;") 单次用量
                span(style="flex:1;") 单位
                span(style="flex:1;") 使用频次
                span(style="flex:1;") 备注
              div(v-for="tag, i in injectList", :key="i", style="border-bottom:1px dashed #cccccc;margin:0 25px 20px 25px;")
                div(v-for="item, j in tag", :key="j", style="display:flex;flex-direction:row;box-sizing: border-box;margin-bottom:20px;")
                  span(style="flex:1;", v-if="j == 0") {{i+1}}
                  span(style="flex:1;", v-if="j > 0")
                  span(style="flex:1;") {{item.drugName}}
                  span(style="flex:1;") {{item.singleDose}}
                  span(style="flex:1;") {{item.singleDoseUnitName}}
                  span(style="flex:1;", v-for='drug in pinciList', v-if='drug.dicItemCode == item.frequency') {{drug.dicItemName}}
                  span(style="flex:1;") {{item.memo}}
              div(style="text-align:center;margin-bottom:100px;") 以下空白
              // table(style='text-align:center;margin-bottom: 20px;font-size:12px;', border="1", cellpadding='5', cellspacing='0', width='100%')
              //   tr
              //     th 序号
              //     th 药品名称
              //     th 单次用量
              //     th 单位
              //     th 使用频次
              //     th 备注
              //   div(v-for="tag, i in injectList", :key="i")
              //     tr(v-for="item, j in tag", :key="j")
              //       th(:rowspan="tag.length", v-if="j == 0") {{i}}
              //       td {{item.drugName}}
              //       td {{item.singleDose}}
              //       td {{item.singleDoseUnitName}}
              //       td
              //         span(v-for='drug in pinciList', v-if='drug.dicItemCode == item.frequency') {{drug.dicItemName}}
              //       td {{item.memo}}

          el-col(:span='24')
            div(v-for="(tag, index) in injectList" :key="index", style='margin-bottom: 20px;')
              el-table(
                size='medium',
                stripe,
                :data='tag',
                border,
                style="width: 99%"
              )
                el-table-column(prop="drugName", label="名称")
                el-table-column(prop="manufacturerName", label="生产厂商")
                el-table-column(label="单次用量")
                  template(slot-scope="scope")
                    el-input(size='mini', placeholder='单次用量', v-model="scope.row.singleDose", type="number")
                el-table-column(prop="singleDoseUnitName", label="单位")
                el-table-column(label="使用频次")
                  template(slot-scope="scope")
                    el-select(size='mini', v-model="scope.row.frequency", placeholder="使用频次")
                      el-option(v-for="drug in pinciList", :key="drug.dicItemCode", :label="drug.dicItemName", :value="+drug.dicItemCode")
                el-table-column(label="备注")
                  template(slot-scope="scope")
                    el-input(size='mini', placeholder='备注', v-model="scope.row.memo")
                el-table-column(label="操作", width='60', align='center')
                  template(slot-scope="scope")
                    el-button(size='mini', icon="el-icon-delete", @click="delZSDtable(scope.$index)")

              el-col(:span='24').mbt
                el-button(size='small', type="info", @click='closeZSDGroup(index)') 关闭
                el-button(size='small', type="primary", @click='showzhusheAside(index)') 添加药品


    // 右侧栏显示 药品处方添加
    rightAside(ref='rightAside')
      .asideTab
        .top
          .title(:class='{"active": asideTab == 1}', @click='asideTab = 1') 中药／西成药
          .title(:class='{"active": asideTab == 2}', @click='asideTab = 2') 检查
        .asideCon
          .acon(v-show="asideTab == 1")
            .my-row-2
              //- .my-col-select
              //-   el-select(placeholder="请选择", v-model="listTypeSelect", size='small', @change='druglist')
              //-     el-option(:value='-1', label='全部分类')
              //-     el-option(:value='item.dicItemCode', :label='item.dicItemName', v-for="item, index in drugType", :key="index")
              .my-col-input
                el-input(placeholder="请输入药品名称，进行搜索", size='small', v-model="listSearchval", @keyup.enter.native='druglistsearch')
                  el-button(slot="append", icon="el-icon-search", @click='druglistsearch')
            // .search
              el-input(placeholder="请输入内容", size='small')
                el-button(slot="append", icon="el-icon-search")
            .asidetable
              div.isShowloadingDialog(v-if="!isShowLoading")
                i.icon-his-loading
              div(v-if="isShowLoading")
                el-table(
                  :empty-text="emptyText",
                  :data='listTableData',
                  stripe,
                  size='medium',
                  :height="rightTableHeight",
                  ref='yaopinTable',
                  style="width: 100%",
                  @select="isselectd",
                  @selection-change='xuanzeDrug'
                )
                  el-table-column(type="selection", width="50")
                  el-table-column(prop="goodsName", label="名称")
                  el-table-column(prop="manufacturerName", label="生产厂商")
                  el-table-column(prop="spec", label="规格", align='center')
                  el-table-column(prop="numName", label="库存", align='center')
            .asidepagination
              el-pagination(
                small,
                :page-size="listPageSize",
                layout="prev, pager, next",
                :total="listTotal",
                :current-page.sync="listPageNum",
                @current-change='druglistPage')

          .acon(v-show="asideTab == 2")
            // .search
              el-input(placeholder="请输入内容", size='small')
                el-button(slot="append", icon="el-icon-search")
            .asidetable
              el-table.mt(
                stripe,
                :data='inspectCategoryList',
                size='medium',
                ref='jianchaTable',
                :height="rightTableHeight",
                style="width: 100%",
                @selection-change='xuanzeJiancha'
              )
                el-table-column(type="selection", width="55")
                el-table-column(prop="categoryName", label="名称")
                el-table-column(prop="itemPrice", label="单价")
        .asideBtns(v-show="asideTab == 1")
          el-button(type='primary', size='mini', @click='tianjiaDrug(0)') 添加
          el-button(type='success', size='mini', @click='tianjiaDrug(1)') 添加并关闭
        .asideBtns(v-show="asideTab == 2")
          el-button(type='primary', size='mini', @click='tianjiaJiancha(0)') 添加
          el-button(type='success', size='mini', @click='tianjiaJiancha(1)') 添加并关闭

    // 右侧栏显示 注射单添加
    rightAside(ref='zhusherightAside')
      .asideTab
        .top
          .title(class="active") 药品列表
        .asideCon
          .acon.el-form-item
            .asidetable
              el-table(
                :data='zhusheAsideList',
                stripe,
                size='medium',
                :height="rightTableHeight",
                ref='ZSDTable',
                style="width: 100%",
                @selection-change='ZSDchange'
              )
                el-table-column(type="selection", width="50")
                el-table-column(prop="drugName", label="名称")
                el-table-column(prop="manufacturerName", label="生产厂商")
                
          .asideBtns
            el-button(type='primary', size='mini', @click="addzhushe(0)") 添加
            el-button(type='success', size='mini', @click="addzhushe(1)") 添加并关闭

    el-dialog(
      :visible.sync="memoDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 备注
      el-input(type="textarea", :autosize="{ minRows: 4}", v-model="memoValue")
      el-button.memobtn(type="primary", @click="conmemovalue") 确认保存
</template>

<script>
import rightAside from '@/components/rightAside'
import { formatTime, regExp, isCheckNull } from '@/assets/js/utils'
export default {
  props: ['patientinfo', 'applyId', 'status', 'activeName', 'clinicNo', 'prescriptionNo', 'doctorName', 'ChiefComplaintlist', 'diagnosislist'],
  components: {
    rightAside
  },
  data () {
    return {
      activetab: 'one',
      applyIdT: null,
      cfId: null,
      // 处方列表
      dynamicTags: [{
        name: '处方',
        type: '',
        chargeList: [], // 附加费集合
        itemList: [], // 药品集合
        inspectList: [], // 检查集合
        requirement: '',
        remark: ''
      }],
      // 处方显示的ID
      tagtype: 0,
      // inputVisible: false,
      // inputValue: '',
      rightAsideShow: false,
      blDialogVisible: false,
      zdDialogVisible: false,
      yzDialogVisible: false,
      fjfDialogVisible: false,
      chufangDialogVisible: false,

      asideTab: 1,
      listTypeSelect: '',
      listPageNum: 1,
      listPageSize: this.$store.state.userAgent ? 8 : 20,
      listSearchval: '',
      listTableData: [],
      listTotal: 0,
      xuanzeDruglist: [],
      // 用药使用频次
      pinciList: [],
      // 选择的检查列表
      jianchaList: [],
      // 检查项目
      inspectCategoryList: [],
      // 诊断详情
      record: {
        // 医嘱
        advice: '',
        // 主诉
        chiefComplaint: '',
        // 诊断信息
        diagnosis: '',
        // 是否传染病 0：否；1：是
        isContagious: '',
        // isFirst (string, optional): 1 初诊、0 复诊
        isFirst: '1',
        // 发病日期
        date: new Date(),
        onSetDate: '',
        // 备注
        remark: ''
      },
      diagnosisText: '',
      bingliMoban: {
        pageNum: 1,
        pageSize: this.$store.state.userAgent ? 8 : 20,
        total: 0,
        dept: '0',
        data: [],
        tplName: ''
      },
      zhenduanMoban: {
        pageNum: 1,
        pageSize: this.$store.state.userAgent ? 8 : 20,
        total: 0,
        dept: '0',
        data: [],
        name: '',
        list: []
      },
      yizhuMoban: {
        pageNum: 1,
        pageSize: this.$store.state.userAgent ? 8 : 20,
        total: 0,
        dept: '0',
        data: [],
        name: '',
        list: []
      },
      chufangMoban: {
        pageNum: 1,
        pageSize: this.$store.state.userAgent ? 8 : 20,
        total: 0,
        dept: '0',
        data: [],
        name: '',
        category: '',
        isPublic: '',
        list: []
      },
      // 附加费
      FjfMoban: [],
      FjfData: [],

      // 注射单
      zhusheAsideList: [],
      ZSDAddzhusheIndex: 0,
      ZSDLists: '',
      injectList: [
        []
      ],
      memoDialogVisible: false,
      memoValue: '',
      memoIndex: 0,
      emptyText: '请输入药品名称,点击搜索按钮进行查询',
      ChiefComplaintlists: [],
      showTags: false,
      showDiagnosisTags: false,
      diagnosislists: [],
      diagnosisTags: [],
      printdynamicDate: this.$formatTime(new Date(), 'yyyy-MM-dd'),
      clinicNoT: '',
      prescriptionNoT: '',
      printIndex: 0,
      isShowLoading: true
    }
  },
  filters: {
    createAtfilters (val) {
      return formatTime(val, 'yyyy-MM-dd HH:mm')
    }
  },
  computed: {
    rightTableHeight () {
      return document.body.clientHeight - 132 - 46 - 50
    },
    deptLists () {
      return this.$store.state.deptLists
    },
    allPrice () {
      let price = 0
      for (let i = 0; i < this.FjfData.length; i++) {
        price += +this.FjfData[i].itemPrice
      }
      for (let i = 0; i < this.allList.length; i++) {
        price += +this.allList[i].price
      }
      return price.toFixed(2)
    },
    drugType () {
      return this.$store.state.drugType
    },
    // 价格列表
    allList () {
      let arr = []
      for (let i = 0; i < this.dynamicTags.length; i++) {
        if (+this.dynamicTags[i].type === -1) {
          for (let j = 0; j < this.dynamicTags[i].inspectList.length; j++) {
            let _json = {}
            _json.name = this.dynamicTags[i].inspectList[j].categoryName
            _json.num = 1
            _json.onePrice = Math.round(this.dynamicTags[i].inspectList[j].itemPrice * 100) / 100
            _json.price = Math.round(this.dynamicTags[i].inspectList[j].itemPrice * 100) / 100
            arr.push(_json)
          }
        } else {
          for (let j = 0; j < this.dynamicTags[i].itemList.length; j++) {
            let _json = {}
            _json.name = this.dynamicTags[i].itemList[j].drugName
            _json.manufacturerName = this.dynamicTags[i].itemList[j].manufacturerName
            _json.num = this.dynamicTags[i].itemList[j].num
            _json.singleDose = this.dynamicTags[i].itemList[j].singleNum ? this.dynamicTags[i].itemList[j].singleNum : this.dynamicTags[i].itemList[j].singleDose
            _json.drugId = this.dynamicTags[i].itemList[j].drugId
            _json.drugName = this.dynamicTags[i].itemList[j].goodsName ? this.dynamicTags[i].itemList[j].goodsName : this.dynamicTags[i].itemList[j].drugName
            _json.memo = this.dynamicTags[i].itemList[j].memo
            _json.spec = this.dynamicTags[i].itemList[j].spec
            _json.onePrice = ''
            _json.doseUnitName = this.dynamicTags[i].itemList[j].doseUnitName
            _json.singleDoseUnitName = this.dynamicTags[i].itemList[j].singleDoseUnitName
            _json.frequency = this.dynamicTags[i].itemList[j].frequency
            this.pinciList.map(item => {
              if (this.dynamicTags[i].itemList[j].frequency == item.dicItemCode) {
                _json.frequencyName = item.dicItemName
              }
            })
            if (this.dynamicTags[i].itemList[j].unitType == 1) {
              _json.onePrice = Math.round(this.dynamicTags[i].itemList[j].retailPrice * 100) / 100
            }
            if (this.dynamicTags[i].itemList[j].unitType == 2) {
              _json.onePrice = Math.round(this.dynamicTags[i].itemList[j].minRetailPrice * 100) / 100
            }
            _json.price = +this.dynamicTags[i].itemList[j].num * +_json.onePrice
            if (_json.price) {
              _json.onePrice = Math.round(_json.price * 100) / 100
            }
            arr.push(_json)
          }
        }
      }
      return arr
    }
  },
  watch: {
    dynamicTags: {
      handler: function (val) {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < val[i].itemList.length; j++) {
            if (val[i].itemList[j].num && regExp.signlessInt(val[i].itemList[j].num)) {
              this.$message.error('请填写整数！')
              return false
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    doprintdynamic () {
      // console.log(this.dynamicTags)
      // let ttt = 0
      // this.dynamicTags.map((tag, index) => {
      //   if (index == this.tagtype && tag.type != -1) {
      //     ttt += tag.itemList.length
      //   }
      // })
      // this.printIndex = ttt
      setTimeout(() => {
        let newWindow = window.open('_blank') // 打开新窗口
        let codestr = this.$refs.printdynamicBody.innerHTML // 获取需要生成pdf页面的div代码
        newWindow.document.write(`<style type="text/css" media="print">.noprint{display: none;}</style>` + codestr) // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close() // 关闭document的输出流, 显示选定的数据
        newWindow.print() // 打印当前窗口
        return true
      }, 100)
    },
    activetabClick () {
      console.log(this.activetab)
      console.log(this.dynamicTags)
      if (this.activetab == 'two' && this.dynamicTags.length == 0) {
        this.dynamicTags = [{
          name: '处方',
          type: '',
          chargeList: [], // 附加费集合
          itemList: [], // 药品集合
          inspectList: [], // 检查集合
          requirement: '',
          remark: ''
        }]
      }
    },
    handleClose (index) {
      // console.log(index)
      this.dynamicTags.splice(index, 1)
      this.tagtype = this.dynamicTags.length - 1
    },
    isselectd (selection, row) {
      console.log(selection)
      if (!row.numName) {
        selection.splice(-1, 1)
        this.xuanzeDruglist.splice(-1, 1)
        this.$message.warning('此药品暂无库存，无法使用！')
      }
    },
    changetype (i) {
      this.tagtype = i
    },
    handleInputConfirm () {
      this.dynamicTags.push({
        name: '处方',
        type: '',
        chargeList: [], // 附加费集合
        itemList: [], // 药品集合
        inspectList: [], // 检查集合
        requirement: '',
        remark: ''
      })
      this.tagtype = this.dynamicTags.length - 1
    },
    // ------ 处方模板 ---------
    // 处方模板列表
    getTplPrescripTplListPage (val) {
      this.chufangMoban.pageNum = val
      this.getTplPrescripTplList()
    },
    getTplPrescripTplList () {
      this.$api.getTplPrescripTplList({
        pageNum: this.chufangMoban.pageNum,
        pageSize: this.chufangMoban.pageSize,
        param: {
          tplName: this.chufangMoban.name,
          category: this.chufangMoban.category,
          isPublic: this.chufangMoban.isPublic,
          isValid: '1'
        }
      }).then(res => {
        if (res.success) {
          this.chufangMoban.data = res.result.data
          this.chufangMoban.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    useChufangMoban (data) {
      this.$api.getTplPrescripTplDetail({
        id: data.id
      }).then(res => {
        if (res.success) {
          // console.log(res.result)
          if (res.result.length === 0) {
            this.$message.error('模板没有药品或检查项，请选择其他模板！')
            return false
          }
          console.log(this.dynamicTags)
          console.log(this.tagtype)
          // 添加一个新处方
          if (this.dynamicTags[this.tagtype].itemList.length > 0 || this.dynamicTags[this.tagtype].inspectList.length > 0) {
            this.dynamicTags.push({
              name: '处方',
              type: +data.category === 2 ? -1 : res.result[0].category,
              chargeList: [], // 附加费集合
              itemList: [], // 药品集合
              inspectList: [], // 检查集合
              requirement: '',
              remark: ''
            })
          }
          this.tagtype = this.dynamicTags.length - 1
          // 添加 药品 和 检查
          if (+data.category === 1) {
            // 存放库存不足的药品，待后面显示出来
            let checknulllist = ''
            res.result.map(item => {
              if (isCheckNull(item.stockNum) && isCheckNull(item.stockMinNum) && isCheckNull(item.stockDoseNum)) {
                checknulllist += item.drugName + '，'
              }
            })
            if (checknulllist != '') {
              this.$alert(checknulllist + '药品库存不足，模版无法添加！', '提示', {
                confirmButtonText: '确定'
              })
              return false
            }
            for (let i = 0; i < res.result.length; i++) {
              // 药品添加到处方
              // if (res.result[i].category === this.dynamicTags[+this.tagtype].type) {
              //   res.result[i].frequency = res.result[i].frequency ? res.result[i].frequency : 1
              //   res.result[i].singleDose = res.result[i].singleDose ? res.result[i].singleDose : ''
              //   res.result[i].memo = res.result[i].memo ? res.result[i].memo : ''
              //   res.result[i].num = res.result[i].num ? res.result[i].num : ''
              //   res.result[i].drugName = res.result[i].drugName
              //   res.result[i].doseUnitName = res.result[i].doseUnitName
              //   res.result[i].drugId = res.result[i].drugId
              //   res.result[i].unitType = res.result[i].unitType
              //   res.result[i].manufacturerName = res.result[i].manufacturerName
              //   res.result[i].retailPrice = res.result[i].retailPrice
              //   res.result[i].minRetailPrice = res.result[i].minRetailPrice
              //   this.dynamicTags[+this.tagtype].itemList.push(JSON.parse(JSON.stringify(res.result[i])))
              // } else {
              //   this.$message.error('存在不同药品类型，请新建处方！')
              // }
              res.result[i].frequency = res.result[i].frequency ? res.result[i].frequency : 1
              res.result[i].singleDose = res.result[i].singleDose ? res.result[i].singleDose : ''
              res.result[i].memo = res.result[i].memo ? res.result[i].memo : ''
              res.result[i].num = res.result[i].num ? res.result[i].num : ''
              res.result[i].drugName = res.result[i].drugName
              res.result[i].doseUnitName = res.result[i].doseUnitName
              res.result[i].drugId = res.result[i].drugId
              res.result[i].unitType = res.result[i].unitType
              res.result[i].manufacturerName = res.result[i].manufacturerName
              res.result[i].retailPrice = res.result[i].retailPrice
              res.result[i].minRetailPrice = res.result[i].minRetailPrice
              res.result[i].singleDoseUnitName = res.result[i].singleDoseUnitName
              this.dynamicTags[+this.tagtype].itemList.push(JSON.parse(JSON.stringify(res.result[i])))
            }
          } else {
            for (let i = 0; i < res.result.length; i++) {
              // 药品添加到处方
              if (+this.dynamicTags[+this.tagtype].type === -1 || this.dynamicTags[+this.tagtype].type == '') {
                this.dynamicTags[+this.tagtype].type = -1
                res.result[i].aim = res.result[i].aim ? res.result[i].aim : ''
                res.result[i].memo = res.result[i].memo ? res.result[i].memo : ''
                res.result[i].part = res.result[i].part ? res.result[i].part : ''
                res.result[i].itemPrice = res.result[i].fee
                this.dynamicTags[+this.tagtype].inspectList.push(JSON.parse(JSON.stringify(res.result[i])))
              } else {
                this.$message.error('存在不同检查类型，请新建检查处方！')
              }
            }
            console.log('检查')
          }
          this.chufangDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // --------- 药品选择 ------------
    // 选择药品
    xuanzeDrug (list) {
      console.log(list)
      this.xuanzeDruglist = JSON.parse(JSON.stringify(list))
    },
    // 添加药品
    tianjiaDrug (i) {
      if (this.dynamicTags.length < 1) {
        this.$message.error('请新建处方再添加药品！')
        return false
      }
      if (this.dynamicTags[+this.tagtype].itemList.length <= 0 && this.dynamicTags[+this.tagtype].inspectList.length <= 0) {
        this.dynamicTags[+this.tagtype].type = this.xuanzeDruglist[0] ? this.xuanzeDruglist[0].category : ''
      } else if (this.dynamicTags[+this.tagtype].type < 0) {
        this.$message.error('该处方为检查处方，请新建或切换处方再添加药品！')
        return false
      }
      if (this.dynamicTags[+this.tagtype].itemList.length > 0) {
        this.dynamicTags[+this.tagtype].itemList.map(item => {
          this.xuanzeDruglist.map((_item, key) => {
            if (item.drugId == _item.id) {
              this.xuanzeDruglist.splice(key, 1)
            }
          })
        })
      }
      for (let i = 0; i < this.xuanzeDruglist.length; i++) {
        let item = JSON.parse(JSON.stringify(this.xuanzeDruglist[i]))
        this.xuanzeDruglist[i].drugId = item.id ? item.id : ''
        this.xuanzeDruglist[i].drugName = item.goodsName ? item.goodsName : ''
        this.xuanzeDruglist[i].doseUnitName = item.doseUnitName ? item.doseUnitName : ''
        this.xuanzeDruglist[i].singleDoseUnitName = item.singleDoseUnitName ? item.singleDoseUnitName : ''
        this.xuanzeDruglist[i].categoryName = item.categoryName ? item.categoryName : ''
        this.xuanzeDruglist[i].manufacturerName = item.manufacturerName ? item.manufacturerName : ''
        this.xuanzeDruglist[i].num = ''
        this.xuanzeDruglist[i].retailPrice = item.retailPrice ? item.retailPrice : ''
        this.xuanzeDruglist[i].minRetailPrice = item.minRetailPrice ? item.minRetailPrice : ''
        this.xuanzeDruglist[i].singleDose = ''
        this.xuanzeDruglist[i].frequency = 1
        this.xuanzeDruglist[i].memo = ''
        this.xuanzeDruglist[i].unitType = 1
        this.dynamicTags[+this.tagtype].itemList.push(JSON.parse(JSON.stringify(this.xuanzeDruglist[i])))
      }
      setTimeout(() => {
        this.$refs.yaopinTable.clearSelection()
        this.xuanzeDruglist = []
      }, 0)
      if (i) {
        this.$refs.rightAside.hide()
      }
    },
    delDrug (i) {
      console.log(this.tagtype, i)
      this.dynamicTags[+this.tagtype].itemList.splice(i, 1)
    },
    delJiancha (i) {
      console.log(this.tagtype, i)
      this.dynamicTags[+this.tagtype].inspectList.splice(i, 1)
    },
    // 获取药品list
    druglistsearch () {
      this.isShowLoading = false
      this.listPageNum = 1
      this.druglist()
    },
    druglistPage (val) {
      this.isShowLoading = false
      this.listPageNum = val
      this.druglist()
    },
    druglist () {
      this.$api.druglist({
        pageNum: this.listPageNum,
        pageSize: this.listPageSize,
        param: {
          category: this.listTypeSelect < 0 ? null : this.listTypeSelect,
          name: this.listSearchval === '' ? null : this.listSearchval,
          isValid: '1'
        }
      }).then(res => {
        if (res.success) {
          console.log(res.result)
          this.listTableData = res.result.data
          this.listTotal = res.result.total
          this.emptyText = res.result.total == 0 ? '抱歉,暂时查询不到您的搜索内容' : '请输入药品名称,点击搜索按钮进行查询'
          this.isShowLoading = true
        } else {
          this.isShowLoading = true
          this.$message.error(res.msg)
        }
      })
    },
    // 获取药品使用频次
    getPinciList () {
      this.$api.dicItemdicTypeCode('DrugFrequency').then(res => {
        if (res.success) {
          console.log(res)
          this.pinciList = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取 检查列表
    getInspectCategory () {
      this.$api.getFeeList({feeCategory: 'InspectCategory'}).then(res => {
        if (res.success) {
          console.log(res)
          this.inspectCategoryList = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    xuanzeJiancha (list) {
      this.jianchaList = JSON.parse(JSON.stringify(list))
    },
    tianjiaJiancha (i) {
      if (this.dynamicTags.length < 1) {
        this.$message.error('请新建处方再添加检查！')
        return false
      }
      if (this.dynamicTags[+this.tagtype].itemList.length <= 0 && this.dynamicTags[+this.tagtype].inspectList.length <= 0) {
        this.dynamicTags[+this.tagtype].type = -1
      } else if (this.dynamicTags[+this.tagtype].type >= 0) {
        this.$message.error('该处方为药品处方，请新建或切换处方再添加检查！')
        return false
      }
      console.log(this.dynamicTags)
      if (this.dynamicTags[+this.tagtype].inspectList.length > 0) {
        this.dynamicTags[+this.tagtype].inspectList.map(item => {
          this.jianchaList.map((_item, key) => {
            if (item.category == _item.category) {
              this.jianchaList.splice(key, 1)
            }
          })
        })
      }
      for (let i = 0; i < this.jianchaList.length; i++) {
        console.log(this.jianchaList[i])
        // 检查 添加到处方
        if (this.dynamicTags[+this.tagtype].type == -1) {
          this.jianchaList[i].aim = ''
          // this.jianchaList[i].category = ''
          this.jianchaList[i].memo = ''
          this.jianchaList[i].part = ''
          this.dynamicTags[+this.tagtype].inspectList.push(JSON.parse(JSON.stringify(this.jianchaList[i])))
        } else {
          this.$message.error('存在不同类型，请新建处方！')
        }
      }
      // let _this = this
      // function unq (arr1) {
      //   if (arr1.length === 2 && arr1[0].id === arr1[1].id) {
      //     arr1.splice(1, 1)
      //   } else {
      //     for (let i = 0; i < arr1.length; i++) {
      //       for (let j = i + 1; j < arr1.length; j++) {
      //         if (arr1[i].id === arr1[j].id) {
      //           arr1.splice(j, 1)
      //           // _this.$message.info('已自动过滤重复项！')
      //         }
      //       }
      //     }
      //   }
      //   return arr1
      // }
      // unq(this.dynamicTags[+this.tagtype].inspectList)
      setTimeout(() => {
        this.$refs.jianchaTable.clearSelection()
        this.jianchaList = []
      }, 0)
      if (i) {
        this.$refs.rightAside.hide()
      }
    },
    // --------- 诊断模块 -----------
    // 从模板添加
    addNewForModel () {
      this.chufangDialogVisible = true
      this.getTplPrescripTplList()
      // console.log('newmodel')
    },
    showAside () {
      this.listTableData = []
      this.listTotal = 0
      this.listSearchval = ''
      this.listPageNum = 1
      this.emptyText = '请输入药品名称,点击搜索按钮进行查询'
      this.$refs.rightAside.show()
    },
    blModel () {
      console.log('选择病历模板')
      this.blDialogVisible = true
      this.medicalRecordTpllist()
    },
    medicalRecordTpllistsearch () {
      this.bingliMoban.pageNum = 1
      this.medicalRecordTpllist()
    },
    medicalRecordTpllistPage (val) {
      this.bingliMoban.pageNum = val
      this.medicalRecordTpllist()
    },
    medicalRecordTpllist () {
      this.$api.medicalRecordTpllist({
        pageNum: this.bingliMoban.pageNum,
        pageSize: this.bingliMoban.pageSize,
        param: {
          category: '',
          dept: this.bingliMoban.dept, // 科室id 不传表示自己 0 表示全部 其他指定
          // isSelf: 0, // 是否是自己的 0 不是自己 1是自己 不传表示全部
          isValid: 1, // 是否有效(启用1 关闭0) 0:无；1：有 不传不做筛选
          tplName: this.bingliMoban.tplName // 模板名 或者拼音 王五/WW
        }
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.bingliMoban.total = res.result.total
          this.bingliMoban.data = res.result.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    useBlmoban (data) {
      console.log(data)
      // this.record.advice += data.advice
      this.record.chiefComplaint = data.chiefComplaint
      if (data.diagnosis) {
        this.diagnosisTags[0] = data.diagnosis
      }
      // this.record.diagnosis += data.diagnosis
      // this.record.remark = data.remark

      this.blDialogVisible = false
    },
    // 诊断
    zdModel () {
      this.zdDialogVisible = true
      this.getTplDiagnosisList()
    },
    getTplDiagnosisListsearch () {
      this.zhenduanMoban.pageNum = 1
      this.getTplDiagnosisList()
    },
    getTplDiagnosisListPage (val) {
      this.zhenduanMoban.pageNum = val
      this.getTplDiagnosisList()
    },
    getTplDiagnosisList () {
      this.$api.getTplDiagnosisList({
        pageNum: this.zhenduanMoban.pageNum,
        pageSize: this.zhenduanMoban.pageSize,
        param: {
          // isPublic: 0, // 0私有 1公有
          isValid: 1, // 是否有效(启用1 关闭0) 0:无；1：有 不传不做筛选
          name: this.zhenduanMoban.name // 模板名 或者拼音 王五/WW
        }
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.zhenduanMoban.total = res.result.total
          this.zhenduanMoban.data = res.result.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    zdSelct (list) {
      this.zhenduanMoban.list = list
    },
    daoruZd () {
      console.log(this.zhenduanMoban.list)
      for (let i = 0; i < this.zhenduanMoban.list.length; i++) {
        this.record.diagnosis += this.zhenduanMoban.list[i].diagnosis
        // console.log(this.zhenduanMoban.list[i].diagnosis)
      }
      this.zdDialogVisible = false
    },
    // 医嘱
    yzModel () {
      this.yzDialogVisible = true
      this.getTplAdviceList()
    },
    getTplAdviceListPage (val) {
      this.yizhuMoban.pageNum = val
      this.getTplAdviceList()
    },
    getTplAdviceList () {
      this.$api.getTplAdviceList({
        pageNum: this.yizhuMoban.pageNum,
        pageSize: this.yizhuMoban.pageSize,
        param: {
          // isPublic: 0, // 0私有 1公有
          isValid: 1, // 是否有效(启用1 关闭0) 0:无；1：有 不传不做筛选
          name: this.yizhuMoban.name // 模板名 或者拼音 王五/WW
        }
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.yizhuMoban.total = res.result.total
          this.yizhuMoban.data = res.result.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    yzSelct (list) {
      this.yizhuMoban.list = list
    },
    daoruYz () {
      for (let i = 0; i < this.yizhuMoban.list.length; i++) {
        this.record.advice += this.yizhuMoban.list[i].advice
        // console.log(this.zhenduanMoban.list[i].diagnosis)
      }
      this.yzDialogVisible = false
    },
    // --------- 诊断模块结束 -----------

    // --------- 添加附加费 ------------
    showFjf () {
      this.fjfDialogVisible = true
      this.ChargeCategory()
    },
    ChargeCategory () {
      this.$api.getFeeList({feeCategory: 'ChargeCategory'}).then(res => {
        if (res.success) {
          console.log(res)
          this.FjfMoban = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    usefjfmoban (data) {
      this.FjfData.push(JSON.parse(JSON.stringify(data)))
      this.fjfDialogVisible = false
    },
    delFjf (i) {
      // console.log(i)
      this.FjfData.splice(i, 1)
    },
    // --------- 附加费end -------------
    // 保存处方
    postPre (isfinish) {
      // 诊断
      this.record.diagnosis = ''
      let dynamicTagsLock = true
      if (this.patientinfo) {
        this.patientinfo.realName = this.patientinfo.patientName

        if (!this.patientinfo.patientName || this.patientinfo.patientName == ' ') {
          this.$message.error('姓名格式不正确！')
          return false
        }
        if (!regExp.trim(this.patientinfo.mobile) || regExp.mobile(this.patientinfo.mobile)) {
          this.$message.error('手机号格式不正确！')
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
        if (this.patientinfo.dateOfBirth) {
          this.patientinfo.dateOfBirth = formatTime(this.patientinfo.dateOfBirth, 'yyyy-MM-dd')
        }
        if (this.patientinfo.idCard && regExp.idCard(this.patientinfo.idCard)) {
          this.$message.error('请填写有效的身份证号')
          return false
        }
      }

      if (!this.record.date) {
        this.$message.error('请选择发病日期！')
        this.activetab = 'one'
        return false
      }
      if (regExp.trim(this.record.chiefComplaint) == '') {
        this.$message.error('主诉不能为空')
        this.activetab = 'one'
        return false
      }
      if (regExp.trim(this.diagnosisText) == '' && this.diagnosisTags.length == 0) {
        this.$message.error('诊断详情不能为空')
        this.activetab = 'one'
        return false
      }
      this.record.onSetDate = this.$formatTime(this.record.date, 'yyyy-MM-dd')

      // 药品处方
      // for (let i = 0; i < this.dynamicTags.length; i++) {
      //   if (this.dynamicTags[i].itemList.length > 0) {
      //     for (let j = 0; j < this.dynamicTags[i].itemList.length; j++) {
      //       if (!this.dynamicTags[i].itemList[j].num || this.dynamicTags[i].itemList[j].num <= 0) {
      //         this.$message.error('药品数量不能为空！')
      //         this.tagtype = i
      //         this.activetab = 'two'
      //         return false
      //       }
      //     }
      //   } else {
      //     this.dynamicTags.splice(i, 1)
      //   }
      // }
      if (this.diagnosisTags.length == 1) {
        this.record.diagnosis = this.diagnosisTags.toString()
      } else if (this.diagnosisTags.length > 1) {
        this.diagnosisTags.map((item, i) => {
          if (i === 0) {
            this.record.diagnosis = item
          } else {
            this.record.diagnosis += '&&|&&' + item
          }
        })
      }
      if (regExp.trim(this.diagnosisText) != '') {
        this.record.diagnosis += this.record.diagnosis == '' ? this.diagnosisText : '&&|&&' + this.diagnosisText
      }
      this.dynamicTags.map((item, key) => {
        if (item.itemList.length > 0) {
          item.itemList.map(_item => {
            if (!_item.num || _item.num <= 0 || _item.num == '') {
              this.$message.error('药品数量不能为空！')
              this.tagtype = key
              this.activetab = 'two'
              dynamicTagsLock = false
            }
          })
        } else {
          if (item.inspectList.length <= 0) {
            this.dynamicTags.splice(key, 1)
          }
        }
      })
      if (!dynamicTagsLock) {
        return
      }
      let _preList = JSON.parse(JSON.stringify(this.dynamicTags))
      if (this.FjfData.length != 0) {
        _preList.push({
          chargeList: this.FjfData,
          inspectList: [],
          itemList: [],
          remark: '',
          requirement: ''
        })
      }
      // _preList.push({
      //   chargeList: this.FjfData,
      //   inspectList: [],
      //   itemList: [],
      //   remark: '',
      //   requirement: ''
      // })
      this.$api.postPre({
        applyId: this.applyId ? this.applyId : this.applyIdT, // 挂号主键
        id: this.cfId ? this.cfId : null, // 处方主键
        isfinish: isfinish,
        clinicNo: this.clinicNo ? this.clinicNo : this.clinicNoT,
        prescriptionNo: this.prescriptionNo ? this.prescriptionNo : this.prescriptionNoT,
        patient: this.patientinfo,
        // 处方
        preList: _preList,
        // 病历
        record: this.record,
        // 注射单
        injectList: this.injectList
      }).then(res => {
        if (res.success) {
          if (isfinish) {
            this.$message.success('就诊完成！')
            this.$router.push({path: '/doctorvisits/admissions', query: {activeName: this.activeName}})
          } else {
            this.applyIdT = res.result.applyId
            this.cfId = res.result.id
            this.$message.success('保存成功!')
          }
          // console.log(res)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取处方回显
    getPre () {
      this.dynamicTags = []
      this.$api.getPre({
        applyId: this.applyId
      }).then(res => {
        if (res.success) {
          console.log(res.result)
          this.cfId = res.result.id
          this.clinicNoT = res.result.clinicNo
          this.prescriptionNoT = res.result.prescriptionNo
          // 病历
          res.result.record.date = new Date(res.result.record.onSetDate.replace(/-/g, '/'))
          this.record = res.result.record
          if (this.record.diagnosis && !this.record.diagnosis.includes('&&|&&')) {
            this.diagnosisTags[0] = this.record.diagnosis
          }
          if (this.record.diagnosis && this.record.diagnosis.includes('&&|&&')) {
            this.diagnosisTags = this.record.diagnosis.split('&&|&&')
          }
          // 处方
          for (let i = 0; i < res.result.preList.length; i++) {
            let _dataArr = res.result.preList[i]
            for (let j = 0; j < _dataArr.chargeList.length; j++) {
              _dataArr.chargeList[j].itemPrice = _dataArr.chargeList[j].fee
              this.FjfData.push(JSON.parse(JSON.stringify(_dataArr.chargeList[j])))
            }
            for (let j = 0; j < _dataArr.inspectList.length; j++) {
              _dataArr.inspectList[j].itemPrice = _dataArr.inspectList[j].fee
            }
            if (_dataArr.inspectList.length > 0) {
              this.dynamicTags.push({
                name: '处方',
                type: -1,
                chargeList: [], // 附加费集合
                itemList: [], // 药品集合
                inspectList: JSON.parse(JSON.stringify(_dataArr.inspectList)), // 检查集合
                requirement: _dataArr.requirement,
                remark: _dataArr.remark
              })
              // this.dynamicTags.inspectList.push(JSON.parse(JSON.stringify(_dataArr.inspectList[j])))
            }
            if (_dataArr.itemList.length > 0) {
              this.dynamicTags.push({
                name: '处方',
                type: '',
                chargeList: [], // 附加费集合
                itemList: JSON.parse(JSON.stringify(_dataArr.itemList)), // 药品集合
                inspectList: [], // 检查集合
                requirement: _dataArr.requirement,
                remark: _dataArr.remark
              })
              // this.dynamicTags.inspectList.push(JSON.parse(JSON.stringify(_dataArr.inspectList[j])))
            }
          }
          if (res.result.preList.length == 0) {
            this.dynamicTags.push({
              name: '处方',
              type: '',
              chargeList: [], // 附加费集合
              itemList: [], // 药品集合
              inspectList: [], // 检查集合
              requirement: '',
              remark: ''
            })
            this.tagtype = this.dynamicTags.length - 1
          }
          // 注射单
          this.injectList = [[]]
          if (res.result.injectList) {
            this.injectList = res.result.injectList
          }
          // record: {
          //   // 医嘱
          //   advice: '',
          //   // 主诉
          //   chiefComplaint: '',
          //   // 诊断信息
          //   diagnosis: '',
          //   // 是否传染病 0：否；1：是
          //   isContagious: '',
          //   // isFirst (string, optional): 1 初诊、0 复诊
          //   isFirst: '',
          //   // 发病日期
          //   date: '',
          //   onSetDate: '',
          //   // 备注
          //   remark: ''
          // },
          console.log(this.dynamicTags)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // --------- 添加注射单 -------------
    showzhusheAside (index) {
      this.zhusheAsideList = []
      let arr = []
      this.allList.map(item => {
        if (item.drugId) {
          arr.push(item)
        }
      })
      this.zhusheAsideList = arr
      this.ZSDAddzhusheIndex = index
      this.$refs.zhusherightAside.show()
    },
    ZSDchange (list) {
      this.ZSDLists = JSON.parse(JSON.stringify(list))
      console.log(this.ZSDLists)
    },
    addzhushe (i) {
      this.ZSDLists.map((item, key) => {
        let list = JSON.parse(JSON.stringify(this.ZSDLists))
        this.injectList[this.ZSDAddzhusheIndex].push(list[key])
      })
      setTimeout(() => {
        this.$refs.ZSDTable.clearSelection()
        this.ZSDLists = []
      }, 0)
      if (i) {
        this.$refs.zhusherightAside.hide()
      }
    },
    delZSDtable (i) {
      this.injectList[this.ZSDAddzhusheIndex].splice(i, 1)
    },
    addZSDGroup () {
      this.injectList.push([])
    },
    closeZSDGroup (index) {
      this.injectList.splice(index, 1)
    },
    doprint () {
      console.log(this.patientinfo)
      let newWindow = window.open('_blank') // 打开新窗口
      let codestr = this.$refs.printBody.innerHTML // 获取需要生成pdf页面的div代码
      newWindow.document.write(`<style type="text/css" media="print">.noprint{display: none;}</style>` + codestr) // 向文档写入HTML表达式或者JavaScript代码
      newWindow.document.close() // 关闭document的输出流, 显示选定的数据
      newWindow.print() // 打印当前窗口
      return true
    },
    memoModel (row, index) {
      console.log(row)
      if (row.payStatus !== 1) {
        this.memoValue = ''
        this.memoDialogVisible = true
        this.memoValue = row.memo
        this.memoIndex = index
      }
    },
    conmemovalue () {
      this.dynamicTags[+this.tagtype].itemList[this.memoIndex].memo = this.memoValue
      this.memoDialogVisible = false
    },
    tagchieffocus () {
      this.showTags = true
    },
    tagsChiefClose () {
      this.showTags = false
    },
    selectTag (index) {
      if (this.record.chiefComplaint.length == 0) {
        this.record.chiefComplaint = this.record.chiefComplaint + this.ChiefComplaintlist[index].chiefComplaint
      } else {
        this.record.chiefComplaint = this.record.chiefComplaint + '，' + this.ChiefComplaintlist[index].chiefComplaint
      }
    },
    diagnosisFocus () {
      this.showDiagnosisTags = true
    },
    selectDiagnosisTag (index) {
      if (this.diagnosislist[index].diagnosis.includes('&&|&&')) {
        let list = this.diagnosislist[index].diagnosis.split('&&|&&')
        list.map(item => {
          this.diagnosisTags.push(item)
        })
      } else {
        this.diagnosisTags.push(this.diagnosislist[index].diagnosis)
      }
    },
    handleDiagnosisClose (index) {
      this.diagnosisTags.splice(index, 1)
    },
    tagsDiagnosisClose () {
      this.showDiagnosisTags = false
    },
    blempty () {
      this.record.chiefComplaint = ''
      this.diagnosisTags = []
      this.diagnosisText = ''
    },
    pregetNo () {
      this.$api.pregetNo({
        type: 2
      }).then(res => {
        if (res.success) {
          this.prescriptionNoT = res.result.prescriptionNo
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    this.$store.commit('getDeptLists')
    this.$store.commit('getDrugType')
    this.getPinciList()
    this.getInspectCategory()
    if (+this.status === 3) {
      this.getPre()
    }
    if (+this.status === 0) {
      this.pregetNo()
    }
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
.danwei
  padding 12px 5px
.pagination
  margin-top 20px
  text-align center
.table
  margin-top 20px
.my-row-2
  display flex
  flex-flow row nowrap
  align-items center
  justify-content flex-start
  padding 20px
  .my-col-input
    flex 3
    margin-right 0
  .my-col-select
    flex 2
    margin-right 15px
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
.datepk
  width 100% !important
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
    padding 15px
    min-height 630px
  .right
    background $White
    padding 15px
    min-height 630px
.el-form-item
  margin-bottom 10px
.select 
  width 70px
.rowcol
  display flex
  flex-flow row no-warp
  justify-content flex-start
  margin-bottom 10px

.fayaobody
  position relative
  .zhuangtai
    margin-top 20px
    display flex
    align-items center
    i.icon
      display inline-block
      width 50px
      height 20px
      background-size 50px 20px
      &.active
        background-size 50px 20px
.mbt
  display flex 
  flex-direction row
  justify-content center
  margin-top 10px
  margin-bottom 20px
.memobtn
  width 100%
  margin-top 20px
.menospan
  width 100%
  height 28px
  border 1px solid $elSilver
  background $White
  border-radius 4px
  cursor pointer
  text-align left
  padding 0 10px
  &.disabled
    background-color #f5f7fa
    border-color #e4e7ed
    color #c0c4cc
    cursor not-allowed
.tags
  margin-top 3px
  border 1px solid #c0c4cc
  border-radius 5px
  padding 0 10px
  position relative
  .tags-close
    position absolute
    right 5px
    top 5px
    font-size 20px
    cursor pointer
.fade-enter-active, .fade-leave-active
  transition opacity .5s
.fade-enter, .fade-leave-to
  opacity 0
.diagnosis-input
  box-sizing border-box
  width 99.8%
  min-height 75px
  border 1px solid #dcdfe6
  border-radius 4px
  padding 5px 10px
  cursor pointer
  & >>> .el-input__inner
    border 0 !important
.col
  margin-top 20px
  text-align left
.eltags
  width 100%
  background rgba(11, 189, 227, 0.1)
  padding 5px 10px
  line-height 20px
  color #0bbde3
  box-sizing border-box
  border 1px solid rgba(11, 189, 227, 0.2)
  border-radius 4px
  margin-bottom 5px
  position relative
  .eltags-close
    position absolute
    right 3px
.tags-nodata
  text-align center
  color #999999
.isShowloadingDialog
  height calc(100vh - 100px)
  width 100%
  display flex 
  align-items center
  justify-content center
.icon-his-loading
  color #0bbde3
  font-size 30px
</style>

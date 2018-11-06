<template lang="pug">
  .pagecontent
    .content
      el-row
        el-col.marginR15(:span="4")
          el-input(placeholder="患者姓名或者编号", size='small', v-model="searchval", @keyup.enter.native='getListsearch')
            el-button(slot="append", icon="el-icon-search", @click='getListsearch')
        el-col.marginR15(:span="3")
          el-select(placeholder="请选择", v-model="status" size='small', @change='getList')
            el-option(value='0', label='全部')
            el-option(value='1', label='未收费')
            el-option(value='2', label='未发药')
            el-option(value='3', label='已退款')
            el-option(value='4', label='已完成')
        el-col.marginR15(:span="6")
          el-date-picker(v-model="date", size='small',
            type="daterange",
            align="right",
            unlink-panels,
            :editable= 'false',
            range-separator="至",
            start-placeholder="开始日期",
            end-placeholder="结束日期",
            @change='getchangeList')
        el-col.my-col(:span="9") 
          | 实收金额：
          span ¥ {{nowfee}}
      el-row.table
        el-table(
            :data="tableData",
            stripe,
            border,
            size='medium',
            style="width: 100%"
          )
          el-table-column(prop="clinicNo", label="门诊编号", align='center')
          el-table-column(prop="patientName", label="患者姓名", align='center')
          el-table-column(label="性别", align='center', width='60')
            template(slot-scope="scope")
              span(v-if="scope.row.gender == '0'") 男
              span(v-if="scope.row.gender == '1'") 女
          el-table-column(prop="age", label="年龄", align='center', width='80')
          el-table-column(prop="mobile", label="手机", align='center', width='120')
          el-table-column(prop="doctorName", label="医生姓名", align='center', width='80')
          el-table-column(prop="fee", label="费用", align='center', width='100')
          el-table-column(label="就诊日期", align='center')
            template(slot-scope="scope")
              span {{scope.row.diagnoseDate | datefilters}}
          el-table-column(label="状态", align='center', width='80')
            template(slot-scope="scope")
              span(v-if="scope.row.status == 1") 未收费
              span(v-if="scope.row.status == 2 && scope.row.contanisMedicine == 1") 未发药
              span(v-if="scope.row.status == 2 && scope.row.contanisMedicine != 1") 已收费
              span(v-if="scope.row.status == 3") 部分退款
              span(v-if="scope.row.status == 4") 已退款
              span(v-if="scope.row.status == 5") 已完成
          el-table-column(label="操作", width='130', align='center')
            template(slot-scope="scope")
              el-button(type="success", v-if="scope.row.status == 1", @click="shoufeiClick(scope.row)", size='mini') 收费
              el-button(type="primary",  @click="handleClick(scope.row)", v-if="(scope.row.status == 2 || scope.row.status == 3) && scope.row.contanisMedicine == 1", size='mini') 发药
              el-button(type="danger", v-if="scope.row.status == 2 || scope.row.status == 3", size='mini', @click='tuikuan(scope.row)') 退款
              el-button(type="primary", size='mini', v-if="scope.row.status == 4 || scope.row.status == 5", @click="checkDetail(scope.row)") 详情
      .pagination
        el-pagination(
          background,
          :page-size="pageSize",
          layout="total, prev, pager, next, jumper",
          :current-page.sync="pageNum",
          :total="total",
          @current-change='getListPage')

    el-dialog(
      :visible.sync="fayaoDialogVisible",
      width="900px",
      :before-close='closefayaoDialog',
      center)
      .dialogtitle(slot='title') 发药
      el-button(size='small', style='position: absolute;right: 28px;top: 70px;z-index:9', @click='doprint') 打印

      .fayaobody(ref='printBody', style='display:none')
        div(style="width:700px;margin: 0 auto;box-sizing: border-box;display:flex;flex-direction:column;")
          div
            button.noprint(onclick='window.print()') 打印
            button.noprint(onclick='window.close()', style='margin-left:10px;') 关闭页面
          h1(style='font-size:33px;text-align:center;margin-bottom: 50px;letter-spacing: 2px;') {{$store.state.userInfo.orgName}}处方笺
          div(style='float:left;width:100%;margin-bottom: 10px;padding:30px 25px 0 25px;border-top:2px solid #000;box-sizing: border-box;')
            p(style='width: 38%;display: inline-block;margin:0;') 处方编号：
              span(style="color: red;") {{prescriptionNo}}
            p(style='width: 62%;display: inline-block;margin:0;') 开方日期：{{printdata.diagnoseDate | createAtfilters}}
            // p(style='width: 28%;display: inline-block;margin:0;') 费用类别：自费

          div(style='float:left;width:100%;margin-bottom: 10px;padding:0 25px;box-sizing: border-box;')
            p(style='width: 38%;display: inline-block;margin:0;') 姓名：{{printdata.patientName}}
            p(style='width: 33%;display: inline-block;margin:0;') 性别：
              span(v-if="printdata.gender == 0") 男
              span(v-if="printdata.gender == 1") 女
            p(style='width: 28%;display: inline-block;margin:0;') 年龄：{{printdata.age}}岁

          div(style='float:left;width:100%;margin-bottom: 10px;padding:0 25px;box-sizing: border-box;')
            p(style='width: 38%;display: inline-block;margin:0;') 所属科室：{{$store.state.userInfo.deptName}}
            p(style='width: 33%;display: inline-block;margin:0;') 联系方式：{{printdata.mobile}}
            p(style='width: 28%;display: inline-block;margin:0;')

          div(style='float:left;width:100%;padding:0 25px 30px 25px;border-bottom:2px solid #000;box-sizing: border-box;')
            p(style='display: inline-block;margin:0;') 诊断详情：
              span(v-for="item, i in diagnosisTags", :key="i", v-if="i==0") {{item}}
              span(v-else) , {{item}}

          div(v-for="tag, index in dynamicTags", :key="index", v-if="tag.name + (+index+1) == fayaoactivetab")
            div(style="font-size:33px;font-style:'FZDBSJW--GB1-0';padding: 20px 25px") Rp.
            div(style="display:flex;flex-direction:row;box-sizing: border-box;margin:0 25px 20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
              span(style="flex:1;") 序号
              span(style="flex:2;") 药品名称
              span(style="flex:2;") 规格
              span(style="flex:1;") 总量
            div(v-for="item, i in tag.table", :key="i", style="box-sizing: border-box;margin:0 25px 20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
              div(style="display:flex;flex-direction:row;padding-bottom:10px;")
                span(style="flex:1;") {{i+1}}
                span(style="flex:2;") {{item.drugName}}
                span(style="flex:2;") {{item.spec}}
                span(style="flex:1;") {{item.numName}}
              div(style="display:flex;flex-direction:row;padding-bottom:10px;")
                span(style="flex:1;")
                span(style="flex:5;") 用法:
                  span(style="color:#666666") {{item.useageName}}
                  span(style='padding-left: 10px;color:#666666') {{item.singleDose ? '每次' + item.singleDose : ''}}{{item.singleDose ? item.singleDoseUnitName : ''}}
                  span(style='padding-left: 10px;color:#666666') {{item.frequencyName}}
              div(style="display:flex;flex-direction:row;")
                span(style="flex:1;")
                span(style="flex:5;") 备注: 
                  span(style="color:#666666") {{item.memo}}
            div(style="text-align:center;margin-bottom:100px;") 以下空白
          div(style='font-size:16px;margin-bottom:10px;padding-top:10px;border-top:2px solid #000;') 医生签名：
          div(style='font-size:16px;display:flex;flex-direction:row;margin-bottom:10px;')
            span(style="flex:1;") 审核药师：
            span(style="flex:1;") 调配药师/士：
            span(style="flex:1;") 核对、发药药师：
          div(v-if="fayaoactivetab != '注射单'")
            div(style='font-weight:bold;font-size:16px;margin-bottom:10px;') 提示：
              span(style='font-weight:normal;font-size:16px;') 1、请遵循医嘱服药、2、请点清药品、3、发出药品不予退还
            div(style='font-weight:bold;font-size:16px;') 注：
              span(style='font-weight:normal;font-size:16px;') 处方开具后24小时内有效
      .fayaobody
        el-tabs(v-model="fayaoactivetab", type="card")
          el-tab-pane(:label="tag.name + (+index+1)", v-for="tag, index in dynamicTags", :key="index", :name="tag.name + (+index+1)")
            el-table(
              :data="tag.table",
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              el-table-column(prop='batchNumber', label="入库批号")
              //- el-table-column(prop='drugCode', label="药品编码")
              el-table-column(prop='drugName', label="药品名称")
              el-table-column(prop='manufacturerName', label="生产厂商")
              el-table-column(prop="spec", label="药品规格")
              el-table-column(label="有效期")
                template(slot-scope="scope")
                  span {{scope.row.expiryDate | datefilters}}
              el-table-column(prop='numName', label="数量")
              el-table-column(label="价格", width='80', align='center')
                template(slot-scope="scope")
                  span {{scope.row.price ? Math.round(scope.row.price*100)/100 : ''}}
        .zhuangtai 总金额：￥{{totalMoney ? totalMoney : ''}}
        .zhuangtai 收费状态：
          i.icon.active
        //- .bigbtn(v-if="this.printdata.status != 5", @click='fayaoOk') 发药完成
    el-dialog(
      :visible.sync="centerDialogVisible",
      width="650px",
      center)
      .dialogtitle(slot='title') 收费
      .shoufeidialogbody
        .topinfo
          .line
            .l 收费信息
            .r 门诊编号：{{clinicNo}}
          .line(v-for="item, index in shoufeiList", :key='index')
            .l 处方{{item.groupNum}}
            .r {{item.price}}元
        .payinfo
          .left
            el-form
              el-form-item(label="支付方式：")
                el-select(size='small', placeholder='选择', v-model="paytype")
                  el-option(v-for="item, index in $store.state.PaymentMethodType", :label='item.dicItemName', :value="item.dicItemCode", :key="index")
              el-form-item(label="总收费金额：") 
                span ¥ {{allpay}}
              el-form-item(label="已支付金额：") 
                span ¥ {{payed}}
              el-form-item(label="未支付金额：") 
                span(style='color: red') ¥ {{paynum}}
                // el-input(size='small', style='width:193px;', placeholder='支付金额', v-model="paynum", disabled)
          .right
            // .ewm
              img(src='')
            .paytype
              img(v-if="paytype==1", src='./../../../assets/img/pay_weixin.png')
              img(v-if="paytype==2", src='./../../../assets/img/pay_alipay.png')
              img(v-if="paytype==0", src='./../../../assets/img/pay_xianjin.png')
              img(v-if="paytype==3", src='./../../../assets/img/pay_card.png')
        .bigbtn(@click='shoufeiOk') 收费完成

    el-dialog(
      :visible.sync="tuikuanDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 退款
      .shoufeidialogbody
        // .topinfo
          .line
            .l 退款信息
            .r 门诊编号：{{clinicNo}}
          .line(v-for="item, index in shoufeiList", :key='index')
            .l 处方{{item.groupNum}}
            .r {{item.receivables}}元

        el-tabs(v-model="fayaoactivetab", type="card")
          el-tab-pane(:label="tag.name + (+index+1)", v-for="tag, index in preList", :key="index", :name="tag.name + (index+1)")
            el-table(
              :data="tag.table",
              v-if="tag.name == '检查处方'"
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              //- el-table-column(label="选择", width='80', align='center')
                template(slot-scope="scope")
                  el-checkbox(v-model="scope.row.ck", :disabled='scope.row.payStatus == 0 || scope.row.payStatus == 2')
              el-table-column(prop='categoryName', label="检查名称")
              el-table-column(prop='memo', label="备注")
              el-table-column(prop='fee', label="费用")
              el-table-column(label="支付状态")
                template(slot-scope="scope")
                  span(v-if="scope.row.payStatus == 0") 未支付
                  span(v-if="scope.row.payStatus == 1") 已支付
                  span(v-if="scope.row.payStatus == 2") 已退款
              // el-table-column(prop='diagnosis', label="检查诊断")
              // el-table-column(prop='aim', label="检查目的")
              // el-table-column(prop='part', label="检查部位")
              // el-table-column(prop='summary', label="病情摘要")
              // el-table-column(prop='type', label="类型")

            el-table(
              :data="tag.table",
              v-if="tag.name == '药品处方'"
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              //- el-table-column(label="选择", width='80', align='center')
                template(slot-scope="scope")
                  el-checkbox(v-model="scope.row.ck", :disabled='scope.row.payStatus == 0 || scope.row.payStatus == 2')
              el-table-column(prop='drugName', label="用药名称")
              el-table-column(prop='retailPrice', label="单价")
              el-table-column(prop='numName', label="数量")
              el-table-column(prop='fee', label="总价")
              el-table-column(label="支付状态")
                template(slot-scope="scope")
                  span(v-if="scope.row.payStatus == 0") 未支付
                  span(v-if="scope.row.payStatus == 1") 已支付
                  span(v-if="scope.row.payStatus == 2") 已退款
              // el-table-column(prop='spec', label="药品规格")
              // el-table-column(prop='unit', label="计价单位")
              // el-table-column(prop='type', label="类型")

            el-table(
              :data="tag.table",
              v-if="tag.name == '附加费'"
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              //- el-table-column(label="选择", width='80', align='center')
                template(slot-scope="scope")
                  el-checkbox(v-model="scope.row.ck", :disabled='scope.row.payStatus == 0 || scope.row.payStatus == 2')
              el-table-column(prop='categoryName', label="费用类型")
              el-table-column(prop='fee', label="单价")
              el-table-column(label="支付状态")
                template(slot-scope="scope")
                  span(v-if="scope.row.payStatus == 0") 未支付
                  span(v-if="scope.row.payStatus == 1") 已支付
                  span(v-if="scope.row.payStatus == 2") 已退款
              // el-table-column(prop='type', label="类型")

        .payinfo
          .left(style='padding:30px 0 0 0')
            el-form
              el-form-item(label="退款方式：")
                el-select(size='small', placeholder='选择性别', v-model="tuikuantype")
                  el-option(label='微信', value="1")
                  el-option(label='支付宝', value="2")
                  el-option(label='现金', value="0")
              el-form-item(label="退款金额：") 
                span(style='color: red') ¥ {{tuikuanFee}}
        el-form(style='margin-top:-10px')
          el-form-item(label="退款说明：")
            el-input(type="textarea", placeholder='退款说明（可不填写）', v-model="tuikuanstate")
        el-button.bigbtn(type="primary", @click='tuikuanOk') 退款

    el-dialog(
      :visible.sync="detailDialogVisible",
      width="800px",
      center)
      .dialogtitle(slot='title') 详情
      el-button(size='small', style='position: absolute;right: 28px;top: 70px;z-index:9', @click='doprint', v-if="printdata.status != 4") 打印
      
      .fayaobody(ref='printBody', style='display:none')
        div(style="width:700px;margin: 0 auto;box-sizing: border-box;display:flex;flex-direction:column;")
          div
            button.noprint(onclick='window.print()') 打印
            button.noprint(onclick='window.close()', style='margin-left:10px;') 关闭页面
          h1(v-if="fayaoactivetab != '注射单'", style='font-size:33px;text-align:center;margin-bottom: 50px;letter-spacing: 2px;') {{$store.state.userInfo.orgName}}处方笺
          h1(v-if="fayaoactivetab == '注射单'", style='font-size:33px;text-align:center;margin-bottom: 50px;letter-spacing: 2px;') {{$store.state.userInfo.orgName}}注射单
          div(style='float:left;width:100%;margin-bottom: 10px;padding:30px 25px 0 25px;border-top:2px solid #000;box-sizing: border-box;')
            p(style='width: 38%;display: inline-block;margin:0;') 处方编号：
              span(style="color: red;") {{prescriptionNo}}
            p(style='width: 62%;display: inline-block;margin:0;') 开方日期：{{printdata.diagnoseDate | createAtfilters}}
            // p(style='width: 28%;display: inline-block;margin:0;') 费用类别：自费

          div(style='float:left;width:100%;margin-bottom: 10px;padding:0 25px;box-sizing: border-box;')
            p(style='width: 38%;display: inline-block;margin:0;') 姓名：{{printdata.patientName}}
            p(style='width: 33%;display: inline-block;margin:0;') 性别：
              span(v-if="printdata.gender == 0") 男
              span(v-if="printdata.gender == 1") 女
            p(style='width: 28%;display: inline-block;margin:0;') 年龄：{{printdata.age}}岁

          div(style='float:left;width:100%;margin-bottom: 10px;padding:0 25px;box-sizing: border-box;')
            p(style='width: 38%;display: inline-block;margin:0;') 所属科室：{{$store.state.userInfo.deptName}}
            p(style='width: 33%;display: inline-block;margin:0;') 联系方式：{{printdata.mobile}}
            p(style='width: 28%;display: inline-block;margin:0;')

          div(style='float:left;width:100%;padding:0 25px 30px 25px;border-bottom:2px solid #000;box-sizing: border-box;')
            p(style='display: inline-block;margin:0;') 诊断详情：
              span(v-for="item, i in diagnosisTags", :key="i", v-if="i==0") {{item}}
              span(v-else) , {{item}}

          div(v-for="tag, index in infoVoList", :key="index", v-if="tag.name + (+index+1) == fayaoactivetab")
            div(v-if="tag.name == '药品处方'", style="font-size:33px;font-style:'FZDBSJW--GB1-0';padding: 20px 25px") Rp.
            div(v-if="tag.name == '药品处方'", style="display:flex;flex-direction:row;box-sizing: border-box;margin:0 25px 20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
              span(style="flex:1;") 序号
              span(style="flex:2;") 药品名称
              span(style="flex:2;") 规格
              span(style="flex:1;") 总量
            div(v-for="item, i in tag.table", :key="i", v-if="tag.name == '药品处方'", style="box-sizing: border-box;margin:0 25px 20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
              div(style="display:flex;flex-direction:row;padding-bottom:10px;")
                span(style="flex:1;") {{i+1}}
                span(style="flex:2;") {{item.drugName}}
                span(style="flex:2;") {{item.spec}}
                span(style="flex:1;") {{item.numName}}
              div(style="display:flex;flex-direction:row;padding-bottom:10px;")
                span(style="flex:1;")
                span(style="flex:5;") 用法:
                  span(style="color:#666666") {{item.useageName}}
                  span(style='padding-left: 10px;color:#666666') {{item.singleDose ? '每次' + item.singleDose : ''}}{{item.singleDose ? item.singleDoseUnitName : ''}}
                  span(style='padding-left: 10px;color:#666666') {{item.frequencyName}}
              div(style="display:flex;flex-direction:row;")
                span(style="flex:1;")
                span(style="flex:5;") 备注: 
                  span(style="color:#666666") {{item.memo}}
            div(style="text-align:center;margin-bottom:100px;") 以下空白
          div(v-if="fayaoactivetab != '注射单'", style='font-size:16px;margin-bottom:10px;padding-top:10px;border-top:2px solid #000;') 医生签名：
          div(v-if="fayaoactivetab != '注射单'", style='font-size:16px;display:flex;flex-direction:row;margin-bottom:10px;')
            span(style="flex:1;") 审核药师：
            span(style="flex:1;") 调配药师/士：
            span(style="flex:1;") 核对、发药药师：
          div(v-if="fayaoactivetab != '注射单'")
            div(style='font-weight:bold;font-size:16px;margin-bottom:10px;') 提示：
              span(style='font-weight:normal;font-size:16px;') 1、请遵循医嘱服药、2、请点清药品、3、发出药品不予退还
            div(style='font-weight:bold;font-size:16px;') 注：
              span(style='font-weight:normal;font-size:16px;') 处方开具后24小时内有效
          div(v-if="fayaoactivetab == '注射单'")
            div(style="display:flex;flex-direction:row;box-sizing: border-box;margin:20px 25px;padding-bottom:20px;border-bottom:1px dashed #cccccc;")
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
                span(style="flex:1;") {{item.frequencyName}}
                span(style="flex:1;") {{item.memo}}
            div(style="text-align:center;margin-bottom:100px;") 以下空白
      .shoufeidialogbody
        el-tabs(v-model="fayaoactivetab", type="card")
          el-tab-pane(:label="tag.name + (+index+1)", v-for="tag, index in infoVoList", :key="index", :name="tag.name + (index+1)")
            el-table(
              :data="tag.table",
              v-if="tag.name == '检查处方'"
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              el-table-column(prop='categoryName', label="检查名称")
              el-table-column(prop='memo', label="备注")
              el-table-column(prop='fee', label="费用")

            el-table(
              :data="tag.table",
              v-if="tag.name == '药品处方'"
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              el-table-column(prop='batchNumber', label="入库批号", v-if="printdata.status != 4")
              el-table-column(prop='drugName', label="药品名称")
              el-table-column(prop='spec', label="药品规格")
              el-table-column(prop='manufacturerName', label="生产厂商")
              el-table-column(label="有效期", v-if="printdata.status != 4")
                template(slot-scope="scope")
                  span {{scope.row.expiryDate | datefilters}}
              el-table-column(prop='numName', label="数量")
              el-table-column(label="价格", width='80', align='center')
                template(slot-scope="scope")
                  span {{scope.row.price ? Math.round(scope.row.price*100)/100 : ''}}
            el-table(
              :data="tag.table",
              v-if="tag.name == '附加费'"
              size='medium',
              stripe,
              border,
              style="width: 100%"
            )
              el-table-column(prop='categoryName', label="费用类型")
              el-table-column(prop='fee', label="单价")

          el-tab-pane(label="注射单", name="注射单", v-if="injectList.length > 0")
            div(v-for="(tag, index) in injectList" :key="index", style='margin-bottom: 20px;')
              el-table(
                size='medium',
                stripe,
                :data='tag',
                border,
                style="width: 100%"
              )
                el-table-column(prop="drugName", label="名称")
                el-table-column(prop="manufacturerName", label="生产厂商")
                el-table-column(prop="spec", label="药品规格")
                el-table-column(prop="singleDose", label="单次用量")
                el-table-column(prop="singleDoseUnitName", label="单位")
                el-table-column(prop="frequencyName", label="使用频次")
                el-table-column(prop="memo", label="备注")

        .payinfo
          .left(style='padding:30px 0 0 0')
            el-form
              el-form-item(label="总金额：") 
                span(style='color: red') ¥ {{detailFee}}
</template>

<script>
import { formatTime, htmlDecodeByRegExp } from '@/assets/js/utils'
export default {
  data () {
    return {
      printdata: '',

      searchval: '',
      status: '0',
      date: [],
      paytype: '1',

      pageNum: 1,
      pageSize: this.$store.state.userAgent ? 8 : 20,
      total: 0,
      tableData: [],

      centerDialogVisible: false,
      fayaoDialogVisible: false,
      tuikuanDialogVisible: false,

      fayaoactivetab: '处方1',
      dynamicTags: [],
      shoufeiList: [],

      preList: [],

      clinicNo: '',
      paynum: 0,
      payApplyId: '',

      tuikuanApplyid: '',
      tuikuantype: '0',
      tuikuanFee: 0,
      tuikuanArr: [],
      tuikuanreason: '',
      tuikuanstate: '',

      totalMoney: '',
      detailDialogVisible: false,
      infoVoList: [],
      detailFee: 0,

      payed: 0,
      allpay: 0,
      injectList: [],
      nowfee: '',
      advice: '', // 医嘱
      chiefComplaint: '', // 主诉
      diagnosis: '', // 诊断信息
      prescriptionNo: '', // 处方编号
      diagnosisTags: [] // 诊断
    }
  },
  filters: {
    datefilters (val) {
      if (val) {
        return formatTime(val, 'yyyy-MM-dd')
      } else {
        return ''
      }
    },
    createAtfilters (val) {
      if (val) {
        return formatTime(val, 'yyyy-MM-dd HH:mm')
      } else {
        return ''
      }
    }
  },
  // watch: {
  //   preList: {
  //     handler (list) {
  //       this.tuikuanArr = []
  //       this.tuikuanFee = 0
  //       for (let i = 0; i < list.length; i++) {
  //         for (let j = 0; j < list[i].table.length; j++) {
  //           if (list[i].table[j].ck) {
  //             this.tuikuanArr.push(JSON.parse(JSON.stringify(list[i].table[j])))
  //             if (+list[i].table[j].type === 1) {
  //               this.tuikuanFee += list[i].table[j].retailPrice
  //             } else {
  //               this.tuikuanFee += list[i].table[j].fee
  //             }
  //           }
  //         }
  //       }
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    doprint () {
      let newWindow = window.open('_blank') // 打开新窗口
      let codestr = this.$refs.printBody.innerHTML // 获取需要生成pdf页面的div代码
      newWindow.document.write(`<style type="text/css" media="print">.noprint{display: none;}</style>` + codestr) // 向文档写入HTML表达式或者JavaScript代码
      newWindow.document.close() // 关闭document的输出流, 显示选定的数据
      newWindow.print() // 打印当前窗口
      return true
    },
    closefayaoDialog (done) {
      if (this.printdata.status == 2) {
        this.getList()
      }
      done()
    },
    handleClick (data) {
      this.printdata = data
      console.log(this.printdata)
      this.totalMoney = 0
      this.$confirm('确定发药吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.dispensmedicinelist({
          applyId: data.applyId
        }).then(res => {
          if (res.success) {
            this.$message.success('发药成功!')
            this.fayaoDialogVisible = true
            this.payApplyId = data.applyId
            this.advice = res.result.advice
            this.prescriptionNo = res.result.prescriptionNo
            // 诊断
            if (res.result.diagnosis && !res.result.diagnosis.includes('&&|&&')) {
              this.diagnosisTags[0] = res.result.diagnosis
            }
            if (res.result.diagnosis && res.result.diagnosis.includes('&&|&&')) {
              this.diagnosisTags = res.result.diagnosis.split('&&|&&')
            }
            this.dynamicTags = []
            this.fayaoactivetab = '处方1'
            for (let i = 0; i < res.result.detailList.length; i++) {
              this.dynamicTags.push({
                name: '处方',
                table: res.result.detailList[i]
              })
            }
            this.totalMoney += res.result.totalFee
            this.totalMoney = Math.round(this.totalMoney * 100) / 100
          } else {
            this.$message.error(res.msg)
          }
        })
        // this.$router.push({path: '/doctorvisits/editpatient'})
      })
    },
    checkDetail (row) {
      this.detailDialogVisible = true
      this.printdata = row
      console.log(this.printdata)
      this.detailFee = 0
      this.$api.dispensdetail({
        applyId: row.applyId
      }).then(res => {
        if (res.success) {
          this.infoVoList = []
          // 处方编号
          this.prescriptionNo = res.result.prescriptionNo
          this.advice = res.result.advice
          if (res.result.diagnosis && !res.result.diagnosis.includes('&&|&&')) {
            this.diagnosisTags[0] = res.result.diagnosis
          }
          if (res.result.diagnosis && res.result.diagnosis.includes('&&|&&')) {
            this.diagnosisTags = res.result.diagnosis.split('&&|&&')
          }
          this.injectList = res.result.injectList
          // 处方
          let infoVoList = res.result.infoVoList
          for (let i = 0; i < res.result.infoVoList.length; i++) {
            if (infoVoList[i].medicalInfoList.length > 0) {
              for (let j = 0; j < infoVoList[i].medicalInfoList.length; j++) {
                infoVoList[i].medicalInfoList[j].ck = false
                if (infoVoList[i].medicalInfoList[j].memo) {
                  infoVoList[i].medicalInfoList[j].memo = htmlDecodeByRegExp(infoVoList[i].medicalInfoList[j].memo)
                }
              }
              this.infoVoList.push(JSON.parse(JSON.stringify(
                {
                  name: '药品处方',
                  table: infoVoList[i].medicalInfoList
                }
              )))
            } else if (infoVoList[i].inspectList.length > 0) {
              for (let j = 0; j < infoVoList[i].inspectList.length; j++) {
                infoVoList[i].inspectList[j].ck = false
              }
              this.infoVoList.push(JSON.parse(JSON.stringify(
                {
                  name: '检查处方',
                  table: infoVoList[i].inspectList
                }
              )))
            } else if (infoVoList[i].chargeList.length > 0) {
              for (let j = 0; j < infoVoList[i].chargeList.length; j++) {
                infoVoList[i].chargeList[j].ck = false
              }
              this.infoVoList.push(JSON.parse(JSON.stringify(
                {
                  name: '附加费',
                  table: infoVoList[i].chargeList
                }
              )))
            }
          }
          this.infoVoList.map(item => {
            let price = 0
            item.table.map(i => {
              if (i.price) {
                price += i.price
              }
              if (i.fee) {
                price += i.fee
              }
            })
            item.totalprice = price
          })
          this.fayaoactivetab = this.infoVoList && this.infoVoList[0] ? this.infoVoList[0].name + 1 : ''
          if (res.result.totalFee) {
            this.detailFee = Math.round(res.result.totalFee * 100) / 100
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    shoufeiClick (data) {
      console.log(data)
      this.centerDialogVisible = true
      this.clinicNo = data.clinicNo
      this.$api.dispensPayFee({
        applyId: data.applyId
      }).then(res => {
        if (res.success) {
          // console.log(res)
          this.paynum = 0
          this.payed = 0
          res.result.map(item => {
            item.price = Math.round((item.receivables - item.receipts) * 100) / 100
            if (isNaN(item.price)) {
              item.price = 0
            }
            // 未支付
            this.paynum += item.price
            // 已支付
            this.payed += item.receipts
          })
          if (isNaN(this.paynum)) {
            this.paynum = 0
          }
          if (isNaN(this.payed)) {
            this.payed = 0
          }
          // 总金额
          this.paynum = Math.round(this.paynum * 100) / 100
          this.payed = Math.round(this.payed * 100) / 100
          this.allpay = this.paynum + this.payed
          this.payApplyId = data.applyId
          this.shoufeiList = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    shoufeiOk (data) {
      this.$confirm('确定收款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.dispensPay({
          applyId: this.payApplyId,
          feeType: this.paytype
        }).then(res => {
          if (res.success) {
            this.centerDialogVisible = false
            this.$message({
              type: 'success',
              message: '收款成功!'
            })
            setTimeout(() => {
              this.getList()
            }, 50)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消收款！'
        })
      })
    },
    fayaoOk (data) {
      this.$confirm('确认所有处方药品已发药?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.dispensMedicine({
          applyId: this.payApplyId
        }).then(res => {
          if (res.success) {
            this.fayaoDialogVisible = false
            this.$message({
              type: 'success',
              message: '发药成功!'
            })
            setTimeout(() => {
              this.getList()
            }, 50)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发药！'
        })
      })
    },
    tuikuanOk () {
      this.$confirm('确认退款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.dispensRefund({
          applyId: this.tuikuanApplyid,
          feeType: this.tuikuantype,
          // moList: this.tuikuanArr,
          reason: this.tuikuanreason,
          state: this.tuikuanstate
          // reason (string, optional): 退款理由 ,
          // state (string, optional): 退款说明
        }).then(res => {
          if (res.success) {
            console.log(res)
            this.tuikuanDialogVisible = false
            this.$message({
              type: 'success',
              message: '退款成功!'
            })
            setTimeout(() => {
              this.getList()
            }, 50)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退款！'
        })
      })
    },
    tuikuan (data) {
      this.tuikuanDialogVisible = true
      this.clinicNo = data.clinicNo
      this.tuikuanApplyid = data.applyId
      this.tuikuanFee = 0
      this.$api.dispensrefundlist({
        applyId: data.applyId
      }).then(res => {
        if (res.success) {
          this.preList = []
          for (let i = 0; i < res.result.preList.length; i++) {
            if (res.result.preList[i].itemList.length > 0) {
              for (let j = 0; j < res.result.preList[i].itemList.length; j++) {
                res.result.preList[i].itemList[j].ck = false
              }
              this.preList.push(JSON.parse(JSON.stringify(
                {
                  name: '药品处方',
                  table: res.result.preList[i].itemList
                }
              )))
            } else if (res.result.preList[i].inspectList.length > 0) {
              for (let j = 0; j < res.result.preList[i].inspectList.length; j++) {
                res.result.preList[i].inspectList[j].ck = false
              }
              this.preList.push(JSON.parse(JSON.stringify(
                {
                  name: '检查处方',
                  table: res.result.preList[i].inspectList
                }
              )))
            } else if (res.result.preList[i].chargeList.length > 0) {
              for (let j = 0; j < res.result.preList[i].chargeList.length; j++) {
                res.result.preList[i].chargeList[j].ck = false
              }
              this.preList.push(JSON.parse(JSON.stringify(
                {
                  name: '附加费',
                  table: res.result.preList[i].chargeList
                }
              )))
            }
          }
          this.fayaoactivetab = this.preList && this.preList[0] ? this.preList[0].name + 1 : ''
          this.tuikuanFee = res.result.totalFee
          console.log(res)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getListsearch () {
      this.pageNum = 1
      this.getList()
    },
    getListPage (val) {
      this.pageNum = val
      this.getList()
    },
    getList () {
      this.$api.dispensList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          name: this.searchval ? this.searchval : null,
          status: +this.status ? this.status : null,
          diagnoseStartDate: this.date ? this.$formatTime(this.date[0], 'yyyy-MM-dd') : '',
          diagnoseEndDate: this.date ? this.$formatTime(this.date[1], 'yyyy-MM-dd') : ''
        }
      }).then(res => {
        if (res.success) {
          console.log(res)
          this.tableData = res.result.data
          this.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    feesurvey () {
      this.$api.dispensfeesurvey({
        startDate: this.date ? this.$formatTime(this.date[0], 'yyyy-MM-dd') : null,
        endDate: this.date ? this.$formatTime(this.date[1], 'yyyy-MM-dd') : null
      }).then(res => {
        if (res.success) {
          this.nowfee = Math.round((res.result.totalFee - res.result.totalRefundFee) * 100) / 100
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getchangeList () {
      this.pageNum = 1
      this.getList()
      this.feesurvey()
    }
  },
  created () {
    this.$store.commit('getPaymentMethod')
    this.date = [new Date(), new Date()]
    this.getList()
    this.feesurvey()
  }
}
</script>

<style lang="stylus" scoped>
@import './../../../assets/css/var.styl'
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
      background url(./img/payerror.png) 0 0 no-repeat
      background-size 50px 20px
      &.active
        background url(./img/payok.png) 0 0 no-repeat
        background-size 50px 20px

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

.shoufeidialogbody
  .topinfo
    padding 0 0 15px 0
    border-bottom 1px solid $elSilver
    .line
      display flex
      line-height 2
      justify-content space-between
      .l
        color $elBlack
      .r
        color $lBlack
  .payinfo
    display flex
    flex-flow row nowrap
    .left
      flex 1
      padding 50px 0
    .right
      flex 1
      display flex
      flex-flow column nowrap
      justify-content center
      align-items center
      .ewm
        width 110px
        height 110px
        background $elBlack
        img
          width 100%
          height 100%
      .paytype
        &:not(:first-child)
          margin-top 10px
  .bigbtn
    text-align center
    padding 6px 0
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
  .marginR15
    display flex
    margin-right 15px
    align-items center
    justify-content flex-start
  .my-col
    height 32px
    display flex
    align-items center
    justify-content flex-end
    span
      color $Danger
// .my-row
//   display flex
//   flex-flow row nowrap
//   align-items center
//   justify-content flex-start
//   .my-col-input
//     flex 0 0 260px
//     margin-right 15px
//   .my-col-select
//     flex 0 0 200px
//     margin-right 15px
//   .my-col
//     flex 1
//     text-align right
</style>

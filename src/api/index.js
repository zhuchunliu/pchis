import {axios, hisUrl, loginUrl, qiniuUrl, config} from './config'
import system from './system'

export default {
  // 登陆
  login: (json) => axios.post(loginUrl + '/login', json, config),
  // 退出登录
  loginout: () => axios.get(loginUrl + '/login/logout', {headers: config.headers}),
  userpasswd: (json) => axios.post(hisUrl + '/user/passwd', json, config),
  // 获取个人信息
  userUser: (json) => axios.get(hisUrl + '/user/user', {headers: config.headers, params: json}),
  // 用户菜单
  userMenu: (json) => axios.get(hisUrl + '/user/menu', {headers: config.headers, params: json}),
  // 获取科室挂号列表 deptId status 状态码 状态 0:未就诊;1:已就诊,2:已取消 不填表示全部付费列表 date
  applyIdandstatusanddate: (json) => axios.get(hisUrl + '/apply/idandstatusanddate', {headers: config.headers, params: json}),
  // 'UserCategory'：'用户类型'
  // 'OrgCategory'：'机构类型'
  // 'DrugClassification'：'药品类型'
  // 'ChargeCategory'：'附加费用类型'
  // 'InspectCategory'：'检查单类型'
  // 'ApplyCategory'：'挂号类型'
  // 'FeeItem'：'收费项目类型'
  // 'Permission'：'权限类型'
  // 'AdviceTpl'：'医嘱模板类型'
  // 'DiagnosisTpl'：'诊断模板类型'
  // 'Prescription'：'处方类型'
  // 'PackUnit'：'包装单位'
  // 'PaymentMethod'：'付费方式'
  // 'RouteOfDrug'：'用药途径'
  // 'DosageForm'：'剂型'
  // 'OrgLevel'：'机构等级'
  // 'Schedule'：'排班类型'
  // 'Duty'：'职称等级'
  // 'DiagnosisLevel'：'门诊类型'
  dicItemdicTypeCode: (dicTypeCode) => axios.get(hisUrl + '/dicItem/dicTypeCode', {headers: config.headers, params: {dicTypeCode: dicTypeCode}}),

  // --------------------- 看病就诊 --------------------------
  // 排班列表
  scheduleList: (json) => axios.get(hisUrl + '/schedule/list', {headers: config.headers, params: json}),
  // 复制上周排班
  schedulePrevious: (json) => axios.get(hisUrl + '/schedule/previous', {headers: config.headers, params: json}),
  // 复制并获取上周排班
  scheduleCopy: (json) => axios.get(hisUrl + '/schedule/copy', {headers: config.headers, params: json}),
  // 设置排班信息
  scheduleSave: (json) => axios.post(hisUrl + '/schedule/save', json, config),
  // 就诊接口
  postPre: (json) => axios.post(hisUrl + '/pre', json, config),
  // 获取处方
  getPre: (json) => axios.get(hisUrl + '/pre', {headers: config.headers, params: json}),
  // 病历模板列表
  medicalRecordTpllist: (json) => axios.post(hisUrl + '/medicalRecordTpl/list', json, config),
  // 获取科室列表 orgCode
  deptList: (json) => axios.get(hisUrl + '/dept/list', {headers: config.headers, params: json}),
  // 条件查询 挂号列表
  applyTiaojianchaxun: (json) => axios.get(hisUrl + '/apply/tiaojianchaxun', {headers: config.headers, params: json}),
  // 挂号医生列表 deptId
  scheduleapply: (json) => axios.get(hisUrl + '/schedule/apply', {headers: config.headers, params: json}),
  // 根据挂号单 ID查询 患者
  applyId: (json) => axios.get(hisUrl + '/apply/id', {headers: config.headers, params: json}),
  // 医生添加挂号
  applyaddByDoctor: (json) => axios.post(hisUrl + '/apply/addByDoctor', json, config),
  // 现金收挂号费
  applycashcollection: (json) => axios.get(hisUrl + '/apply/cashcollection', {headers: config.headers, params: json}),
  // 退号
  applycashrefund: (json) => axios.get(hisUrl + '/apply/cashrefund', {headers: config.headers, params: json}),
  // 根据患者ID查询 患者信息
  patientId: (json) => axios.get(hisUrl + '/patientItem/id', {headers: config.headers, params: json}),
  // 查询病历列表
  medicalRecordpatientId: (json) => axios.get(hisUrl + '/medicalRecord/patientItemId', {headers: config.headers, params: json}),
  // 患者库
  patientGetPatientPoolByPage: (json) => axios.post(hisUrl + '/patientItem/getPatientPoolByPage', json, config),
  // 修改患者信息
  patientItemUpdate: (json) => axios.post(hisUrl + '/patientItem/update', json, config),
  // 移出黑名单
  patientItemremovedPatientBlacklist: (json) => axios.get(hisUrl + '/patientItem/removedPatientBlacklist', {headers: config.headers, params: json}),
  // 移入黑名单
  patientItemaddPatientBlacklist: (json) => axios.get(hisUrl + '/patientItem/addPatientBlacklist', {headers: config.headers, params: json}),
  // 根据处方ID获取处方
  getPreDrug: (json) => axios.get(hisUrl + '/pre/drug', {headers: config.headers, params: json}),
  // 获取主诉标签
  getTplChiefComplaintAll: (json) => axios.get(hisUrl + '/tpl/chiefComplaint/all', {headers: config.headers, params: json}),
  // 获取诊断标签
  getTplDiagnosisAll: (json) => axios.get(hisUrl + '/tpl/diagnosis/all', {headers: config.headers, params: json}),
  // 直接新建就诊时，获取门诊编号和处方编号
  pregetNo: (json) => axios.get(hisUrl + '/pre/getNo', {headers: config.headers, params: json}),

  // --------------------- 收费发药 --------------------------
  // 收费发药
  dispensList: (json) => axios.post(hisUrl + '/dispens/list', json, config),
  // dispensFeeList: (json) => axios.get(hisUrl + '/dispens/fee/list', {headers: config.headers, params: json}),
  // 收费发药明细
  dispensPayFee: (json) => axios.get(hisUrl + '/dispens/pay/fee', {headers: config.headers, params: json}),
  // 收费
  dispensPay: (json) => axios.post(hisUrl + '/dispens/pay', json, config),
  // 发药
  dispensMedicine: (json) => axios.post(hisUrl + '/dispens/medicine', json, config),
  // 收费列表明细
  dispensmedicinelist: (json) => axios.get(hisUrl + '/dispens/medicine/list', {headers: config.headers, params: json}),
  // 收费列表明细
  dispensrefundlist: (json) => axios.get(hisUrl + '/dispens/refund/list', {headers: config.headers, params: json}),
  // 退款
  dispensRefund: (json) => axios.post(hisUrl + '/dispens/refund', json, config),
  // 收费详情
  dispensdetail: (json) => axios.get(hisUrl + '/dispens/detail', {headers: config.headers, params: json}),
  // 收支情况
  dispensfeesurvey: (json) => axios.get(hisUrl + '/dispens/fee/survey', {headers: config.headers, params: json}),

  // --------------------- 药品进销存 --------------------------
  // 获取药品 总库的数据
  drugdict: (json) => axios.post(hisUrl + '/drug/dict', json, config),
  // 倒入药品到 自己的药品库
  drugbatch: (json) => axios.post(hisUrl + '/drug/batch', json, config),
  // 获取自己医院的 药品列表
  druglist: (json) => axios.post(hisUrl + '/drug/list', json, config),
  // 获取自己医院的 药品列表
  drugdetail: (json) => axios.get(hisUrl + '/drug/detail', {headers: config.headers, params: json}),
  // 更新药品信息
  drugupdate: (json) => axios.post(hisUrl + '/drug/update', json, config),
  // 删除
  drugdel: (json) => axios.delete(hisUrl + '/drug/del', {headers: config.headers, params: json}),
  // 库存查询
  drugstock: (json) => axios.post(hisUrl + '/drug/stock', json, config),
  // 获取药品总库存
  getstocklist: (json) => axios.post(hisUrl + '/stock/list', json, config),
  // 调整药品价格
  stockmodifyprice: (json) => axios.post(hisUrl + '/stock/modify/price', json, config),
  // 药品批次查询
  batch: (json) => axios.post(hisUrl + '/purchase/batch', json, config),
  // 调价 调整库存
  drugstockmodify: (json) => axios.post(hisUrl + '/drug/stock/modify', json, config),
  // 入库审核列表
  purchaseauditlist: (json) => axios.post(hisUrl + '/purchase/audit/list', json, config),
  // 入库详情
  purchasedetail: (json) => axios.get(hisUrl + '/purchase/detail', {headers: config.headers, params: json}),
  // 删除
  purchasedel: (json) => axios.delete(hisUrl + '/purchase/del', {headers: config.headers, params: json}),
  // 采购入库
  purchasesave: (json) => axios.post(hisUrl + '/purchase/save', json, config),
  // 审核入库
  purchaseaudit: (json) => axios.post(hisUrl + '/purchase/audit', json, config),
  // 获取厂商(有分页)
  getmanufacturerlist: (json) => axios.post(hisUrl + '/manufacturer/listByPage', json, config),
  // 获取厂商(无分页)
  getmanulist: (json) => axios.post(hisUrl + '/manufacturer/list', json, config),
  // 保存厂商
  savemanufacturer: (json) => axios.post(hisUrl + '/manufacturer/save', json, config),
  // 获取供应商(有分页)
  getsupplylistByPage: (json) => axios.post(hisUrl + '/supply/listByPage', json, config),
  // 获取供应商(无分页)
  getsupplylist: (json) => axios.get(hisUrl + '/supply/list', {headers: config.headers, params: json}),
  // 保存供应商
  savesupply: (json) => axios.post(hisUrl + '/supply/save', json, config),
  // 启用/禁用药品
  drugswitch: (json) => axios.post(hisUrl + '/drug/switch', json, config),
  // 查看审核权力
  purchasepermission: () => axios.get(hisUrl + '/purchase/permission', {headers: config.headers}),
  // 入库驳回
  purchasereject: (json) => axios.post(hisUrl + '/purchase/reject', json, config),
  // 药品盘库--查看审核权力
  inventorypermission: () => axios.get(hisUrl + '/inventory/permission', {headers: config.headers}),
  // 药品盘库--入库审核列表
  inventoryauditlist: (json) => axios.post(hisUrl + '/inventory/audit/list', json, config),
  // 药品盘库--审核入库
  inventoryaudit: (json) => axios.post(hisUrl + '/inventory/audit', json, config),
  // 药品盘库--删除入库信息
  inventorydel: (json) => axios.delete(hisUrl + '/inventory/del', {headers: config.headers, params: json}),
  // 药品盘库--入库详情
  inventorydetail: (json) => axios.get(hisUrl + '/inventory/detail', {headers: config.headers, params: json}),
  // 药品盘库--根据药品id查询具体的库存信息
  inventorydrugstocklist: (json) => axios.get(hisUrl + '/inventory/drug/stock/list', {headers: config.headers, params: json}),
  // 药品盘库--驳回
  inventoryreject: (json) => axios.post(hisUrl + '/inventory/reject', json, config),
  // 药品盘库--暂存库存
  inventorysave: (json) => axios.post(hisUrl + '/inventory/save', json, config),
  // 药品盘库--提交审核
  inventorysubmit: (json) => axios.post(hisUrl + '/inventory/submit', json, config),
  // 药品预警
  stockwarn: (json) => axios.get(hisUrl + '/stock/warn', {headers: config.headers, params: json}),
  // 药品预警列表
  stockwarnlist: (json) => axios.post(hisUrl + '/stock/warn/list', json, config),
  // 过期药列表
  stockwarndrug: (json) => axios.get(hisUrl + '/stock/warn/drug', {headers: config.headers, params: json}),
  // 药品文件导入
  uploadExcel: (formData) => axios.post(hisUrl + '/drug/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: function (e) {
      if (e.lengthComputable) {
        // 监听上传进度 进度条 e.loaded / e.total * 100
        // console.log(progress())
        console.log(e.loaded / e.total * 100)
      }
    }
  }),
  // 自建药品信息文件导入
  drugimporttem: (formData) => axios.post(hisUrl + '/drug/import/templet', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: function (e) {
      if (e.lengthComputable) {
        // 监听上传进度 进度条 e.loaded / e.total * 100
        // console.log(progress())
        console.log(e.loaded / e.total * 100)
      }
    }
  }),
  // --------------------- 报表统计 --------------------------
  // 收支明细
  waterDayZhensuoShouzhiCount: (json) => axios.get(hisUrl + '/waterDay/zhensuoShouzhiCount', {headers: config.headers, params: json}),
  waterDaydetailList: (json) => axios.get(hisUrl + '/waterDay/detailList', {headers: config.headers, params: json}),
  // 药品  入库明细
  reportpurchasepage: (json) => axios.post(hisUrl + '/report/purchase/page', json, config),
  // 药品  统计
  reportdrugsurvey: (json) => axios.get(hisUrl + '/report/drug/survey', {headers: config.headers, params: json}),
  // 入库排行
  reportpurchaselist: (json) => axios.get(hisUrl + '/report/purchase/list', {headers: config.headers, params: json}),
  // 药品  出库明细
  reportsalepage: (json) => axios.post(hisUrl + '/report/sale/page', json, config),
  // 出库排行
  reportsalelist: (json) => axios.get(hisUrl + '/report/sale/list', {headers: config.headers, params: json}),
  // 检查统计
  reportinspectlist: (json) => axios.get(hisUrl + '/report/inspect/list', {headers: config.headers, params: json}),
  // 检查项目明细
  reportinspectdetail: (json) => axios.post(hisUrl + '/report/inspect/detail', json, config),
  // 检查项目统计
  reportinspectsurvey: (json) => axios.get(hisUrl + '/report/inspect/survey', {headers: config.headers, params: json}),
  // 年月报表
  waterDayyearMonthBaobiao: (json) => axios.get(hisUrl + '/waterDay/yearMonthBaobiao', {headers: config.headers, params: json}),
  // 机构第一条报表数据
  waterDayfirstWaterDay: (json) => axios.get(hisUrl + '/waterDay/firstWaterDay', {headers: config.headers, params: json}),
  // 挂号门诊统计
  // startTime 开始时间 endTime 结束时间 name 医生姓名 type 排序方式 1:接诊人数(默认排序); 2:门诊收入
  reportlist: (json) => axios.get(hisUrl + '/report/list', {headers: config.headers, params: json}),
  // 按天的预约统计
  // startTime 开始时间 endTime 结束时间
  reportyuyuelist: (json) => axios.get(hisUrl + '/report/yuyuelist', {headers: config.headers, params: json}),

  // --------------------- 供应商查询 --------------------------
  // 供应商查询
  supplylist: (json) => axios.post(hisUrl + '/supply/list', json, config),
  // 关联的供应商查询
  supplyvsorgsupplylist: (json) => axios.get(hisUrl + '/supplyvsorg/supplylist', {headers: config.headers, params: json}),
  // 批量关联供应商 orgCodes
  supplyvsorgaddSupplys: (json) => axios.get(hisUrl + '/supplyvsorg/addSupplys', {headers: config.headers, params: json}),
  // 移除渠道
  supplyvsorgRemoveSupply: (json) => axios.get(hisUrl + '/supplyvsorg/removeSupply', {headers: config.headers, params: json}),

  // 生产厂家
  manufacturerList: (json) => axios.get(hisUrl + '/manufacturer/list', {headers: config.headers, params: json}),

  // 北上广
  orgbsglistpagepc: (json) => axios.get(hisUrl + '/org/bsglistpagepc', {headers: config.headers, params: json}),
  areabsg: (json) => axios.get(hisUrl + '/area/bsg', {headers: config.headers, params: json}),
  // 根据pid查询省市区
  areapid: (json) => axios.get(hisUrl + '/area/pid', {headers: config.headers, params: json}),
  // 设置价格
  accompanyingsetprice: (json) => axios.post(hisUrl + '/accompanying/setprice', json, config),
  orgbsgsave: (json) => axios.post(hisUrl + '/org/bsgsave', json, config),

  // --------------------- 系统设置 --------------------------
  ...system,
  qiniugetTokenAndKey: (json) => axios.get(hisUrl + '/qiniu/getTokenAndKey', {headers: config.headers, params: json}),
  upQnObj: (formData) => axios.post(qiniuUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: function (e) {
      if (e.lengthComputable) {
        // 监听上传进度 进度条 e.loaded / e.total * 100
        // console.log(progress())
        console.log(e.loaded / e.total * 100)
      }
    }
  }),

  // --------------------- 药品零售 --------------------------
  // 添加零售信息
  retailsave: (json) => axios.post(hisUrl + '/retail/save', json, config),
  // 零售列表
  retaillist: (json) => axios.post(hisUrl + '/retail/list', json, config),
  // 零售详情
  retaildetail: (json) => axios.get(hisUrl + '/retail/detail', {headers: config.headers, params: json}),
  // 付费
  retailpay: (json) => axios.post(hisUrl + '/retail/pay', json, config),
  // 付费
  retaildel: (json) => axios.delete(hisUrl + '/retail/del', {headers: config.headers, params: json})
}

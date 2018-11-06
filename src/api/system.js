import {axios, hisUrl, config} from './config'

export default {
  // --------------------- 基础信息 --------------------------
  // 根据字典类型查找字典列表
  dicItemDicTypeCode: (json) => axios.get(hisUrl + '/dicItem/dicTypeCode', {headers: config.headers, params: json}),

  // --------------------- 医生管理 --------------------------
  // 获取医生管理列表
  getDoctorList: (json) => axios.post(hisUrl + '/doctor/list', json, config),
  // 获取医生管理禁用数
  getDoctorDisabledNum: () => axios.get(hisUrl + '/doctor/disable/num', {headers: config.headers}),
  // 新增、编辑医生信息
  doctorSave: (json) => axios.post(hisUrl + '/doctor/save', json, config),
  // 获取医生详情
  getDoctorDetail: (json) => axios.get(hisUrl + '/doctor/detail', {headers: config.headers, params: json}),
  // 禁用，启用医生信息
  doctorSwitch: (json) => axios.post(hisUrl + '/doctor/switch', json, config),
  // 获取权限管理列表
  getRole: (json) => axios.get(hisUrl + '/role/list', {headers: config.headers, params: json}),
  // 角色禁用数
  getRoleDisable: (json) => axios.get(hisUrl + '/role/disable/num', {headers: config.headers, params: json}),
  // 禁用，启用角色信息
  getDisable: (json) => axios.post(hisUrl + '/role/switch', json, config),
  // 获取角色绑定权限列表
  getRolePermission: (json) => axios.get(hisUrl + '/role/permission', {headers: config.headers, params: json}),
  // 新增/编辑 角色信息
  getRoleSave: (json) => axios.post(hisUrl + '/role/save', json, config),
  // --------------------- 科室管理 --------------------------
  // 获取科室管理列表
  getDeptList: (json) => axios.get(hisUrl + '/dept/list', {headers: config.headers, params: json}),
  // 新增、编辑科室信息
  deptsave: (json) => axios.post(hisUrl + '/dept/save', json, config),
  // 删除科室信息
  deptDel: (json) => axios.delete(hisUrl + '/dept/del', {headers: config.headers, params: json}),

  // --------------------- 费用管理 --------------------------
  // 获取费用管理列表
  getFeeList: (json) => axios.get(hisUrl + '/fee/list', {headers: config.headers, params: json}),
  // 新增、编辑费用管理信息
  feeSave: (json) => axios.post(hisUrl + '/fee/save', json, config),
  // 删除费用信息
  feeDel: (json) => axios.delete(hisUrl + '/fee/del', {headers: config.headers, params: json}),

  // --------------------- 诊所信息 --------------------------
  // 获取诊所信息
  getOrgDetail: (json) => axios.get(hisUrl + '/org/detail', {headers: config.headers, params: json}),
  // 保存诊所信息
  orgSave: (json) => axios.post(hisUrl + '/org/save', json, config),
  // 获取头像上传的token
  getqnToken: (json) => axios.get(hisUrl + '/qiniu/getTokenAndKey', {headers: config.headers, params: json}),

  // --------------------- 模板维护 --------------------------
  // --------------------- 处方模板维护 --------------------------
  // 获取处方模板列表
  getTplPrescripTplList: (json) => axios.post(hisUrl + '/tpl/prescripTpl/list', json, config),
  // 获取具体处方配置详情
  getTplPrescripTplDetail: (json) => axios.get(hisUrl + '/tpl/prescripTpl/detail', {headers: config.headers, params: json}),
  // 保存处方模板-检查
  TplPrescripTplInspectSave: (json) => axios.post(hisUrl + '/tpl/prescripTpl/inspect/save', json, config),
  // 保存处方模板-药品
  TplPrescripTplItemSave: (json) => axios.post(hisUrl + '/tpl/prescripTpl/item/save', json, config),
  // 新增处方模板
  tplPrescripTplSave: (json) => axios.post(hisUrl + '/tpl/prescripTpl/save', json, config),
  // 禁用/启用处方模板
  tplPrescripTplItemSwitch: (json) => axios.post(hisUrl + '/tpl/prescripTpl/switch', json, config),
  // 获取药品列表
  getDrugList: (json) => axios.post(hisUrl + '/drug/list', json, config),
  // 获取处方模板禁用数
  getTplPrescripTplDisableNum: (json) => axios.get(hisUrl + '/tpl/prescripTpl/disable/num', {headers: config.headers, params: json}),
  // 删除处方模板
  prescripTplDel: (json) => axios.delete(hisUrl + '/tpl/prescripTpl/del', {headers: config.headers, params: json}),
  // 获取公共模版列表
  tplPrescripTplGlobal: (json) => axios.post(hisUrl + '/tpl/prescripTpl/global', json, config),
  // 导入公共模版
  tplPrescripTplImport: (json) => axios.post(hisUrl + '/tpl/prescripTpl/import', json, config),

  // --------------------- 病历模板维护 --------------------------
  // 获取病历模板列表
  getMedicalRecordList: (json) => axios.post(hisUrl + '/medicalRecordTpl/list', json, config),
  // 添加、编辑病历模板
  medicalRecordSave: (json) => axios.post(hisUrl + '/medicalRecordTpl//save', json, config),
  // 启用病历模板
  medicalRecordUsing: (json) => axios.get(hisUrl + '/medicalRecordTpl/using', {headers: config.headers, params: json}),
  // 禁用病历模板
  medicalRecordForbidden: (json) => axios.get(hisUrl + '/medicalRecordTpl/forbidden', {headers: config.headers, params: json}),
  // 获取已禁用病历数
  medicalRecordForbiddenNum: () => axios.get(hisUrl + '/medicalRecordTpl/forbiddennum', {headers: config.headers}),
  // 查询病历详情
  getMedicalRecordId: (json) => axios.get(hisUrl + '/medicalRecordTpl/id', {headers: config.headers, params: json}),
  // 删除病历模板
  medicalRecordDel: (json) => axios.get(hisUrl + '/medicalRecordTpl/del', {headers: config.headers, params: json}),

  // --------------------- 诊断模板维护 --------------------------
  // 诊断模板列表
  getTplDiagnosisList: (json) => axios.post(hisUrl + '/tpl/diagnosis/list', json, config),
  // 诊断模板禁用数
  getTplDiagnosisDisableNum: () => axios.get(hisUrl + '/tpl/diagnosis/disable/num', {headers: config.headers}),
  // 添加、编辑诊断模板
  TplDiagnosisSave: (json) => axios.post(hisUrl + '/tpl/diagnosis/save', json, config),
  // 禁用/启用诊断模板
  TplDiagnosisSwitch: (json) => axios.post(hisUrl + '/tpl/diagnosis/switch', json, config),
  // 删除诊断模板
  TplDiagnosisDel: (json) => axios.delete(hisUrl + '/tpl/diagnosis/del', {headers: config.headers, params: json}),

  // --------------------- 医嘱模板维护 --------------------------
  // 医嘱模板列表
  getTplAdviceList: (json) => axios.post(hisUrl + '/tpl/advice/list', json, config),
  // 医嘱模板禁用数
  getTplAdviceDisableNum: () => axios.get(hisUrl + '/tpl/advice/disable/num', {headers: config.headers}),
  // 添加、编辑医嘱模板
  TplAdviceSave: (json) => axios.post(hisUrl + '/tpl/advice/save', json, config),
  // 禁用/启用医嘱模板
  TplAdviceSwitch: (json) => axios.post(hisUrl + '/tpl/advice/switch', json, config),
  // 删除医嘱模板
  TplAdviceDel: (json) => axios.delete(hisUrl + '/tpl/advice/del', {headers: config.headers, params: json}),

  // --------------------- 主诉模板维护 --------------------------
  // 主诉模板列表
  getTplChiefComplaintList: (json) => axios.post(hisUrl + '/tpl/chiefComplaint/list', json, config),
  // 主诉模板禁用数
  getTplChiefComplaintDisableNum: () => axios.get(hisUrl + '/tpl/chiefComplaint/disable/num', {headers: config.headers}),
  // 添加、编辑主诉模板
  TplChiefComplaintSave: (json) => axios.post(hisUrl + '/tpl/chiefComplaint/save', json, config),
  // 禁用/启用主诉模板
  TplChiefComplaintSwitch: (json) => axios.post(hisUrl + '/tpl/chiefComplaint/switch', json, config),
  // 删除主诉模板
  TplChiefComplaintDel: (json) => axios.delete(hisUrl + '/tpl/chiefComplaint/del', {headers: config.headers, params: json}),

  // --------------------- 字典表维护 --------------------------
  // 获取字典分类管理
  dicTypeData: (json) => axios.get(hisUrl + '/dicType/list', {headers: config.headers, params: json}),
  // 根据字典类型查找字典列表
  dicTypeCode: (json) => axios.get(hisUrl + '/dicItem/dicTypeCode', {headers: config.headers, params: json}),
  // 添加字典
  addDic: (json) => axios.post(hisUrl + '/dicItem/add', json, config),
  // 编辑
  saveDic: (json) => axios.post(hisUrl + '/dicItem/save', json, config),
  // 删除
  removeDic: (json) => axios.post(hisUrl + '/dicItem/removed', json, config),

  // --------------------- 机构管理 --------------------------
  // 获取机构列表
  getOrgList: (json) => axios.post(hisUrl + '/org/listbyPage', json, config),
  // 新增，编辑机构
  orgsave: (json) => axios.post(hisUrl + '/org/save', json, config),
  // 删除机构
  orgdel: (json) => axios.delete(hisUrl + '/org/del', {headers: config.headers, params: json}),

  // --------------------- 药品字典维护 --------------------------
  // 药品字典列表
  drugdictlist: (json) => axios.post(hisUrl + '/drugdict/list', json, config),
  // 根据ID查询药品字典
  drugdictdetail: (json) => axios.get(hisUrl + '/drugdict/detail', {headers: config.headers, params: json}),
  // 更新药品字典
  drugdictupdate: (json) => axios.post(hisUrl + '/drugdict/update', json, config),
  // 删除药品字典
  drugdictdel: (json) => axios.delete(hisUrl + '/drugdict/del', {headers: config.headers, params: json})
}

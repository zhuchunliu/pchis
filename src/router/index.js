import Vue from 'vue'
import Router from 'vue-router'

const index = r => require.ensure([], () => r(require('@/pages/index')), 'index')
const login = r => require.ensure([], () => r(require('@/pages/login')), 'login')

const admissions = r => require.ensure([], () => r(require('@/pages/doctorvisits/admissions')), 'admissions')
const scheduling = r => require.ensure([], () => r(require('@/pages/doctorvisits/scheduling')), 'scheduling')
const addtreatment = r => require.ensure([], () => r(require('@/pages/doctorvisits/addtreatment')), 'addtreatment')
const addguahao = r => require.ensure([], () => r(require('@/pages/doctorvisits/addguahao')), 'addguahao')
const treatment = r => require.ensure([], () => r(require('@/pages/doctorvisits/treatment')), 'treatment')
const registrationlist = r => require.ensure([], () => r(require('@/pages/doctorvisits/registrationlist')), 'registrationlist')
const patientslibrary = r => require.ensure([], () => r(require('@/pages/doctorvisits/patientslibrary')), 'patientslibrary')
const editpatient = r => require.ensure([], () => r(require('@/pages/doctorvisits/editpatient')), 'editpatient')
const historyadmiss = r => require.ensure([], () => r(require('@/pages/doctorvisits/historyadmiss')), 'historyadmiss')

const dispensefee = r => require.ensure([], () => r(require('@/pages/dispensingfees/dispensefee')), 'dispensefee')
const sellfees = r => require.ensure([], () => r(require('@/pages/dispensingfees/sellfees')), 'sellfees')
const newsellfee = r => require.ensure([], () => r(require('@/pages/dispensingfees/sellfees/newsellfee')), 'newsellfee')

const informationmaintenance = r => require.ensure([], () => r(require('@/pages/druginventory/informationmaintenance')), 'informationmaintenance')
const supplier = r => require.ensure([], () => r(require('@/pages/druginventory/supplier')), 'supplier')
const purchase = r => require.ensure([], () => r(require('@/pages/druginventory/purchase')), 'purchase')
const storageaudit = r => require.ensure([], () => r(require('@/pages/druginventory/storageaudit')), 'storageaudit')
const instock = r => require.ensure([], () => r(require('@/pages/druginventory/instock')), 'instock')

const systemdoctor = r => require.ensure([], () => r(require('@/pages/system/doctor')), 'systemdoctor')
const systemdepartments = r => require.ensure([], () => r(require('@/pages/system/departments')), 'systemdepartments')
const systemstencil = r => require.ensure([], () => r(require('@/pages/system/stencil')), 'systemstencil')
const systemaddstenciltemplate = r => require.ensure([], () => r(require('@/pages/system/model/addstenciltemplate')), 'systemaddstenciltemplate')
const systemcheckchufangmodel = r => require.ensure([], () => r(require('@/pages/system/model/checkChufangModel')), 'systemcheckchufangmodel')
const systemaddbinglistenciltemplate = r => require.ensure([], () => r(require('@/pages/system/model/addbinglistenciltemplate')), 'systemaddbinglistenciltemplate')
const systemaddzdmodel = r => require.ensure([], () => r(require('@/pages/system/model/addZDModel')), 'systemaddzdmodel')
const systemaddyzmodel = r => require.ensure([], () => r(require('@/pages/system/model/addYZModel')), 'systemaddYZmodel')
const systemcost = r => require.ensure([], () => r(require('@/pages/system/cost')), 'systemcost')
const systemdictionary = r => require.ensure([], () => r(require('@/pages/system/dictionary')), 'systemdictionary')
const systemclinic = r => require.ensure([], () => r(require('@/pages/system/clinic')), 'systemclinic')

const statistics = r => require.ensure([], () => r(require('@/pages/statistics')), 'statistics')
const statisticsbalanceofpayments = r => require.ensure([], () => r(require('@/pages/statistics/balanceofpayments')), 'statisticsbalanceofpayments')
const statisticsdrug = r => require.ensure([], () => r(require('@/pages/statistics/drug')), 'statisticsdrug')
const statisticsinspection = r => require.ensure([], () => r(require('@/pages/statistics/inspection')), 'statisticsinspection')
const statisticsyearmonth = r => require.ensure([], () => r(require('@/pages/statistics/yearmonth')), 'statisticsyearmonth')
const statisticswork = r => require.ensure([], () => r(require('@/pages/statistics/work')), 'statisticswork')

// 新增页面
const firstpage = r => require.ensure([], () => r(require('@/pages/firstpage')), 'firstpage')
const systempermission = r => require.ensure([], () => r(require('@/pages/system/permission')), 'systempermission')
const systemorganization = r => require.ensure([], () => r(require('@/pages/system/organization')), 'systemorganization')
const systemaddsupplier = r => require.ensure([], () => r(require('@/pages/system/addsupplier')), 'systemaddsupplier')
const systemaddmanufactured = r => require.ensure([], () => r(require('@/pages/system/addmanufactured')), 'systemaddmanufactured')
const stockcheck = r => require.ensure([], () => r(require('@/pages/druginventory/stockcheck')), 'stockcheck')
const stockcheckpurchase = r => require.ensure([], () => r(require('@/pages/druginventory/stockcheckpurchase')), 'stockcheckpurchase')
const systemdrugdic = r => require.ensure([], () => r(require('@/pages/system/drugdic')), 'systemdrugdic')

const bsghospitallist = r => require.ensure([], () => r(require('@/pages/bsg/hospitallist')), 'bsghospitallist')
const bsghospitaledit = r => require.ensure([], () => r(require('@/pages/bsg/hospitaledit')), 'bsghospitaledit')
const bsgdeptedit = r => require.ensure([], () => r(require('@/pages/bsg/deptedit')), 'bsgdeptedit')

Vue.use(Router)

export default new Router({
  mode: 'hash', // history
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: '首页',
      component: index,
      // redirect: '/doctorvisits/admissions',
      children: [
        {
          path: '/firstpage',
          name: '首页',
          component: firstpage
        },
        {
          path: '/doctorvisits/admissions',
          name: '医生门诊',
          component: admissions
        },
        {
          path: '/doctorvisits/scheduling',
          name: '医生排班',
          component: scheduling
        },
        {
          path: '/doctorvisits/addtreatment',
          name: '新建就诊',
          component: addtreatment
        },
        {
          path: '/doctorvisits/addguahao',
          name: '新建挂号',
          component: addguahao
        },
        {
          path: '/doctorvisits/treatment',
          name: '就诊',
          component: treatment
        },
        {
          path: '/doctorvisits/registrationlist',
          name: '挂号列表',
          component: registrationlist
        },
        {
          path: '/doctorvisits/patientslibrary',
          name: '患者库',
          component: patientslibrary
        },
        {
          path: '/doctorvisits/editpatient',
          name: '编辑',
          component: editpatient
        },
        {
          path: '/doctorvisits/historyadmiss',
          name: '查看',
          component: historyadmiss
        },
        {
          path: '/dispensingfees/dispensefee',
          name: '收费发药',
          component: dispensefee
        },
        {
          path: '/dispensingfees/sellfees',
          name: '药品零售',
          component: sellfees
        },
        {
          path: '/dispensingfees/sellfees/newsellfee',
          name: '新建药品零售',
          component: newsellfee
        },
        {
          path: '/druginventory/informationmaintenance',
          name: '药品信息管理',
          component: informationmaintenance
        },
        {
          path: '/druginventory/supplier',
          name: '供应商维护',
          component: supplier
        },
        {
          path: '/druginventory/purchase',
          name: '采购入库',
          component: purchase
        },
        {
          path: '/druginventory/storageaudit',
          name: '入库审核',
          component: storageaudit
        },
        {
          path: '/druginventory/instock',
          name: '库存查询',
          component: instock
        },
        {
          path: '/system/doctor',
          name: '员工管理',
          component: systemdoctor
        },
        {
          path: '/system/departments',
          name: '科室管理',
          component: systemdepartments
        },
        {
          path: '/system/stencil',
          name: '模板管理',
          component: systemstencil
        },
        {
          path: '/system/addstenciltemplate',
          name: '编辑处方模板',
          component: systemaddstenciltemplate
        },
        {
          path: '/system/checkchufangmodel',
          name: '检查处方模板',
          component: systemcheckchufangmodel
        },
        {
          path: '/system/addbinglistenciltemplate',
          name: '编辑病历模板',
          component: systemaddbinglistenciltemplate
        },
        {
          path: '/system/systemaddzdmodel',
          name: '编辑诊断模板',
          component: systemaddzdmodel
        },
        {
          path: '/system/systemaddyzmodel',
          name: '编辑医嘱模板',
          component: systemaddyzmodel
        },
        {
          path: '/system/cost',
          name: '费用管理',
          component: systemcost
        },
        {
          path: '/system/dictionary',
          name: '字典表维护',
          component: systemdictionary
        },
        {
          path: '/system/clinic',
          name: '诊所信息',
          component: systemclinic
        },
        {
          path: '/statistics',
          name: '统计报表',
          component: statistics,
          children: [
            {
              path: '/statistics/balanceofpayments',
              name: '诊所收支统计',
              component: statisticsbalanceofpayments
            },
            {
              path: '/statistics/drug',
              name: '药品销售统计',
              component: statisticsdrug
            },
            {
              path: '/statistics/inspection',
              name: '项目检查统计',
              component: statisticsinspection
            },
            {
              path: '/statistics/yearmonth',
              name: '年月报表统计',
              component: statisticsyearmonth
            },
            {
              path: '/statistics/work',
              name: '工作量统计',
              component: statisticswork
            }
          ]
        },
        {
          path: '/system/permission',
          name: '权限管理',
          component: systempermission
        },
        {
          path: '/system/organization',
          name: '机构管理',
          component: systemorganization
        },
        {
          path: '/system/addmanufactured',
          name: '新增厂商',
          component: systemaddmanufactured
        },
        {
          path: '/system/addsupplier',
          name: '新增供应商',
          component: systemaddsupplier
        },
        {
          path: '/druginventory/stockcheck',
          name: '库存盘点',
          component: stockcheck
        },
        {
          path: '/druginventory/stockcheckpurchase',
          name: '盘点审核',
          component: stockcheckpurchase
        },
        {
          path: '/system/drugdic',
          name: '药品字典维护',
          component: systemdrugdic
        },
        {
          path: '/bsg/hospitallist',
          name: '北上广医院列表',
          component: bsghospitallist
        },
        {
          path: '/bsg/hospitaledit',
          name: '北上广医院新增与编辑',
          component: bsghospitaledit
        },
        {
          path: '/bsg/deptedit',
          name: '北上广科室管理',
          component: bsgdeptedit
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})

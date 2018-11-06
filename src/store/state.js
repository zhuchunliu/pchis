export default {
  // 登录平台
  userAgent: 0,

  userToken: false,
  userStatus: -1,
  // 医生信息
  userInfo: {},
  // 门诊列表 未就诊
  mzWjzList: {
    pageSize: 20,
    pageNum: 1,
    total: 0,
    data: []
  },
  // 门诊列表 就诊中
  mzJzzList: {
    pageSize: 20,
    pageNum: 1,
    total: 0,
    data: []
  },
  // 门诊列表 已就诊
  mzYjzList: {
    pageSize: 20,
    pageNum: 1,
    total: 0,
    data: []
  },
  // 挂号列表
  ghList: {
    pageSize: 20,
    pageNum: 1,
    total: 0,
    data: []
  },
  // 排班
  loading: true,
  isgetScheduleDicLists: false,
  scheduleDicLists: [],
  scheduleLists: [],
  // 科室列表
  isgetDeptLists: false,
  deptLists: [],
  drugType: [],
  // 供应商列表
  supplylist: [],
  // 付款类型
  isgetPaymentMethod: false,
  PaymentMethodType: [],

  submenuType: 0,
  activeIndex: '1',
  todaypickerOptionsone: {
    disabledDate: time => {
      let tomorrow = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      let starttime = time.getTime() > tomorrow
      return starttime
    }
  }
}

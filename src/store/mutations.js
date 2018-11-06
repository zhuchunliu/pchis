import router from '@/router'
import api from '@/api'
import { Message } from 'element-ui'
import { setStore, removeStore } from '@/assets/js/utils'
import dic from '@/assets/js/typeConfigure'

export default {
  // 登录
  login (state, user) {
    api.login(user).then(res => {
      if (res === undefined || res === '') {
        return
      }
      if (res.success) {
        console.log(res)
        state.userToken = res.result.token
        state.userStatus = res.result.status
        setStore('userToken', res.result)
        if (router.currentRoute.query && router.currentRoute.query.hostory) {
          router.push({path: router.currentRoute.query.hostory})
        } else {
          router.push({path: '/'})
        }
        this.commit('getUserInfo')
      } else if (res.statusCode !== 'ERROR_FORBIDDEN') {
        Message.error(res.msg)
      }
    })
  },
  // 登出
  logout (state) {
    state.isgetDeptLists = false
    state.userToken = false
    state.userStatus = -1
    state.userInfo = {}
    api.loginout().then(res => {
      if (res.success) {
        removeStore('userToken')
        // removeStore('asideWidth')
        router.push({path: '/login', query: {hostory: router.currentRoute.fullPath}})
      } else {
        Message.error(res.msg)
      }
    })
  },
  getUserInfo (state) {
    api.userUser().then(res => {
      if (res.success) {
        // console.log(res.result)
        state.userInfo = res.result
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 获取排班字典信息
  getScheduleDicLists (state) {
    if (state.isgetScheduleDicLists) {
      return false
    }
    api.dicItemdicTypeCode('Schedule').then(res => {
      if (res.success) {
        state.isgetScheduleDicLists = true
        state.scheduleDicLists = res.result
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 获取药品类型
  getDrugType (state) {
    api.dicItemdicTypeCode('DrugClassification').then(res => {
      if (res.success) {
        console.log(res)
        state.drugType = res.result
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 获取排班列表
  getScheduleList (state, json) {
    state.loading = true
    api.scheduleList(json).then(res => {
      if (res.success) {
        state.scheduleLists = res.result
        state.loading = false
        console.log(res.result)
      } else {
        Message.error(res.msg)
      }
    })
  },
  delScheduleDicLists (state) {
    state.loading = true
    state.scheduleLists = []
  },
  // 获取科室列表
  getDeptLists (state) {
    if (state.isgetDeptLists) {
      return false
    }
    if (!state.userInfo.orgCode) {
      setTimeout(() => {
        this.commit('getDeptLists')
      }, 50)
      return false
    }
    api.deptList({orgCode: state.userInfo.orgCode}).then(res => {
      if (res.success) {
        state.isgetDeptLists = true
        state.deptLists = res.result
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 门诊未就诊
  getWjzMenzhenList (state, json) {
    json.status = 0
    json.isPaid = 1
    api.applyTiaojianchaxun(json).then(res => {
      if (res.success) {
        state.mzWjzList.total = res.result.total
        state.mzWjzList.data = res.result.data
        state.mzWjzList.pageNum = res.result.pageNum
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 就诊中
  getJzzMenzhenList (state, json) {
    json.status = 3
    json.isPaid = 1
    api.applyTiaojianchaxun(json).then(res => {
      if (res.success) {
        state.mzJzzList.total = res.result.total
        state.mzJzzList.data = res.result.data
        state.mzJzzList.pageNum = res.result.pageNum
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 门诊已就诊
  getYjzMenzhenList (state, json) {
    json.status = 1
    api.applyTiaojianchaxun(json).then(res => {
      if (res.success) {
        state.mzYjzList.total = res.result.total
        state.mzYjzList.data = res.result.data
        state.mzYjzList.pageNum = res.result.pageNum
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 挂号列表
  getGuahaoList (state, json) {
    json.status = 0
    api.applyTiaojianchaxun(json).then(res => {
      if (res.success) {
        state.ghList.total = res.result.total
        state.ghList.data = res.result.data
        state.ghList.pageNum = res.result.pageNum
      } else {
        Message.error(res.msg)
      }
    })
  },
  getSupplyList (state) {
    api.supplyvsorgsupplylist({
      removed: '0'
    }).then(res => {
      if (res.success) {
        // console.log(res.result)
        state.supplylist = res.result
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 获取付款类型
  getPaymentMethod (state) {
    if (state.isgetPaymentMethod) {
      return false
    }
    api.dicItemdicTypeCode(dic.PaymentMethod).then(res => {
      if (res.success) {
        console.log(res)
        state.isgetPaymentMethod = true
        state.PaymentMethodType = res.result
      } else {
        Message.error(res.msg)
      }
    })
  },
  // 左侧菜单栏的选中状态
  jump (state, json) {
    state.submenuType = json.type || 1
    if (state.submenuType == 1) {
      state.activeIndex = 1
    } else {
      state.activeIndex = json.t
    }
  }
}

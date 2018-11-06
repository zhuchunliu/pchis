import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'

let loginUrl = process.env.loginUrl
let hisUrl = process.env.hisUrl
let qiniuUrl = process.env.qiniuUrl

console.log(process.env)
// let loginUrl = 'http://121.42.153.1:8990/user'
// let hisUrl = 'http://121.42.153.1:8994/his'
// let loginUrl = 'http://47.97.26.165:8990/user'  // 演示
// let hisUrl = 'http://47.97.26.165:8994/his'     // 演示

// let hisUrl = 'http://192.168.31.253:8994/his'

// http://121.42.153.1:8994/his/swagger-ui.html

let config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

// 拦截 req
axios.interceptors.request.use(function (config) {
  if (store.state.userToken) {
    config.headers.Authorization = store.state.userToken
  } else {
    config.headers.Authorization = ''
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

// 拦截 res
axios.interceptors.response.use(function (response) {
  // console.log(response.status)
  if (response.data.statusCode === 'ERROR_FORBIDDEN' || response.data.statusCode === 'ERROR_TOKEN') {
    Message.error(response.data.msg)
    store.commit('logout')
  } else {
    // console.log('成功')
    if (response.data.statusCode === 'ERROR_TOKEN') {
      Message.error(response.data.msg)
      store.commit('logout')
    }
    return response.data
  }
}, function (error) {
  if (error.message == 'Network Error') {
    Message.error('网络错误，请检查网络！')
  }
  return Promise.reject(error)
})

export {config, axios, loginUrl, hisUrl, qiniuUrl}

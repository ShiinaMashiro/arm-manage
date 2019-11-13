'use strict'

import Vue from 'vue'
import axios from 'axios'
import store from './store'
import router from './router'
import Qs from "qs"

const vm = new Vue()
const baseUrl = ""

axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error)
    vm.$message.error("请求错误")
  }
)

let loginTimeout = false

axios.interceptors.response.use(
  (res) => {
    // console.log(res)
    let obj = res.data
    if (obj.success) {
      loginTimeout = false
      return res.data
    } else {
      if (obj.code === '10105' && !loginTimeout) {
        loginTimeout = true
        vm.$message.error("登录状态过期")
        store.commit("LOGIN_FORWARD_PATH", router.currentRoute.path)
        router.push("/")
      } else {
        let mes = obj.message || "请求失败"
        vm.$message.error(mes)
      }
      return Promise.reject(obj.message)
    }
  },
  (error) => {
    console.log(error)
    vm.$message.error("请求错误")
    return Promise.reject(error)
  }
)

export const postData = (url, params) => {
  url = url.path || url
  return axios.post(baseUrl + url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...store.state.userInfo,
      userId: store.state.userInfo.id
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
      // return Qs.stringify({...data})
    }]
  })
}

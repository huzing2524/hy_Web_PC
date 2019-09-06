import Axios from 'axios'
import { ArrangeHttpMethod } from '_common/util'

// 获取系统信息
export function getSystemMessage() {
  return ArrangeHttpMethod('get')('/system/message')
}

// 设置登陆系统头像
export function setHeadPhoto(params) {
  return requestAsFormData({ url: '/system/message/logo/', params })
}

// 设置登陆背景图
export function setBgPhoto(params) {
  return requestAsFormData({ url: '/system/message/bg/', params })
}

function requestAsFormData({ url, params, method = 'put' }) {
  Axios.defaults.timeout = 60 * 1000
  const rootUrl = window.location.origin + '/api/v1/'
  Axios.defaults.baseURL = rootUrl
  let data = new FormData()
  Object.keys(params).forEach((key) => {
    data.append(key, params[key])
  })
  return Axios({
    method,
    url,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: localStorage.getItem('Authorization') + '',
    },
  })
}

// 设置系统名字
export function setSystemName(params) {
  return ArrangeHttpMethod('put')('/system/message/name/', params)
}

// 设置登陆系统允许的失败次数
export function setSystemTimes(params) {
  return ArrangeHttpMethod('put')('system/message/failureTimes/', params)
}




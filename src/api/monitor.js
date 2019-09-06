import { ArrangeHttpMethod } from '_common/util'

// 获取图表数据
export function MainChart(params, methods) {
  return ArrangeHttpMethod(methods)('monitor/main/chart', params)
}

// 获取图表数据
export function ChartData(params, methods, path) {
  return ArrangeHttpMethod(methods)('/monitor/chart/data/' + path, params)
}

// 获取表格数据条目
export function ChartDeviceItems(params, methods) {
  return ArrangeHttpMethod(methods)('/monitor/chart/device_items/', params)
}

// 创建新图表
export function Chart(params, methods, path) {
  return ArrangeHttpMethod(methods)(
    '/monitor/chart' + (path ? '/' + path : ''),
    params,
  )
}
// 主页地图数据
export function GetDevicesData(params, methods) {
  return ArrangeHttpMethod(methods)('/monitor/main/map/', params)
}

import Axios from 'axios'
function requestAsFormData({ url, params, method = 'post' }) {
  Axios.defaults.timeout = 60 * 1000
  const rootUrl = window.location.origin + '/api/v1/'
  Axios.defaults.baseURL = rootUrl
  var data = new FormData()
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

export function ChartImg(params) {
  console.log(params)
  return requestAsFormData({
    url: '/monitor/chart/img/',
    params,
  })
}

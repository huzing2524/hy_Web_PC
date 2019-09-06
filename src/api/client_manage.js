import Axios from 'axios'

import { ArrangeHttpMethod } from '_common/util'

// 获取客户列表 /api/v1/customer
export function getCustomerList(params) {
  return ArrangeHttpMethod('get')('/customer/', params)
}

// 锁定客户 /api/v1/customer/lock/{id}
export function lockCustomer(path) {
  return ArrangeHttpMethod('post')('/customer/lock' + (path ? ('/' + path) : ''))
}

// 解锁客户 /api/v1/customer/unlock/{id}
export function unlockCustomer(path) {
  return ArrangeHttpMethod('post')('/customer/unlock' + (path ? ('/' + path) : ''))
}

// 获取客户详情/api/v1/customer/detail/{id}
export function getCustomerDetail(path) {
  return ArrangeHttpMethod('get')('/customer/detail'+ (path ? ('/' + path) : '/'))
}

// 修改客户/api/v1/customer/{id}
export function modifyCustomer2(path, params) {
  return ArrangeHttpMethod('put')('/customer'+ (path ? ('/' + path + '/') : '/'), params)
}

export function modifyCustomer(path, params) {
  return requestAsFormData({
    method:'put',
    url: '/customer'+ (path ? ('/' + path + '/') : '/'),
    params,
  })
}

// 删除客户 /api/v1/customer/{id}
export function deleteCustomer(path) {
  return ArrangeHttpMethod('delete')('/customer'+ (path ? ('/' + path+'/') : '/'))
}

// 获取客户站点列表 /api/v1/customer/site
export function getCustomerSiteList(path, params) {
  return ArrangeHttpMethod('get')('/customer' + (path ? ('/' + path) : '') + '/site', params)
}

// 新增客户站点 /api/v1/customer/site/{client_id}
export function addCustomerSite(path, params) {
  return ArrangeHttpMethod('post')('/customer/site' + (path ? ('/' + path) : ''), params)
}

// 修改客户站点 /api/v1/customer/site/{site_id}
export function modifyCustomerSite(path, params) {
  return ArrangeHttpMethod('put')('/customer/site' + (path ? ('/' + path) : ''), params)
}

// 删除客户站点 /api/v1/customer/site/{site_id}
export function deleteCustomerSite(path) {
  return ArrangeHttpMethod('delete')('/customer/site'+ (path ? ('/' + path) : ''))
}

// 地区客户列表 /api/v1/region/customer
export function regionCustomer(params, methods, path) {
  return ArrangeHttpMethod(methods)('/region/customer' + (path ? ('/' + path) : ''), params)
}

// 客户站点列表 /api/v1/customer/{customer_id}/site
export function customerSite(params, methods, customer_id) {
  return ArrangeHttpMethod(methods)('/customer/' + (customer_id ? customer_id : '') + '/site', params)
}
// 新增客户
export function addCustomer(params) {
  return requestAsFormData({
    url: '/customer/',
    params,
  })
}
function requestAsFormData({ url, params, method = 'post' }) {
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

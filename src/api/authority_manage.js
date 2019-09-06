// import Axios from 'axios'
import { ArrangeHttpMethod } from '_common/util'

// 获取权限管理列表 /authority
export function getAuthorityList(params) {
  return ArrangeHttpMethod('get')('/authority', params)
}
// 修改管理员/authority/{account_id}
export function modifyManager(path, params) {
  return ArrangeHttpMethod('put')('/authority'+ (path ? ('/' + path ) : ''), params)
}

// 增加管理员/authority
export function addManager(params) {
  return ArrangeHttpMethod('post')('/authority', params)
}

// 删除管理员/authority/{id}
export function deleteManager(path) {
  return ArrangeHttpMethod('delete')('/authority' + (path ? ('/' + path) : ''))
}

// 获取公司列表 /customer/list
export function getCustomerList(params) {
  return ArrangeHttpMethod('get')('/customer/list', params)
}


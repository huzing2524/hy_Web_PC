
import { ArrangeHttpMethod } from '_common/util'

//设备管理列表
export function equipment(params, methods, path) {
  return ArrangeHttpMethod(methods)('/equipment' + (path ? ('/' + path) : ''), params)
}

//站点设备列表
export function equipmentSite(params, methods, path) {
  return ArrangeHttpMethod(methods)('/equipment/site' + (path ? ('/' + path) : ''), params)
}

//获取设备数据类型
export function equipmentItems(params, methods, path) {
  return ArrangeHttpMethod(methods)('/equipment/items' + (path ? ('/' + path) : ''), params)
}

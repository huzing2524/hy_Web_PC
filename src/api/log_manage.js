// import Axios from 'axios'
import { ArrangeHttpMethod } from '_common/util'

// 获取日志管理列表 /log/managementlist
export function getLogList(params) {
  return ArrangeHttpMethod('get')('/log/managementlist',params)
}

// 获取日志管理列表 /log/managementlist/table
export function getLogTable(params) {
  return ArrangeHttpMethod('get')('/log/managementlist/table',params)
}

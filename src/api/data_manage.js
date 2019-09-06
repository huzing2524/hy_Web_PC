
import { ArrangeHttpMethod } from '_common/util'

//历史数据列表
export function histroyData(params, methods, path) {
  return ArrangeHttpMethod(methods)('/histroydata' + (path ? ('/' + path) : ''), params)
}

//数据分析列表
export function analysisData(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis' + (path ? ('/' + path) : ''), params)
}

//历史数据列表excel
export function histroyDataExcel(params, methods, path) {
  return ArrangeHttpMethod(methods)('/histroydata/excel' + (path ? ('/' + path) : ''), params)
}

//实时数据表格
export function analysisRealtime(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis/realtime' + (path ? ('/' + path) : ''), params)
}

//实时数据条目
export function analysisRealtimeItems(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis/realtime/items' + (path ? ('/' + path) : ''), params)
}

//实时数据条目详情to excel
export function analysisItemsExcel(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis/realtime/items' + (path ? ('/' + path) : '') + '/excel', params)
}

//数据看板 首页
export function analysisChartMain(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis/chart/main' + (path ? ('/' + path) : ''), params)
}

//数据看板 创建新图表
export function analysisChart(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis/chart' + (path ? ('/' + path) : ''), params)
}

//数据看板 获取图表数据条目
export function analysisChartDeviceItems(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis/chart/device_items' + (path ? ('/' + path) : ''), params)
}

//数据看板 获取图表数据
export function analysisChartData(params, methods, path) {
  return ArrangeHttpMethod(methods)('/analysis/chart/data' + (path ? ('/' + path) : ''), params)
}


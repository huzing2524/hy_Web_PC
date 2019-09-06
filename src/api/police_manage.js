
import { ArrangeHttpMethod } from '_common/util'

//实时报警
export function policeReal(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/real' + (path ? ('/' + path) : ''), params)
}

//确认报警
export function policeConfirm(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police' + (path ? ('/' + path) : ''), params)
}

//历史报警
export function policeHistory(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/history' + (path ? ('/' + path) : ''), params)
}

//历史报警导出
export function policeHistoryExcel(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/history/excel' + (path ? ('/' + path) : ''), params)
}

//报警通知  启用通知  关闭通知
export function policeNotice(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/notice' + (path ? ('/' + path) : ''), params)
}

//报警通知人 新增修改删除
export function policeNoticer(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/noticer' + (path ? ('/' + path) : ''), params)
}

//报警等级 修改报警优先级
export function policeLevel(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/level' + (path ? ('/' + path) : ''), params)
}

//报警预测
export function policePredict(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/predict' + (path ? ('/' + path) : ''), params)
}

//报警详情
export function policeDetail(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/detail' + (path ? ('/' + path) : ''), params)
}

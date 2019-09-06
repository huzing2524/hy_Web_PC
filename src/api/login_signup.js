
import { ArrangeHttpMethod } from '_common/util'

/**
 * 登录
 * @param {Object} params
 * @param {String} method
 */
export function login(params, methods, path) {
  return ArrangeHttpMethod(methods)('/login' + (path ? ('/' + path) : ''), params)
}

/**
 * 发送验证码
 * @param {Object} params
 * @param {String} method
 */
export function sendCode(params, methods, path) {
  return ArrangeHttpMethod(methods)('/send/code' + (path ? ('/' + path) : ''), params)
}

/**
 * 重置密码
 * @param {Object} params
 * @param {String} method
 */
export function resetPwd(params, methods) {
  return ArrangeHttpMethod(methods)('/reset/' , params)
}

import Axios from 'axios'
import { ArrangeHttpMethod } from '_common/util'

// 获取使用手册 /service/manual
export function getServiceManual() {
  return ArrangeHttpMethod('get')('/service/manual')
}

// 上传使用手册 /service/manual
export function uploadServiceManual(params) {
  return uploadFile({ url: '/service/manual/', params })

}
function uploadFile({ url, params, method = 'post' }) {
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

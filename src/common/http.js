import Axios from 'axios'
import { ArrangeParams } from './util'
import Bus from '@/bus/'
// import qs from 'querystring'

Axios.defaults.timeout = 20000
Axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
Axios.defaults.headers['Authorization'] =
  localStorage.getItem('Authorization') + ''
Axios.defaults.headers['Authorization'] =
  localStorage.getItem('Authorization') + ''
// export const rootUrl =
//   process.env.NODE_ENV == 'development'
//     ? 'http://10.10.10.30:8000'
//     : window.location.origin
// export const rootUrl = process.env.NODE_ENV == 'development' ? 'https://yapi.tenv.dsdiot.com/mock/23/api/v1/' : window.location.origin + '/api/v1/'
// export const rootUrl = window.location.origin + '/api/v1/'
export const rootUrl = window.location.origin

Axios.defaults.baseURL = rootUrl

let requestTime = 0

// 添加请求拦截器
Axios.interceptors.request.use(
  function(config) {
    requestTime++
    Bus.$emit('showLoading', requestTime)
    return config
  },
  function(err) {
    // 对请求错误做些什么
    requestTime = 0
    Bus.$emit('showLoading', 0)
    Bus.$emit('SystemError', '请求错误，请稍候再试')
    return Promise.reject(err)
  },
)

Axios.interceptors.response.use(
  function(res) {
    requestTime--
    Bus.$emit('showLoading', requestTime)
    return res
  },
  function(err) {
    requestTime = 0
    Bus.$emit('showLoading', 0)
    if (parseInt(err.response && err.response.status) === 401) {
      Bus.$emit('UnAuthorized')
    } else if (parseInt(err.response && err.response.status) === 403) {
      Bus.$emit('NoRightsToBack')
    } else {
      Bus.$emit('SystemError')
    }
    return Promise.resolve(err.response)
  },
)

/**
 * 设置Axios默认header
 * @param key
 * @param value
 */
export function SetDefaultHeader(key, value) {
  Axios.defaults.headers[key] = value
}

class Http {
  httpRequest(method, url, params) {
    let type
    if (method === 'get') {
      return new Promise((resolve, reject) => {
        Axios[method]('/whapi' + url, { params: ArrangeParams(params) })
        // Axios[method](url, { params: ArrangeParams(params) })
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
    if (method === 'delete') {
      return new Promise((resolve, reject) => {
        Axios[method]('/whapi' + url, { data: ArrangeParams(params) })
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
    switch (method) {
      case 'get':
        type = Axios.get
        break
      case 'post':
        type = Axios.post
        break
      case 'put':
        type = Axios.put
        break
      case 'delete':
        type = Axios.delete
        break
      default:
        type = Axios.get
    }
    return new Promise((resolve, reject) => {
      type('/whapi' + url, ArrangeParams(params))
      // type(url, ArrangeParams(params))
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  httpLoginRequest(method, url, params) {
    let type
    if (method === 'get') {
      return new Promise((resolve, reject) => {
        Axios.get('/bbapi' + url, { params: ArrangeParams(params) })
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
    switch (method) {
      case 'get':
        type = Axios.get
        break
      case 'post':
        type = Axios.post
        break
      case 'put':
        type = Axios.put
        break
      case 'delete':
        type = Axios.delete
        break
      default:
        type = Axios.get
    }
    return new Promise((resolve, reject) => {
      type('/bbapi' + url, ArrangeParams(params))
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  httpGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      Axios.get(url, { params: ArrangeParams(params) })
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  httpPost(url, params) {
    return new Promise((resolve, reject) => {
      Axios.post(url, ArrangeParams(params))
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  httpPut(url, params) {
    return new Promise((resolve, reject) => {
      Axios.put(url, ArrangeParams(params))
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  httpDelete(url, params) {
    return new Promise((resolve, reject) => {
      Axios.delete(url, { params: ArrangeParams(params) })
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  httpAuth(url, auth) {
    return new Promise((resolve, reject) => {
      Axios.get(url, { auth: auth })
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default new Http()

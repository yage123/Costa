import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const dev = 'http://47.100.63.155:8881/maritime'
const uat = 'https://bteuat.costachina.com/maritime'
const pro = 'https://Internalmaritime.costachina.com/maritime'
const pro2 = 'https://externalmaritime.costachina.com/maritime'
const enrl = dev
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=utf-8' // 'application/x-www-form-urlencoded'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
      config.method === 'post'
        ? (config.data = JSON.stringify({ ...config.data }))
        : (config.params = { ...config.params })
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (parseInt(res.code) !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code === 101) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 上传文件的方法
export function fileUpload(Url, data) {
  const instance = axios.create({
    // baseURL: 'http://47.100.63.155:8881/maritime',
    // baseURL: 'https://47.100.22.181/maritime',
    baseURL: enrl,
    timeout: 5000, // request timeout
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  // request interceptor
  instance.interceptors.request.use(
    config => {
      // do something before request is sent
      if (sessionStorage.getItem('token') != null) {
        config.headers['Authorization'] = sessionStorage.getItem('token')
      }
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )
  // response interceptor
  instance.interceptors.response.use(
    response => {
      const res = response
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.data.header.status === '402') {
        // this.$message.error(res.data.header.msg)
        alert(res.data.header.msg)
        sessionStorage.clear()
        window.location.href = '/cms'
      } else {
        return res
      }
    }
  )
  const ins = instance.post(Url, data)
  return ins
}
// 登录的接口
export function fLogin(data) {
  const instance = axios.create({
    baseURL: enrl,
    timeout: 5000, // request timeout
    headers: {
    }
  })
  return instance
}
// 查询的接口
export function searchPorts(data) {
  const instance = axios.create({
    baseURL: enrl,
    headers: {
    }
  })
  // request interceptor
  instance.interceptors.request.use(
    config => {
      // do something before request is sent
      if (sessionStorage.getItem('token') != null) {
        config.headers['Authorization'] = sessionStorage.getItem('token')
      }
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )
  // response interceptor
  instance.interceptors.response.use(
    response => {
      const res = response
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.data.header.status === '402') {
        // this.$message.error(res.data.header.msg)
        alert(res.data.header.msg)
        sessionStorage.clear()
        window.location.href = '/cms'
      } else {
        return res
      }
    }
  )
  return instance
}

// 下载文件接口
export function edownload(type, name) {
  const instance = axios.create({
    // baseURL: 'http://47.100.63.155:8881/maritime',
    // baseURL: 'https://47.100.22.181/maritime',
    baseURL: enrl,
    // headers里面设置token
    headers: {
    },
    data: {
      name: name,
      type: type
    },
    // 二进制流文件，一定要设置成blob，默认是json
    responseType: 'blob'
  })
  // request interceptor
  instance.interceptors.request.use(
    config => {
      // do something before request is sent
      if (sessionStorage.getItem('token') != null) {
        config.headers['Authorization'] = sessionStorage.getItem('token')
      }
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )
  // // response interceptor
  // instance.interceptors.response.use(
  //   response => {
  //     const res = response
  //     // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
  //     if (res.data.header.status === '402') {
  //       // this.$message.error(res.data.header.msg)
  //       alert(res.data.header.msg)
  //       sessionStorage.clear()
  //       window.location.href = '/login'
  //     } else {
  //       return res
  //     }
  //   }
  // )
  instance.get('/api/file/getDemo').then(res => {
    const link = document.createElement('a')
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `港口信息上传模板.xlsm`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

// 下载distance文件接口
export function distanceDownload() {
  const instance = axios.create({
    baseURL: enrl,
    // headers里面设置token
    headers: {
    },
    // 二进制流文件，一定要设置成blob，默认是json
    responseType: 'blob'
  })
  // request interceptor
  instance.interceptors.request.use(
    config => {
      // do something before request is sent
      if (sessionStorage.getItem('token') != null) {
        config.headers['Authorization'] = sessionStorage.getItem('token')
      }
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )
  instance.get('/api/file/getDistanceExcel').then(res => {
    const link = document.createElement('a')
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `distance.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

export default service

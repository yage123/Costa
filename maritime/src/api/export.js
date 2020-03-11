import axios from 'axios'

export function edownload(type, name) {
  const instance = axios.create({
    // baseURL: 'http://47.100.63.155:8881/maritime',
    // baseURL: 'https://47.100.22.181/maritime',
    baseURL: dev,
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
        console.log(sessionStorage.getItem('token'))
        config.headers['Authorization'] = sessionStorage.getItem('token')
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )
  // response interceptor
  instance.interceptors.response.use(
    response => {
      const res = response
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.data.code === 402) {
        this.$message.error(res.data.header.msg)
        sessionStorage.clear()
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      } else {
        return res
      }
    }
  )
  instance.get('/api/file/getDemo').then(res => {
    const link = document.createElement('a')
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `港口信息上传模板.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

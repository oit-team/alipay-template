import Axios from 'luch-request'
import ApiError from './api-error'
import store from '@/store'
import { soapXML, transformObject } from '@/utils/soap'

// 创建接口错误封装对象
function createApiError(option) {
  return new ApiError(option).reject()
}

const axiosInstance = new Axios({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 60000,
  header: {
    'content-type': 'text/xml;charset=utf-8',
  },
})

// 添加请求拦截器
axiosInstance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return createApiError({ error })
})

// 添加响应拦截器
axiosInstance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  return createApiError({
    error,
    url: error?.config?.url,
    message: error?.errMsg,
  })
})

/**
 * post请求封装
 * @param {string} url 接口地址
 * @param {object} data 参数
 * @param {object} config 请求配置
 */
export function post(method, data = {}, config = {}) {
  const userInfo = store.state.userInfo

  const wrapData = soapXML({
    method,
    body: transformObject(data),
  })

  return axiosInstance
    .post('/ajax/WebService2.asmx', wrapData, config)
    .then(res => res.data)
}

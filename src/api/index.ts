import Axios from 'axios'
import { ElMessage } from 'element-plus'
import ApiError from './ApiError'
import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios'
import type { ApiErrorOptions } from './ApiError'
import { getToken } from '@/utils/auth'
import router from '@/router'
import { useUserStore } from '@/store/user'

function createApiError(options: ApiErrorOptions) {
  return new ApiError(options).reject()
}

Axios.defaults.baseURL = '/api'
axios.defaults.method = 'post'
Axios.defaults.headers.post['Content-Type'] = 'application/json'

export const defaultTransformRequest = (Axios.defaults.transformRequest as AxiosRequestTransformer[])[0]
export const defaultTransformResponse = (Axios.defaults.transformResponse as AxiosResponseTransformer[])[0]

export const transformRequest: AxiosRequestTransformer = (data, headers) => {
  const { profile } = useUserStore()

  return (typeof data === 'object' || data === undefined) && headers['Content-Type'] === 'application/json'
    ? JSON.stringify({
      head: {
        aid: profile?.userId,
        cmd: headers.cmd,
        uuid: profile?.orgId,
      },
      con: data ?? {},
    })
    : data
}

export const transformResponse: AxiosResponseTransformer = (data, headers) => {
  return (
    headers['content-type'] === 'application/json'
    && data instanceof Object
    && (data.head || data.body)
      ? data.body
      : data
  )
}

if (Array.isArray(Axios.defaults.transformRequest))
  Axios.defaults.transformRequest.unshift(transformRequest)

if (Array.isArray(Axios.defaults.transformResponse))
  Axios.defaults.transformResponse.push(transformResponse)

// 添加请求拦截器
Axios.interceptors.request.use((config) => {
  config.headers.token = getToken()
  return config
}, (error) => {
  return createApiError({ error })
})

// 添加响应拦截器
Axios.interceptors.response.use((response) => {
  if (response.headers['content-type'] === 'application/json') {
    const rawResponse = JSON.parse(response.request.response)
    const status = rawResponse?.head?.status
    if (typeof status === 'number' && status !== 0) {
      return createApiError({
        url: response?.config.url,
        response,
        message: rawResponse.head.msg,
        code: rawResponse.head.status,
        status: response?.status,
      })
    }
  }
  return response
}, async (error) => {
  return Axios.isCancel(error)
    ? Promise.reject(error)
    : createApiError({
      error,
      url: error?.config?.url,
      message: error?.message,
      status: error.response?.status,
    })
})

const SILENCE_TIME = 1000
let lastMessage = ''

function handleApiError(err: ApiError) {
  const msg = err.message || '服务器出错，请稍后重试'
  // 相同错误在指定时间内只弹出一次
  if (lastMessage === msg)
    return

  switch (err.status) {
    case 403:{
      router.push('/login')
    }
  }

  lastMessage = msg
  setTimeout(() => lastMessage = '', SILENCE_TIME)
  // 处理接口错误
  ElMessage.error(msg)
}

window.addEventListener('unhandledrejection', (e) => {
  const reason = e.reason
  if (reason instanceof ApiError) {
    e.preventDefault()
    handleApiError(reason)
  }
})

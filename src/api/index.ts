import Axios from 'axios'
import { ElMessage } from 'element-plus'
import ApiError from './ApiError'
import type { AxiosRequestTransformer } from 'axios'
import type { ApiErrorOptions } from './ApiError'
import { getToken } from '@/utils/auth'
import router from '@/router'
import { useUserStore } from '@/store/user'

function createApiError(options: ApiErrorOptions) {
  return new ApiError(options).reject()
}

Axios.defaults.baseURL = '/api'
Axios.defaults.headers.post['Content-Type'] = 'application/json'

const transformRequest: AxiosRequestTransformer = (data, headers) => {
  const { profile } = useUserStore()

  return typeof data === 'object' && headers['Content-Type'] === 'application/json'
    ? JSON.stringify({
      head: {
        aid: profile?.userId,
        ver: '1.0',
        ln: 'cn',
        mod: 'app',
        de: '2019-10-16',
        sync: 1,
        cmd: headers.cmd,
        uuid: profile?.orgId,
        chcode: 'ef19843298ae8f2134f',
      },
      con: data,
    })
    : data
}

if (Array.isArray(Axios.defaults.transformRequest))
  Axios.defaults.transformRequest.unshift(transformRequest)

// 添加请求拦截器
Axios.interceptors.request.use((config) => {
  config.headers.token = getToken()
  return config
}, (error) => {
  return createApiError({ error })
})

// 添加响应拦截器
Axios.interceptors.response.use((response) => {
  const status = response.data?.head?.status
  if (typeof status === 'number' && status !== 0) {
    return createApiError({
      url: response?.config.url,
      response,
      message: response.data.head.msg,
      code: response.data.head.status,
      status: response?.status,
    })
  }
  return response
}, async (error) => {
  return createApiError({
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
  if (lastMessage === msg) {
    setTimeout(() => lastMessage = '', SILENCE_TIME)
    return
  }

  switch (err.status) {
    case 403:{
      router.push('/login')
    }
  }

  lastMessage = msg
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

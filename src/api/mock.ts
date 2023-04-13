import mockList from './mock-list'
import type { Axios } from 'axios'

export function installMockService(axios: Axios) {
  axios.interceptors.request.use((config) => {
    if (mockList.includes(config.url as string))
      config.baseURL = '/mock'

    return config
  })
}

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import routes from 'virtual:generated-pages'
import axios from 'axios'
import { createPinia } from 'pinia'
import { ElMessage } from 'element-plus'
import App from './App.vue'
import ApiError from './api/ApiError'
import { getToken } from '@/utils/auth'
import '@/plugins/formily'

import '@uxuip/element-plus-query/dist/style.css'
import '@unocss/reset/tailwind.css'
import './styles/index.scss'
import 'uno.css'

axios.defaults.baseURL = '/api'
axios.defaults.headers.Authorization = getToken()

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})
const pinia = createPinia()

router.beforeEach(async (to, from, next) => {
  next()
})

window.addEventListener('unhandledrejection', (e) => {
  const reason = e.reason
  if (reason instanceof ApiError) {
    // 处理接口错误
    ElMessage.error(reason.message)
  }
})

app.use(pinia)
app.use(router)
app.mount('#app')

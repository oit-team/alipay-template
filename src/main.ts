import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import elementPlusQuery from '@uxuip/element-plus-query'
import App from './App.vue'
import router from '@/router'
import cn from '@/locales/zh-CN.json'

import '@/api'
import '@/plugins/formily'

import '@uxuip/element-plus-query/dist/style.css'
import '@unocss/reset/tailwind.css'
import './styles/index.scss'
import 'uno.css'
import 'animate.css'

const app = createApp(App)
const pinia = createPinia()
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': cn,
  },
})

app.use(pinia)
app.use(router)
app.use(elementPlusQuery)
app.use(i18n)
app.mount('#app')

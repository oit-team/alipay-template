import { createApp } from 'vue'
import { createPinia } from 'pinia'
import elementPlusQuery from '@uxuip/element-plus-query'
import App from './App.vue'
import { i18n } from '@/plugins/i18n'
import router from '@/router'

import '@/api'
import '@/plugins/formily'

import '@uxuip/element-plus-query/dist/style.css'
import '@unocss/reset/tailwind.css'
import './styles/index.scss'
import 'uno.css'
import 'animate.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(elementPlusQuery)
app.use(i18n)
app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import App from './App.vue'
import { i18n } from '@/plugins/i18n'
import router from '@/router'
import { vPermission } from '@/directives/permission'

import '@/api'
import '@/plugins/formily'

import '@uxuip/element-plus-query/dist/style.css'
import '@unocss/reset/tailwind.css'
import './styles/index.scss'
import 'uno.css'
import 'animate.css'

dayjs.extend(isBetween)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.directive('permission', vPermission)
app.mount('#app')

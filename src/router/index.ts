import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  next()
})

export default router

import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { clearToken, isLogin } from '@/utils/auth'
import { useUserStore } from '@/store/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.noAuth) {
    const { getUserProfile } = useUserStore()
    try {
      if (!isLogin()) {
        next('/login')
        return
      }
      await getUserProfile()
    }
    catch (err) {
      clearToken()
      next('/login')
      return Promise.reject(err)
    }
  }

  next()
})

export default router

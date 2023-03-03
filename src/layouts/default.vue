<script lang="ts" setup>
const router = useRouter()

interface MenuItem {
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

const menu: MenuItem[] = [
  {
    title: '系统设置',
    icon: 'i-ant-design:setting-outlined',
    children: [
      {
        title: '角色管理',
        path: '/system/role',
      },
      {
        title: '综合管理',
        path: '/',
      },
      {
        title: '区域管理',
        path: '/',
      },
    ],
  },
  {
    title: '租赁管理',
    icon: 'i-ri:money-cny-circle-line',
    children: [
      {
        title: '司机管理',
        path: '/lease/driver',
      },
      {
        title: '车辆管理',
        path: '/lease/car',
      },
      {
        title: '租车管理',
        path: '/',
      },
      {
        title: '退租管理',
        path: '/',
      },
    ],
  },
]

function logout() {
  localStorage.clear()
  sessionStorage.clear()
  router.push('/login')
}
</script>

<template>
  <ElContainer class="h-full">
    <ElHeader class="flex items-center justify-between border-b dark:border-dark gap-3">
      <div class="flex items-center gap-3">
        <ElAvatar src="" :size="40" />
        <div class="font-bold text-lg">
          汽车租赁管理系统
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="toggleDark()">
          <div class="dark:i-carbon-moon i-carbon-sun" />
        </button>
        <ElButton link @click="logout()">
          退出登录
        </ElButton>
      </div>
    </ElHeader>

    <ElContainer>
      <ElAside width="200px">
        <ElScrollbar class="border-r dark:border-dark">
          <ElMenu class="border-none" router>
            <ElSubMenu v-for="(item, index) of menu" :key="index" :index="`${index}`">
              <template #title>
                <div class="flex items-center gap-2">
                  <div :class="item.icon" class="text-lg" />{{ item.title }}
                </div>
              </template>
              <ElMenuItem
                v-for="(child, childIndex) of item.children"
                :key="`${index}-${childIndex}`"
                :index="child.path"
              >
                {{ child.title }}
              </ElMenuItem>
            </ElSubMenu>
          </ElMenu>
        </ElScrollbar>
      </ElAside>

      <ElMain class="p-0">
        <ElScrollbar view-class="h-full p-2">
          <RouterView v-slot="{ Component, route }">
            <KeepAlive>
              <Component :is="Component" v-if="route.meta.cache" :key="route.path" class="router-view" />
            </KeepAlive>
            <Component :is="Component" v-if="!route.meta.cache" class="router-view" />
          </RouterView>
        </ElScrollbar>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss">
.el-main {
  background-color: whitesmoke;
}

.router-view {
  background-color: white;
  min-height: 100%;
  border-radius: 8px;
  overflow: auto;
  padding: 8px;
}
</style>

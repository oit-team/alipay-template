<script lang="ts" setup>
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

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
        path: '/',
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
        path: '/',
      },
      {
        title: '车辆管理',
        path: '/',
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
</script>

<template>
  <ElContainer class="h-full">
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

    <ElContainer>
      <ElHeader class="flex items-center justify-between border-b dark:border-dark gap-3">
        <div>
          <ElButton :icon="ArrowLeftBold" text @click="$router.back()" />
          <ElButton :icon="ArrowRightBold" text @click="$router.forward()" />
        </div>
        <div class="flex items-center gap-2">
          <button @click="toggleDark()">
            <div class="dark:i-carbon-moon i-carbon-sun" />
          </button>
          <ElButton link>
            退出登录
          </ElButton>
        </div>
      </ElHeader>

      <ElMain class="p-0">
        <ElScrollbar view-class="h-full p-3">
          <KeepAlive>
            <RouterView v-if="$route.meta.cache" />
          </KeepAlive>
          <RouterView v-if="!$route.meta.cache" />
        </ElScrollbar>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

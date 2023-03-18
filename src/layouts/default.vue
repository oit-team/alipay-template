<script lang="ts" setup>
const router = useRouter()

interface MenuItem {
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

const treeList = ref([])

async function getTreeList() {
  const { data } = await axios.post('/system/menu/getTreeMenuList', {
    userId: '0',
  })
  treeList.value = data.body.resultList
}
getTreeList()
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
        path: '/system/area',
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
        title: '方案管理',
        path: '/lease/scheme',
      },
      {
        title: '订单管理',
        path: '/lease/order',
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
  {
    title: '流水管理',
    icon: 'i-ri:money-cny-circle-line',
    children: [{
      title: '运营流水',
      path: '/statement',
    }],
  },
  {
    title: '活动管理',
    icon: 'i-ri:money-cny-circle-line',
    children: [{
      title: '活动列表',
      path: '/activity/list',
    }, {
      title: '活动规则',
      path: '/activity/rules',
    }],
  },
]

function logout() {
  localStorage.clear()
  sessionStorage.clear()
  router.push('/login')
}
</script>

<template>
  <ElContainer class="h-full overflow-hidden">
    <ElHeader class="flex items-center justify-between border-b gap-3">
      <div class="flex items-center gap-3">
        <ElAvatar :size="40" src="" />
        <div class="font-bold text-lg">
          汽车租赁管理系统
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ElButton link @click="logout()">
          退出登录
        </ElButton>
      </div>
    </ElHeader>

    <ElContainer class="overflow-hidden">
      <ElAside width="200px">
        <ElScrollbar class="border-r">
          <ElMenu class="border-none" router unique-opened>
            <ElSubMenu
              v-for="(item, index) of menu"
              :key="index"
              :index="`${index}`"
            >
              <template #title>
                <div class="flex items-center gap-2">
                  <div class="text-lg" :class="item.icon" />
                  {{ item.title }}
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

      <ElMain class="p-2 bg-gray bg-opacity-10">
        <div class="rounded-lg overflow-hidden flex flex-col h-full">
          <div id="page-header" />
          <div class="bg-white flex-1 overflow-hidden">
            <ElScrollbar>
              <RouterView v-slot="{ Component, route }">
                <KeepAlive>
                  <Component
                    :is="Component"
                    :key="route.path"
                    v-if="route.meta.cache"
                    class="router-view"
                  />
                </KeepAlive>
                <Component
                  :is="Component"
                  v-if="!route.meta.cache"
                  class="router-view"
                />
              </RouterView>
            </ElScrollbar>
          </div>
        </div>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

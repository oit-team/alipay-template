<script lang="ts" setup>
import ChangePassWord from '@/components/ChangePassWord.vue'
import { useUserStore } from '@/store/user'

const { profile } = useUserStore()
const router = useRouter()

const drawer = ref()

interface MenuItem {
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

const { data } = useAxios('/system/menu/getTreeMenuList')

function formatMenu(data: any[]): MenuItem[] {
  return data?.map((item) => {
    return {
      title: item.menuName,
      icon: item.menuImg,
      path: item.menuUrl,
      children: formatMenu(item.childrenMenu),
    }
  })
}

const menu = computed<MenuItem[]>(() => {
  return formatMenu(data.value?.resultList)
})

async function logout() {
  await ElMessageBox.confirm('确定退出登录吗', '提示')
  localStorage.clear()
  sessionStorage.clear()
  router.push('/login')
}

function openCgPw() {
  drawer.value.open()
}
</script>

<template>
  <ElContainer class="h-full overflow-hidden">
    <ElHeader class="flex items-center justify-between border-b gap-3">
      <div class="flex items-center gap-3">
        <ElAvatar class="bg-white" :size="24" src="/image/logo.jpg" />
        <div class="font-bold text-lg">
          汽车租赁管理系统
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ElDropdown v-if="profile?.userName">
          <div class="el-dropdown-link flex items-center">
            <ElAvatar class="mr-2" :size="40" src="/image/userAvatar.png" />
            {{ profile.userName }}
          </div>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="openCgPw">
                修改密码
              </ElDropdownItem>
              <ElDropdownItem @click="logout()">
                退出登录
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <div v-else @click="$router.push('./login')">
          去登录
        </div>
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

    <ChangePassWord ref="drawer" />
  </ElContainer>
</template>

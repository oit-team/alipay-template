<script setup lang="ts">
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import type { ConfigProviderInstance } from 'element-plus'

const config: ConfigProviderInstance['$props'] = {
  button: {
    autoInsertSpace: true,
  },
  locale: zhCn,
}
</script>

<template>
  <ElConfigProvider v-bind="config">
    <RouterView />
  </ElConfigProvider>
</template>

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

<style lang="scss">
.query-provide {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  gap: 12px;

  .el-date-editor {
    --el-date-editor-width: auto;
    --el-date-editor-monthrange-width: auto;
    --el-date-editor-daterange-width: auto;
    --el-date-editor-datetimerange-width: auto;
  }

  .formily-element-plus-form-item-feedback-layout-loose {
    margin-bottom: 12px;
  }
}
</style>

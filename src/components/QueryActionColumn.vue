<script setup lang="ts">
import { ElTableColumn } from 'element-plus'
import type { ConfigProviderInstance } from 'element-plus'

defineProps<{
  label?: string
  width?: string
  fixed?: boolean | 'left' | 'right'
}>()

const config: ConfigProviderInstance['$props'] = {
  size: 'small',
  button: {
    autoInsertSpace: false,
  },
}
</script>

<template>
  <ElTableColumn label="操作" v-bind="$attrs">
    <ElConfigProvider v-bind="config">
      <div class="query-action-column">
        <slot />
      </div>
    </ElConfigProvider>
  </ElTableColumn>
</template>

<style lang="scss">
.query-action-column {
  .el-button+.el-button {
    margin-left: 6px;
  }
}
</style>

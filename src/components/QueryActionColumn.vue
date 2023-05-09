<script setup lang="ts">
import { ElTableColumn } from 'element-plus'
import type { ConfigProviderInstance } from 'element-plus'

defineProps({
  label: {
    type: String,
    default: '操作',
  },
  width: [String, Number],
  fixed: {
    type: [Boolean, String] as PropType<boolean | 'left' | 'right'>,
    default: 'right',
  },
})

const config: ConfigProviderInstance['$props'] = {
  size: 'small',
  button: {
    autoInsertSpace: false,
  },
}
</script>

<template>
  <ElTableColumn
    v-bind="{
      ...$attrs,
      ...$props,
    }"
  >
    <template #default="data">
      <ElConfigProvider v-bind="config">
        <div class="query-action-column">
          <slot v-bind="data" />
        </div>
      </ElConfigProvider>
    </template>
  </ElTableColumn>
</template>

<style lang="scss">
.query-action-column {
  display: flex;
  gap: 6px;
  align-items: center;

  .el-button+.el-button {
    margin-left: 0;
  }
}
</style>

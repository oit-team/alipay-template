<script setup lang="ts">
import type { ConfigProviderInstance } from 'element-plus'

const config: ConfigProviderInstance['$props'] = {
  button: {
    autoInsertSpace: true,
  },
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
}

.formily-element-plus-form-item-feedback-layout-loose {
  margin-bottom: 12px;
}
</style>

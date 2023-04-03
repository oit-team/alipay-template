<route lang="yaml">
meta:
  cache: true
    </route>

<script setup lang="ts">
import SelfSupport from './Self-support.vue'
import T3 from './T3.vue'

const activeName = ref('self-support')
</script>

<template>
  <ElTabs v-model="activeName" class="demo-tabs h-full" type="border-card">
    <ElTabPane label="自营" lazy name="self-support">
      <SelfSupport />
    </ElTabPane>
    <ElTabPane label="T3" lazy name="T3">
      <T3 />
    </ElTabPane>
  </ElTabs>
</template>


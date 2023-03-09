<script setup lang="ts">
import BaseInfo from './components/BaseInfo.vue'
import ExtraInfo from './components/ExtraInfo.vue'
</script>

<template>
  <div u-h-full>
    <PageHeader title="司机详情" />
    <ElTabs type="border-card" u-h-full u-rounded-b-lg>
      <ElTabPane label="基本信息">
        <BaseInfo />
      </ElTabPane>
      <ElTabPane label="补充信息">
        <ExtraInfo />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

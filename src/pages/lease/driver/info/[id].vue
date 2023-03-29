<script setup lang="ts">
import BaseInfo from './components/BaseInfo.vue'
import ExtraInfo from './components/ExtraInfo.vue'
import LeaseOrder from './components/LeaseOrder.vue'
import Operating from './components/Operating.vue'
</script>

<template>
  <div u-h-full>
    <PageHeader title="司机详情" />
    <ElTabs type="border-card" u-h-full u-rounded-b-lg>
      <ElTabPane label="基本信息">
        <BaseInfo />
      </ElTabPane>
      <ElTabPane label="运营补充">
        <ExtraInfo />
      </ElTabPane>
      <ElTabPane label="运营流水">
        <Operating />
      </ElTabPane>
      <ElTabPane label="租赁订单">
        <LeaseOrder />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

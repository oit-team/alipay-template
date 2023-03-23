<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import SelfSupport from './components/SelfSupport.vue'
import Tthree from './components/Tthree.vue'

const activeName = ref('first')
</script>

<template>
  <div class="h-full p-2">
    <ElTabs v-model="activeName" class="demo-tabs h-full" type="card">
      <ElTabPane label="自营" name="first">
        <SelfSupport />
      </ElTabPane>
      <ElTabPane label="T3" lazy name="second">
        <Tthree />
      </ElTabPane>
    </ElTabs>
  </div>
</template>


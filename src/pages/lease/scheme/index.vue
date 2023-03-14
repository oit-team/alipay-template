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
    <ElTabs v-model="activeName" type="card" class="demo-tabs h-full">
      <ElTabPane label="T3" name="first">
        <Tthree />
      </ElTabPane>
      <ElTabPane label="自营" name="second">
        <SelfSupport />
      </ElTabPane>
    </ElTabs>
  </div>
</template>


<script setup lang="ts">
import { workOrderInfoSymbol } from '../types'

const showLogs = ref(false)
const workOrderInfo = inject(workOrderInfoSymbol)
</script>

<template>
  <div v-if="workOrderInfo?.currentLogs?.[0]" class="p-2" v-bind="$attrs">
    <ElCard>
      <div class="flex items-center p-2">
        <div class="truncate flex-1">
          {{ workOrderInfo?.currentLogs[0] }}
        </div>
        <ElButton @click="showLogs = true">
          查看全部
        </ElButton>
      </div>
    </ElCard>
  </div>
  <ElDrawer v-model="showLogs" title="操作日志">
    <div class="p-2 flex flex-col gap-2">
      <ElCard v-for="(item, index) of workOrderInfo?.currentLogs" :key="index" class="p-2">
        {{ item }}
      </ElCard>
    </div>
  </ElDrawer>
</template>

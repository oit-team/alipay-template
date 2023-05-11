<script setup lang="ts">
import { useFlowOption } from '../hooks/useFlowOption'

const showLogs = ref(false)
const flowOption = useFlowOption()
</script>

<template>
  <div v-if="flowOption?.currentLogs?.[0]" class="p-2" v-bind="$attrs">
    <ElCard>
      <div class="flex items-center justify-between p-2">
        <div class="flex gap-10">
          <span>确认人：{{ flowOption?.currentStep.handleUser }}</span>
          <span>确认时间：{{ flowOption?.currentStep.handleTime }}</span>
        </div>
        <ElButton @click="showLogs = true">
          查看全部
        </ElButton>
      </div>
    </ElCard>
  </div>
  <ElDrawer v-model="showLogs" title="操作日志">
    <div class="p-2 flex flex-col gap-2">
      <ElCard v-for="(item, index) of flowOption?.currentLogs" :key="index" class="p-2">
        {{ item }}
      </ElCard>
    </div>
  </ElDrawer>
</template>

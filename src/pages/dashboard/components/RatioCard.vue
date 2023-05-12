<script setup lang="ts">
import DataItem from './DataItem.vue'

interface Props {
  header: string
}

defineProps<Props>()
</script>

<template>
  <ElCard
    :header="header"
    shadow="hover"
    style="--el-card-padding: 8px"
  >
    <DataItem v-bind="$attrs" class="h-130px" />
  </ElCard>
</template>

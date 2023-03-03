<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
defineProps<{
  title: string
  onBack?: () => void
}>()
</script>

<template>
  <ElPageHeader
    class="pl-1"
    :icon="ArrowLeft"
    @back="onBack ? onBack() : $router.back()"
  >
    <template #content>
      <span class="text-lg">{{ title }}</span>
    </template>
    <template #extra>
      <slot name="extra" />
    </template>
  </ElPageHeader>
</template>

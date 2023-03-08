<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
defineProps<{
  title: string
  onBack?: () => void
}>()

const teleport = ref(false)

onMounted(() => {
  teleport.value = true
})
</script>

<template>
  <Teleport v-if="teleport" to="#page-header">
    <ElPageHeader
      class="p-2 sticky top-0 z-10 bg-white"
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
  </Teleport>
</template>

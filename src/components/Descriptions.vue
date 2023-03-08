<script setup lang="ts">
interface MapItem {
  prop: string
  label: string
  default?: string
  type?: 'text'
}

defineProps({
  data: {
    type: Object,
    required: true,
  },
  map: {
    type: Array as PropType<MapItem[]>,
    required: true,
  },
  defaultText: String,
})
</script>

<template>
  <ElDescriptions v-bind="$attrs">
    <ElDescriptionsItem v-for="item of map" :key="item.prop" :label="item.label">
      {{ data?.[item.prop] ?? item?.default ?? defaultText }}
    </ElDescriptionsItem>
  </ElDescriptions>
</template>

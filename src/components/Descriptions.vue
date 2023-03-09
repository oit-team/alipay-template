<script setup lang="ts">
interface MapItem {
  prop: string
  label: string
  default?: string
}

defineProps({
  data: Object,
  map: Array as PropType<MapItem[]>,
  defaultText: String,
})
</script>

<template>
  <ElDescriptions v-if="data" v-bind="$attrs">
    <ElDescriptionsItem v-for="item of map" :key="item.prop" v-bind="item">
      <slot :name="item.prop" v-bind="{ value: data[item.prop] }">
        {{ data[item.prop] ?? item?.default ?? defaultText }}
      </slot>
    </ElDescriptionsItem>
  </ElDescriptions>
</template>

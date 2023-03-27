<script setup lang="ts">
interface OptionItem {
  prop: string
  label: string
  span?: number
  default?: any
  [key: string]: any
}

defineProps({
  data: Object,
  options: Array as PropType<OptionItem[]>,
  labelWidth: {
    type: [Number, String],
    default: '120px',
  },
  itemWidth: {
    type: [Number, String],
    default: '120px',
  },
  defaultText: String,
})
</script>

<template>
  <ElDescriptions
    v-if="data"
    v-bind="$attrs"
    :style="{ '--el-descriptions-label-width': labelWidth }"
  >
    <ElDescriptionsItem v-for="item of options" :key="item.prop" v-bind="item" :width="itemWidth">
      <slot :name="item.prop" v-bind="{ value: data[item.prop] }">
        <!-- {{ data[item.prop] ?? item?.default ?? defaultText }} -->
        {{ data[item.prop] }}
      </slot>
    </ElDescriptionsItem>
  </ElDescriptions>
</template>

<style>
.el-descriptions__label {
  width: var(--el-descriptions-label-width);
}
</style>

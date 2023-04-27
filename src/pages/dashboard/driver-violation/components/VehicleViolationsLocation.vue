<script setup lang="ts">
defineProps({
  data: Array,
})

const columns = [
  {
    type: 'index',
  },
  {
    prop: 'violationAddress',
    label: '违章地点',
  },
  {
    prop: 'illegalBehavior',
    label: '违章行为',
  },
  {
    prop: 'countNum',
    label: '违章次数',
    width: 100,
  },
]
</script>

<template>
  <div>
    <QueryTable :columns="columns" :data="data" :height="400" />
  </div>
</template>

  <style lang="scss" scoped>

  </style>

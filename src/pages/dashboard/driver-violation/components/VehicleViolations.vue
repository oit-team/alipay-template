<script setup lang="ts">
defineProps({
  data: Array,
})

const columns = [
  {
    type: 'index',
  },
  {
    prop: 'illegalBehavior',
    label: '违法行为',
  },
  {
    prop: 'countNum',
    label: '违法次数',
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

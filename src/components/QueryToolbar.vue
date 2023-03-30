<script setup lang="ts">
import { ElDivider } from 'element-plus'

const spacer = h(ElDivider, { direction: 'vertical' })
</script>

<template>
  <ElSpace class="query-toolbar" :size="3" :spacer="spacer">
    <slot />
  </ElSpace>
</template>

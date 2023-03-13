<script setup lang="ts">
import Step1 from './components/step-1/index.vue'

const state = reactive({
  step: 1,
})

const view = computed(() => [Step1][state.step - 1])
</script>

<template>
  <Component :is="view" />
</template>

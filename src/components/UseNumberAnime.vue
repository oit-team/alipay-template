<script setup lang="ts">
import { useNumberAnime } from '@/composables/useNumberAnime'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  immediate: {
    type: Boolean,
    default: true,
  },
  duration: Number,
})

const { value: showNumber } = useNumberAnime(
  toRef(props, 'value'),
  {
    immediate: props.immediate,
    duration: props.duration,
  },
)
</script>

<template>
  <slot v-bind="{ value: showNumber }">
    {{ showNumber }}
  </slot>
</template>

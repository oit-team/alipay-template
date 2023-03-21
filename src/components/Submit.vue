<script setup lang="ts">
import { Submit } from '@formily/element-plus'
import { handleSubmitFailed } from '@/utils/actions'

const props = defineProps<{
  onSubmit?: (...args: any[]) => void
  onSubmitSuccess?: any
  onSubmitFailed?: any
  messageMode?: 'single' | 'count' | 'all'
}>()

function onSubmitFailed(err: any) {
  props.onSubmitFailed
    ? props.onSubmitFailed(err)
    : handleSubmitFailed(err, {
      mode: props.messageMode,
    })
}

function onSubmit(...args: []) {
  props.onSubmit?.(...args)
}
</script>

<template>
  <Submit
    v-bind="$attrs"
    @submit="onSubmit"
    @submit-failed="onSubmitFailed"
    @submit-success="onSubmitSuccess"
  >
    <slot>
      {{ $t('button.submit') }}
    </slot>
  </Submit>
</template>

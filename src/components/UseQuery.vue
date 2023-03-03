<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { PropType } from 'vue'
import type { QueryOptions } from '@uxuip/element-plus-query'

const props = defineProps({
  form: String,
  column: String,
  url: String,
  keyMap: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({
      total: 'count',
      data: 'resultList',
    }),
  },
})

const total = ref(0)
const data = ref([])

const {
  data: columns,
  isLoading: tableLoading,
} = useJsonData(props.column)

const {
  data: schema,
  isLoading: formLoading,
} = useJsonData(props.form)

async function onQuery(options: QueryOptions) {
  if (!props.url)
    return ElMessage.warning('onQuery 未配置 url 参数')

  const { formData } = options
  const { data: res } = await useAxios(props.url, {
    method: 'POST',
    data: formData,
  })
  data.value = res.value?.body[props.keyMap.data]
  total.value = res.value?.body[props.keyMap.total]
}
</script>

<template>
  <slot
    v-bind="{
      ...$attrs,
      columns,
      tableLoading,
      schema,
      formLoading,
      total,
      onQuery,
      data,
    }"
  />
</template>

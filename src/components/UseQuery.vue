<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { ISchema } from '@formily/vue'
import type { PropType } from 'vue'
import type { QueryOptions, TableColumn } from '@uxuip/element-plus-query'
import { mergeColumns } from '@/utils/helper'

const props = defineProps({
  form: String,
  column: String,
  url: String,
  data: Object,
  schema: Object as PropType<ISchema>,
  schemaKey: String,
  columns: Array as PropType<TableColumn[]>,
  columnsKey: String,
  keyMap: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({
      total: 'count',
      data: 'resultList',
    }),
  },
  columnsConfig: Object as PropType<Record<string, Omit<TableColumn, 'prop'>>>,
  showOverflowTooltip: {
    type: Boolean,
    default: true,
  },
})

const total = ref(0)
const data = ref([])

const {
  data: schemaForQuery,
  isLoading: formLoading,
} = useJsonData(props.form ?? props.schemaKey)

const {
  data: columnsForQuery,
  isLoading: tableLoading,
} = useJsonData(props.column ?? props.columnsKey)

async function onQuery(options: QueryOptions) {
  if (!props.url)
    return ElMessage.warning('onQuery 未配置 url 参数')

  await nextTick()
  const { formData } = options
  const { data: res } = await axios.post(props.url, {
    ...formData,
    ...props.data,
  })
  data.value = res?.[props.keyMap.data]
  total.value = res?.[props.keyMap.total]
}

const columnsMerged = computed(() => {
  const columns = props.columns ?? columnsForQuery.value
  const merged = props.columnsConfig
    ? mergeColumns(columns, props.columnsConfig)
    : columns
  return merged?.map((item: any) => ({
    ...item,
    showOverflowTooltip: props.showOverflowTooltip,
  }))
})
</script>

<template>
  <slot
    v-bind="{
      ...$attrs,
      columns: columnsMerged,
      tableLoading,
      schema: schema ?? schemaForQuery,
      formLoading,
      total,
      onQuery,
      data,
    }"
  />
</template>

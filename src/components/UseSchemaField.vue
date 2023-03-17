<script setup lang="ts">
import { createSchemaField } from '@formily/vue'
import {
  ArrayTable,
  Cascader,
  Checkbox,
  DatePicker,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  InputNumber,
  Password,
  Radio,
  Select,
  Switch,
  TimePicker,
  Transfer,
} from '@formily/element-plus'
import { ElCard } from 'element-plus'
import type { ISchema, SchemaVueComponents } from '@formily/vue'
import { useAsyncDataSource, useSelectAsyncDataSource } from '@/reactions'
import FUpload from '@/components/FUpload'

const props = defineProps<{
  components?: SchemaVueComponents
  scope?: any
  schema: ISchema
}>()

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    Password,
    PreviewText,
    Cascader,
    Checkbox,
    DatePicker,
    FormGrid,
    FormLayout,
    InputNumber,
    Radio,
    Select,
    Switch,
    TimePicker,
    Transfer,
    Upload: FUpload,
    FormCollapse,
    Card: ElCard,
    ArrayTable,
    ...props.components,
  },
  scope: {
    useAsyncDataSource,
    useSelectAsyncDataSource,
    ...props.scope,
  },
})
</script>

<template>
  <SchemaField :schema="schema" />
</template>

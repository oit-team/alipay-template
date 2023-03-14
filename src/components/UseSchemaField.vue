<script setup lang="ts">
import { createSchemaField } from '@formily/vue'
import {
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
  Upload,
} from '@formily/element-plus'
import { ElCard } from 'element-plus'
import type { Field } from '@formily/core'
import type { ISchema, SchemaVueComponents } from '@formily/vue'

const props = defineProps<{
  components?: SchemaVueComponents
  scope?: any
  schema: ISchema
}>()

function useAsyncDataSource(service: (field: Field) => any) {
  return async (field: Field) => {
    try {
      field.loading = true
      const data = await service(field)
      field.dataSource = data
    }
    finally {
      field.loading = false
    }
  }
}

function useSelectAsyncDataSource(service: (data: { field: Field; keyword: string }) => any) {
  return (field: Field) => {
    field.setComponentProps({
      remoteMethod: async (keyword: string) => {
        try {
          field.loading = true
          const data = await service({ field, keyword })
          field.dataSource = data
        }
        finally {
          field.loading = false
        }
      },
    })
  }
}

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    Password,
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
    Upload,
    FormCollapse,
    Card: ElCard,
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

<script setup lang="ts">
import { createSchemaField } from '@formily/vue'
import {
  Cascader,
  Checkbox,
  DatePicker,
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
import type { ISchema, SchemaVueComponents } from '@formily/vue'

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
    ...props.components,
  },
  scope: props.scope,
})
</script>

<template>
  <SchemaField :schema="schema" />
</template>

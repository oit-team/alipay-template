<script setup lang="ts">
import { Input, Checkbox as _Checkbox } from '@formily/element-plus'
import { ObjectField, connect, mapProps } from '@formily/vue'
import { workOrderInfoSymbol } from '@/pages/process/types'

defineProps({
  fieldName: String,
})

const Checkbox = connect(_Checkbox, mapProps({
  value: 'modelValue',
}))

const workOrderInfo = inject(workOrderInfoSymbol)
const hideSubtotal = computed(() => workOrderInfo?.value?.currentStep.taskCode === 'CAR_RETURN_INSPECTION')

// 车辆配件表格
const accessoriesSchema = {
  type: 'object',
  properties: {
    vehicleAccessories: {
      'type': 'array',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      'items': {
        type: 'object',
        properties: {
          column1: {
            'type': 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '项目' },
            'properties': {
              receivable: {
                'type': 'string',
                'x-component': 'PreviewText.Input',
              },
            },
          },
          column2: {
            'type': 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '是否存在' },
            'properties': {
              missing: {
                'type': 'boolean',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
              },
            },
          },
          column3: {
            'type': 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '金额小计' },
            'properties': {
              subtotal: {
                'type': 'number',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
            },
          },
          column4: {
            'type': 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: '备注' },
            'properties': {
              remarks: {
                'type': 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
        },
      },
    },
  },
}
</script>

<template>
  <ObjectField :name="fieldName">
    <ElCard>
      <div class="flex flex-col">
        <div
          v-for="item of [
            { groupKey: 'vehicleViolation', groupName: '车辆违章', order: '-order-1' },
            { groupKey: 'floatingFee', groupName: '上浮费' },
            { groupKey: 'depreciationCharge', groupName: '折旧费' },
            { groupKey: 'trailerFee', groupName: '拖车费' },
          ]"
          :key="item.groupKey"
          class="flex"
          :class="item.order"
        >
          <div class="mt-1 w-5em">
            {{ item.groupName }}：
          </div>
          <div class="grid grid-cols-[200px_200px_200px_1fr_200px] flex-1 gap-2">
            <ObjectField :name="item.groupKey">
              <Field
                v-for="field of [
                  { name: '应收金额', key: 'receivable', validator: 'number' },
                  { name: '已收金额', key: 'netReceipts', validator: 'number' },
                  { name: '金额小计', key: 'subtotal', validator: 'number' },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '负责人', key: 'confirmedBy', hide: hideSubtotal },
                ].filter((item) => !item.hide)"
                :key="field.name"
                :component="[Input]"
                :decorator="[FormItem]"
                :name="field.key"
                :required="field.required ?? true"
                :validator="field.validator"
              >
                <template #prepend>
                  {{ field.name }}
                </template>
              </Field>
            </ObjectField>
          </div>
        </div>
        <div
          v-for="item of [
            { groupKey: 'liquidatedDamages', groupName: '违约金' },
          ]"
          :key="item.groupKey"
          class="flex"
        >
          <div class="mt-1 w-5em">
            {{ item.groupName }}：
          </div>
          <div class="grid grid-cols-[410px_200px_1fr_200px] flex-1 gap-2">
            <ObjectField :name="item.groupKey">
              <Field
                v-for="field of [
                  { name: '信息', key: 'receivable' },
                  { name: '金额小计', key: 'subtotal', validator: 'number' },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '负责人', key: 'confirmedBy', hide: hideSubtotal },
                ].filter((item) => !item.hide)"
                :key="field.name"
                :component="[Input]"
                :decorator="[FormItem]"
                :name="field.key"
                :required="field.required ?? true"
              >
                <template #prepend>
                  {{ field.name }}
                </template>
              </Field>
            </ObjectField>
          </div>
        </div>
        <div
          class="flex -order-1"
        >
          <div class="mt-1 w-5em">
            车辆证件：
          </div>
          <div class="grid grid-cols-[410px_200px_1fr_200px] flex-1 gap-2">
            <ObjectField name="vehicleCertificate">
              <div class="flex gap-4">
                <Field
                  v-for="field of [
                    { name: '行驶证', key: 'drivingLicense' },
                    { name: '运输证', key: 'transportCertificate' },
                  ]"
                  :key="field.name"
                  :component="[Checkbox, {
                    label: field.name,
                  }]"
                  :decorator="[FormItem]"
                  :name="field.key"
                />
              </div>
              <Field
                v-for="field of [
                  { name: '金额小计', key: 'subtotal', validator: 'number' },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '负责人', key: 'confirmedBy', hide: workOrderInfo?.currentStep.taskCode === 'CAR_RETURN_INSPECTION' },
                ].filter((item) => !item.hide)"
                :key="field.key"
                :component="[Input]"
                :decorator="[FormItem]"
                :name="field.key"
                :required="field.required ?? true"
              >
                <template #prepend>
                  {{ field.name }}
                </template>
              </Field>
            </ObjectField>
          </div>
        </div>
      </div>
    </ElCard>

    <ElCard title="车辆配件">
      <UseSchemaField :schema="accessoriesSchema" />
    </ElCard>
  </ObjectField>
</template>

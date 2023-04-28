<script setup lang="ts">
import { Input } from '@formily/element-plus'
import { ObjectField, VoidField } from '@formily/vue'
import { flowOptionSymbol } from '@/pages/process/types'

defineProps({
  fieldName: String,
})

const flowOption = inject(flowOptionSymbol)
const showConfirmedBy = computed(() => flowOption?.value.stepCodeActive === 'CAR_RETURN_FINANCIAL_APPROVALS')

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
                'x-disabled': true,
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
                'x-disabled': true,
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
        <ObjectField
          v-for="item of [
            { groupKey: 'vehicleViolation', groupName: '车辆违章', order: '-order-1' },
            { groupKey: 'floatingFee', groupName: '上浮费' },
            { groupKey: 'depreciationCharge', groupName: '折旧费' },
            { groupKey: 'trailerFee', groupName: '拖车费' },
          ]"
          :key="item.groupKey"
          :class="item.order"
          :name="item.groupKey"
        >
          <div class="flex">
            <div class="mt-1 w-5em">
              {{ item.groupName }}：
            </div>
            <div class="grid grid-cols-[200px_200px_200px_1fr_200px] flex-1 gap-2">
              <Field
                v-for="field of [
                  { name: '应收金额', key: 'receivable', validator: 'number' },
                  { name: '已收金额', key: 'netReceipts', validator: 'number' },
                  { name: '金额小计', key: 'subtotal', validator: 'number' },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '负责人', key: 'confirmedBy', hide: !showConfirmedBy },
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
            </div>
          </div>
        </ObjectField>
        <ObjectField
          v-for="item of [
            { groupKey: 'liquidatedDamages', groupName: '违约金' },
          ]"
          :key="item.groupKey"
          :name="item.groupKey"
        >
          <div class="flex">
            <div class="mt-1 w-5em">
              {{ item.groupName }}：
            </div>
            <div class="grid grid-cols-[410px_200px_1fr_200px] flex-1 gap-2">
              <Field
                v-for="field of [
                  { name: '信息', key: 'receivable' },
                  { name: '金额小计', key: 'subtotal', validator: 'number', readonly: true },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '负责人', key: 'confirmedBy', hide: !showConfirmedBy },
                ].filter((item) => !item.hide)"
                :key="field.name"
                :component="[Input]"
                :decorator="[FormItem]"
                :name="field.key"
                :readonly="field.readonly"
                :required="field.required ?? true"
              >
                <template #prepend>
                  {{ field.name }}
                </template>
              </Field>
            </div>
          </div>
        </ObjectField>
        <ObjectField
          v-for="item of [
            { groupKey: 'vehicleLossAssessment', groupName: '车辆定损' },
          ]"
          :key="item.groupKey"
          :name="item.groupKey"
        >
          <div class="flex">
            <div class="mt-1 w-5em">
              {{ item.groupName }}：
            </div>
            <div class="grid grid-cols-[200px_200px_200px_200px_1fr_200px] flex-1 gap-2">
              <Field
                v-for="field of [
                  { name: '维修时长', key: 'workingHours' },
                  { name: '定损金额', key: 'receivable' },
                  { name: '已收金额', key: 'netReceipts' },
                  { name: '金额小计', key: 'subtotal', validator: 'number', readonly: true },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '负责人', key: 'confirmedBy', hide: !showConfirmedBy },
                ].filter((item) => !item.hide)"
                :key="field.name"
                :component="[Input]"
                :decorator="[FormItem]"
                :name="field.key"
                :readonly="field.readonly"
              >
                <template #prepend>
                  {{ field.name }}
                </template>
              </Field>
            </div>
          </div>
        </ObjectField>
        <slot />
      </div>
    </ElCard>

    <VoidField name="vehicleCertificate">
      <ElCard header="车辆配件">
        <UseSchemaField :schema="accessoriesSchema" />
        <div class="grid grid-cols-[200px_1fr_200px] flex-1 gap-2">
          <ObjectField name="vehicleCertificate">
            <Field
              v-for="field of [
                { name: '金额总计', key: 'subtotal', validator: 'number', readonly: true },
                { name: '备注', key: 'remarks', required: false },
                { name: '负责人', key: 'confirmedBy', hide: !showConfirmedBy },
              ].filter((item) => !item.hide)"
              :key="field.key"
              :component="[Input]"
              :decorator="[FormItem]"
              :name="field.key"
              :readonly="field.readonly"
              :required="field.required ?? true"
            >
              <template #prepend>
                {{ field.name }}
              </template>
            </Field>
          </ObjectField>
        </div>
      </ElCard>
    </VoidField>
  </ObjectField>
</template>

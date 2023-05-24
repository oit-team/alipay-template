<script setup lang="ts">
import { DatePicker, FormItem, Input } from '@formily/element-plus'
import { ObjectField, VoidField, useFormEffects } from '@formily/vue'
import { onFieldReact, onFieldValueChange } from '@formily/core'
import numeral from 'numeral'
import type { Field as FieldType } from '@formily/core'
import { flowOptionSymbol } from '@/pages/process/types'

const props = defineProps({
  fieldName: {
    type: String,
    required: true,
  },
  // 启用计算
  effects: Boolean,
})

const flowOption = inject(flowOptionSymbol)
const showConfirmedBy = computed(() => flowOption?.value.stepCodeActive === 'CAR_RETURN_FINANCIAL_APPROVALS')

useFormEffects((form) => {
  // 设置维修项初始值
  form.setValuesIn(
    `${props.fieldName}.vehicleAccessories`,
    [
      '车钥匙',
      '行驶证',
      '运输证',
      '灭火器',
      '脚垫',
      '紧急警示牌',
      '拖车钩',
      '反光背心',
      '千斤顶',
      '备胎/充气泵',
      '其它',
    ].map(item => ({
      receivable: item,
      missing: false,
      subtotal: 0,
    })),
  )

  if (props.effects) {
    const calcKey = ['vehicleViolation', 'floatingFee', 'depreciationCharge', 'trailerFee', 'vehicleLossAssessment']
    calcKey.forEach((key) => {
      onFieldReact(`*.${key}.subtotal`, (field, form) => {
        field = field as FieldType
        const result = form.query(`*.${key}.receivable`).value() - form.query(`*.${key}.netReceipts`).value()
        field.value = Math.floor(result * 100) / 100 || 0
      })
    })

    // 切换配件是否存在
    onFieldValueChange('*.vehicleAccessories.*.missing', (field, form) => {
      field = field as FieldType
      const path = field.path.entire as string
      const parent = path.replace(/\.missing$/, '')
      const subtotal = form.query(`${parent}.subtotal`).take()! as FieldType
      const remark = form.query(`${parent}.remarks`).take()! as FieldType
      if (field.value) {
        subtotal.disabled = false
        remark.disabled = false
      }
      else {
        subtotal.disabled = true
        subtotal.value = 0
        remark.disabled = true
        remark.value = ''
      }
    })

    // 计算车辆配件小计
    onFieldReact('*.vehicleCertificate.subtotal', (field, form) => {
      field = field as FieldType
      const result = form
        .query('*.vehicleAccessories.*.subtotal')
        .reduce((acc, cur) => acc + (cur as FieldType).value, 0)

      field.value = numeral(result).format('0[.]00')
    })
  }
})

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
            'x-component-props': { width: 200, title: '是否丢失' },
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
            <div class="grid grid-cols-[200px_200px_1fr_200px_200px] flex-1 gap-2">
              <Field
                v-for="field of [
                  { name: '应收金额', key: 'receivable', validator: 'number', default: 0 },
                  { name: '已收金额', key: 'netReceipts', validator: 'number', default: 0 },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '金额小计', key: 'subtotal', validator: 'number' },
                  { name: '负责人', key: 'confirmedBy', hide: !showConfirmedBy },
                ].filter((item) => !item.hide)"
                :key="field.name"
                :component="[Input]"
                :decorator="[FormItem]"
                :initial-value="field.default"
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
            <div class="grid grid-cols-[410px_1fr_200px_200px] flex-1 gap-2">
              <Field
                :component="[DatePicker, { clearable: false }]"
                :decorator="[FormItem, { colon: false, labelWidth: 'auto' }]"
                name="actualApplicationTime"
                title="实际退车日期"
              />
              <Field
                v-for="field of [
                  { name: '备注', key: 'remarks', required: false },
                  { name: '金额小计', key: 'subtotal', validator: 'number', readonly: true },
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
            <div class="grid grid-cols-[200px_200px_200px_1fr_200px_200px] flex-1 gap-2">
              <Field
                v-for="field of [
                  { name: '维修时长', key: 'workingHours' },
                  { name: '定损金额', key: 'receivable' },
                  { name: '已收金额', key: 'netReceipts' },
                  { name: '备注', key: 'remarks', required: false },
                  { name: '金额小计', key: 'subtotal', validator: 'number', readonly: true },
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
        <div class="grid grid-cols-[1fr_200px_200px] flex-1 gap-2">
          <ObjectField name="vehicleCertificate">
            <Field
              v-for="field of [
                { name: '备注', key: 'remarks', required: false },
                { name: '金额总计', key: 'subtotal', validator: 'number', readonly: true, required: false },
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

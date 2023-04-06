<script setup lang="ts">
import { Checkbox, Select } from '@formily/element-plus'
import { workOrderInfoSymbol } from '@/pages/process/types'

defineProps({
  fieldName: String,
})

const workOrderReview = inject('workOrderReview') as Ref<any>
const workOrderInfo = inject(workOrderInfoSymbol)
// TODO: fix checkbox
const vehicleCertificate = computed(() =>
  workOrderReview?.value?.vehicleInspectionMap?.vehicleInspectionDetailed?.vehicleCertificate,
)
const hideSubtotal = computed(() => workOrderInfo?.value?.currentStep.taskCode === 'CAR_RETURN_INSPECTION')
</script>

<template>
  <ObjectField :name="fieldName">
    <div
      v-for="item of [
        { groupKey: 'vehicleViolation', groupName: '车辆违章' },
        { groupKey: 'floatingFee', groupName: '上浮费' },
        { groupKey: 'depreciationCharge', groupName: '折旧费' },
        { groupKey: 'trailerFee', groupName: '拖车费' },
      ]"
      :key="item.groupKey"
      class="flex"
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
        { groupKey: 'vehicleAccessories', groupName: '车辆配件', hide: hideSubtotal },
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
            :component="[Select, {
              multiple: true,
            }]"
            :data-source="[
              '车钥匙',
              '灭火器',
              '脚垫',
              '紧急警示牌',
              '拖车钩',
            ]"
            :decorator="[FormItem]"
            name="receivable"
          />
          <Field
            v-for="field of [
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
      class="flex"
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
                modelValue: vehicleCertificate?.[field.key],
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
  </ObjectField>
</template>

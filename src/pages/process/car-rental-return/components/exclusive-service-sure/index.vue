<script setup lang="ts">
import { onFieldReact } from '@formily/core'
import { FormItem } from '@formily/element-plus'
import type { Field as FieldType } from '@formily/core'
import { flowOptionSymbol } from '@/pages/process/types'

const flowOption = inject(flowOptionSymbol)!
const workOrderReview = inject('workOrderReview') as Ref<any>
const vehicleInfo = workOrderReview.value.resultList[0]

const form = createForm({
  effects() {
    const key = '*.rent'
    onFieldReact(`${key}.subtotal`, (field) => {
      field = field as FieldType
      const getValue = (target: string) => form.query(`${key}.${target}`).value()
      const result = getValue('receivable') - getValue('t3Withholding') - getValue('offlineCollection') - getValue('otherAmount')
      field.value = Math.floor(result * 100) / 100 || 0
    })
  },
})

// 计算租金
async function rentReceivable(date?: string) {
  const { data } = await axios.post('/order/leaseOrder/rentReceivable', {
    orderNo: vehicleInfo?.leaseOrderNo,
    terminationDate: date,
  })
  form.setValuesIn('supplementaryData.rent.receivable', data?.rentReceivable)
  form.setValuesIn('supplementaryData.rent.t3Withholding', data?.t3Withholding)
}

if (flowOption.value.isReview) {
  form.setValues({
    supplementaryData: workOrderReview.value.returnVehicleOrderMap.supplementaryData,
  })
}
else {
  rentReceivable(workOrderReview.value.returnVehicleOrderMap.returnTheCarTime)
}
</script>

<template>
  <div class="p-2">
    <FormProvider :form="form">
      <PageHeader :title="`申请退租-${$route.query?.workCode}`">
        <template v-if="!flowOption.isReview" #extra>
          <ElButton type="danger" @click="flowOption.reject()">
            拒绝
          </ElButton>
          <Submit type="primary" @submit="flowOption.submit($event)">
            通过
          </Submit>
        </template>
      </PageHeader>

      <ElCard class="whitespace-nowrap" header="租金">
        <FormLayout class="p-2">
          <ObjectField name="supplementaryData">
            <div
              v-for="item of [
                { groupKey: 'rent', groupName: '租金' },
              ]"
              :key="item.groupKey"
              class="flex"
            >
              <div class="grid grid-cols-[200px_200px_200px_200px_200px_1fr] flex-1 gap-2">
                <ObjectField :name="item.groupKey">
                  <Field
                    v-for="field of [
                      { name: '应收金额', key: 'receivable', validator: 'number' },
                      { name: 'T3代扣', key: 't3Withholding', validator: 'number' },
                      { name: '线下收取', key: 'offlineCollection', validator: 'number' },
                      { name: '其它金额', key: 'otherAmount', validator: 'number' },
                      { name: '金额小计', key: 'subtotal', validator: 'number' },
                      { name: '备注', key: 'remarks', required: false },
                    ]"
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
          </ObjectField>
        </FormLayout>
      </ElCard>
    </FormProvider>
  </div>
</template>

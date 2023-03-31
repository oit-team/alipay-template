<script setup lang="ts">
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '../../../types'

const { t } = useI18n()
const router = useRouter()
const form = createForm({
  readOnly: true,
})
const workOrderSubmit = inject(workOrderSubmitSymbol)
const workOrderInfo = inject(workOrderInfoSymbol)

const { data: vehicleReturnNote } = useAxios('/order/leaseOrder/getVehicleReturnNote', {
  data: {
    workCode: workOrderInfo?.value.workCode,
  },
})

const supplementInfo = computed(() => vehicleReturnNote.value?.supplementInfo && JSON.parse(vehicleReturnNote.value.supplementInfo))

watch(vehicleReturnNote, (data) => {
  form.setInitialValues({
    ...data,
    supplementInfo: supplementInfo.value,
  })
})

async function submit() {
  await workOrderSubmit?.({
    workCode: workOrderInfo?.value.workCode,
    aehicleReturnNoteId: vehicleReturnNote?.value.aehicleReturnNoteId,
    remark: '',
  }, {
    approvalStatus: 1,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}

async function reject() {
  await workOrderSubmit?.({}, {
    approvalStatus: 0,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}
</script>

<template>
  <div class="h-full flex flex-col">
    <FormProvider :form="form">
      <PageHeader :title="`申请退租-${$route.query?.workCode}`">
        <template v-if="!workOrderInfo?.isReview" #extra>
          <ElButton type="danger" @click="reject()">
            拒绝
          </ElButton>
          <Submit type="primary" @submit="submit()">
            通过
          </Submit>
        </template>
      </PageHeader>

      <FormLayout class="flex flex-col gap-2 p-2" label-col="2">
        <div class="flex-1 flex flex-col gap-2">
          <ElCard>
            <Descriptions
              border
              :data="vehicleReturnNote"
              label-width="120px"
              :options="[
                { prop: 'driverName', label: '司机姓名' },
                { prop: 'licensePlateNumber', label: '车型/车牌号' },
                { prop: 'returnApplicaDate', label: '退车申报日期' },
                { prop: 'vehicleReturnDate', label: '车辆归还日期' },
                { prop: 'licensePlateNumber', label: '身份证号码' },
                { prop: 'cashPledge', label: '保证金' },
                { prop: 'rentAndLeaseTerm', label: '租金/租期' },
                { prop: 'refundAccount', label: '退款账号' },
                { prop: 'depositBankBranch', label: '开户行(支行）' },
              ]"
            />
          </ElCard>
          <ElCard class="whitespace-nowrap">
            <FormLayout class="p-2">
              <ObjectField name="supplementInfo">
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
                  <div class="grid grid-cols-[200px_200px_200px_200px_1fr] flex-1 gap-2">
                    <ObjectField :name="item.groupKey">
                      <Field
                        v-for="field of [
                          { name: '应收金额', key: 'receivable', validator: 'number' },
                          { name: '已收金额', key: 'netReceipts', validator: 'number' },
                          { name: '小计', key: 'subtotal' },
                          { name: '负责人', key: 'confirmedBy' },
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
                <div
                  v-for="item of [
                    { groupKey: 'vehicleAccessories', groupName: '车辆配件' },
                    { groupKey: 'liquidatedDamages', groupName: '违约金' },
                  ]"
                  :key="item.groupKey"
                  class="flex"
                >
                  <div class="mt-1 w-5em">
                    {{ item.groupName }}：
                  </div>
                  <div class="grid grid-cols-[410px_200px_200px_1fr] flex-1 gap-2">
                    <ObjectField :name="item.groupKey">
                      <Field
                        v-for="field of [
                          { name: '信息', key: 'receivable' },
                          { name: '小计', key: 'subtotal' },
                          { name: '负责人', key: 'confirmedBy' },
                          { name: '备注', key: 'remarks', required: false },
                        ]"
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
                  <div class="grid grid-cols-[410px_200px_200px_1fr] flex-1 gap-2">
                    <ObjectField name="vehiclesCertificate">
                      <div v-if="supplementInfo?.vehiclesCertificate" class="flex gap-4 pointer-events-none">
                        <ElCheckbox
                          v-for="field of [
                            { name: '行驶证', key: 'drivingLicense' },
                            { name: '车钥匙', key: 'carKeys' },
                            { name: '运输证', key: 'transportCertificate' },
                          ]"
                          :key="field.name"
                          :label="field.name"
                          :model-value="supplementInfo.vehiclesCertificate[field.key]"
                        />
                      </div>
                      <Field
                        v-for="field of [
                          { name: '小计', key: 'subtotal' },
                          { name: '负责人', key: 'confirmedBy' },
                          { name: '备注', key: 'remarks', required: false },
                        ]"
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
            </FormLayout>
          </ElCard>
        </div>
      </FormLayout>
    </FormProvider>
  </div>
</template>

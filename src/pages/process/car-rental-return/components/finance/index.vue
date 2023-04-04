<script setup lang="ts">
import { set } from 'lodash-es'
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '../../../types'
import Valuation from '../components/Valuation.vue'

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

watch(vehicleReturnNote, (data) => {
  const supplementInfo = vehicleReturnNote.value?.supplementInfo && JSON.parse(vehicleReturnNote.value.supplementInfo)
  set(
    supplementInfo,
    'vehicleAccessories.receivable',
    supplementInfo?.vehicleAccessories?.receivable?.split(','),
  )
  form.setInitialValues({
    ...data,
    supplementInfo,
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
              <Valuation field-name="supplementInfo" />
            </FormLayout>
          </ElCard>
        </div>
      </FormLayout>
    </FormProvider>
  </div>
</template>

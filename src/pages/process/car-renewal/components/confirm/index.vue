<script setup lang="ts">
import { useFlowOption } from '@/pages/process/hooks/useFlowOption'

const form = createForm()
const flowOption = useFlowOption()!
const isReview = flowOption?.isReview
const reviewData = inject('workOrderReview') as Ref<any>

const { data } = useAxios('/order/leaseOrder/getViolationInfoByOrderNo', {
  data: {
    leaseOrderNo: reviewData.value?.leaseOrderBasic?.fatherOrderNo,
  },
})

async function submit() {
  await flowOption.submit({
    statue: 5,
  })
}
</script>

<template>
  <div class="p-2">
    <FormProvider :form="form">
      <PageHeader title="续租申请">
        <template v-if="!isReview" #extra>
          <ElButton type="danger" @click="flowOption.reject()">
            拒绝
          </ElButton>
          <Submit type="primary" @submit="submit">
            提交
          </Submit>
        </template>
      </PageHeader>

      <div class="flex flex-col gap-2">
        <Descriptions
          border
          :data="data"
          default-text="暂无"
          label-width="130px"
          :options="[
            { label: '违章数量', prop: 'violationsNum' },
            { label: '已处理', prop: 'processed' },
            { label: '未处理', prop: 'untreated' },
            { label: '总扣分', prop: 'totalDeductPoints' },
            { label: '罚款金额总计', prop: 'totalFineAmount' },
            { label: '已交罚款', prop: 'finePaid' },
            { label: '未交罚款', prop: 'unpaidFines' },
          ]"
        />
      </div>
    </FormProvider>
  </div>
</template>

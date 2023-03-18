<script setup lang="ts">
import { FormProvider } from '@formily/vue'

import schema from './schema/form.json'
import { handleSubmitFailed } from '@/utils/actions'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const form = createForm({
  validateFirst: true,
})

const infoMap = [
  {
    prop: 'orderNo',
    label: '订单编号',
  },
  {
    prop: 'orderType',
    label: '订单类型',
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
  },
  {
    prop: 'schemeNo',
    label: '方案编号',
  },
  {
    prop: 'city',
    label: '城市',
  },
  {
    prop: 'supplyMode',
    label: '供应方式',
  },
  {
    prop: 'driverId',
    label: '司机ID',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'driverMobileNumber',
    label: '司机手机号',
  },
  {
    prop: 'leaseContract',
    label: '租赁合同签约状态',
  },
  {
    prop: 'vinNo',
    label: '车架号',
  },
  {
    prop: 'carNumber',
    label: '车牌号',
  },
  {
    prop: 'tenancy',
    label: '租期（月）',
  },
  {
    prop: 'monthlyRent',
    label: '月租（元）',
  },
  {
    prop: 'endDate',
    label: '终止日期',
  },
  {
    prop: 'actualEndDate',
    label: '实际终止日期',
  },
  {
    prop: 'postponeStatus',
    label: '是否延期',
  },
  {
    prop: 'delayType',
    label: '延期类型',
  },
  {
    prop: 'delayRemarks',
    label: '延期描述',
  },
  {
    prop: 'changeOrderNoHist',
    label: '历史换车单号',
  },
  {
    prop: 't3CreatTime',
    label: 't3订单创建时间',
  },
  {
    prop: 'deliveryDate',
    label: '交付日期',
  },
  {
    prop: 'operator',
    label: '运营商',
    span: 2,
  },
  {
    prop: 'assetCompany',
    label: '资产公司',
    span: 2,
  },
  {
    prop: 'brandCarModel',
    label: '品牌车系车型',
    span: 2,
  },
  {
    prop: 'leaseContractName',
    label: '租赁合同名称',
    span: 4,
  },
  {
    prop: 'agreementName',
    label: '代扣协议名称',
    span: 4,
  },
]

const { data } = useAxios('/order/leaseOrder/getT3LeaseOrderInfo', {
  method: 'POST',
  data: { t3LeaseOrderId: route.params.id },
})

// 提交上传的合同 TODO
async function submit(form: any) {
  await axios.post('/order/leaseOrder/updateT3LeaseOrderInfo',
    {
      ...form, // 两个上传的？？
      // agreementUrl: '123', // 代扣协议地址
      // agreementName: 'qqq', // 代扣协议名称
      // leaseContractName: '456', // 租赁合同名称
      // leaseContractUrl: '456', // 租赁合同地址
      t3LeaseOrderId: route.params.id,
    },
  )
  ElMessage.success(t('save.success'))
  router.go(-1)
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col px-4 py-2">
      <PageHeader title="订单详情" />
      <Descriptions
        v-if="data?.body?.resultMap"
        border
        :column="4"
        :data="data?.body?.resultMap"
        default-text="无"
        :options="infoMap"
      >
        <template #leaseContractName="{ value }">
          <ElLink :href="data?.body?.resultMap?.leaseContractUrl" type="primary">
            {{ value }}
          </ElLink>
        </template>
        <template #agreementName="{ value }">
          <ElLink :href="data?.body?.resultMap?.agreementUrl" type="primary">
            {{ value }}
          </ElLink>
        </template>
      </Descriptions>
      <ElEmpty v-else />
    </div>
    <div class="flex flex-col mt-4">
      <FormLayout
        label-col="4"
        wrapper-col="10"
      >
        <UseSchemaField :schema="schema" />
      </FormLayout>
      <div class="mt-auto flex justify-center p-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.save') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>

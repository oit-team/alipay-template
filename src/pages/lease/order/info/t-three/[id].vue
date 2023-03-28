<script setup lang="ts">
import { FormProvider } from '@formily/vue'

import schema from './schema/form.json'
import type { UploadUserFile } from 'element-plus'
import { handleSubmitFailed, transformUploadData } from '@/utils/actions'

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
  },
  {
    prop: 'assetCompany',
    label: '资产公司',
  },
  {
    prop: 'brandCarModel',
    label: '品牌车系车型',
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
const labelWidth = ref('180px')
const data = ref()

// 反显t3详情合同模板
const getDetailInfo = async () => {
  const { data: detailInfo } = await axios.post('/order/leaseOrder/getT3LeaseOrderInfo', {
    t3LeaseOrderId: route.params.id,
  })
  const info = detailInfo?.resultMap
  data.value = info

  // 代扣合同模板
  if (info.agreementName) {
    info.agreementName = [{
      name: info.agreementName,
      url: info.agreementUrl || '',
      status: 'success',
    }] as UploadUserFile[]
  }

  // 合同模板
  if (info.leaseContractName) {
    info.leaseContractName = [{
      name: info.leaseContractName,
      url: info.leaseContractUrl || '',
      status: 'success',
    }] as UploadUserFile[]
  }

  form.setInitialValues({
    ...info,
  })
}
getDetailInfo()

// 提交上传的合同
async function submit(formData: any) {
  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/order/leaseOrder/updateT3LeaseOrderInfo',
    {
      t3LeaseOrderId: route.params.id,
      agreementUrl: transformUploadData(formData.agreementName)?.[0].url, // 代扣协议地址
      agreementName: transformUploadData(formData.agreementName)?.[0].name, // 代扣协议名称
      leaseContractName: transformUploadData(formData.leaseContractName)?.[0].url, // 租赁合同名称
      leaseContractUrl: transformUploadData(formData.leaseContractName)?.[0].name, // 租赁合同地址
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
        v-if="data?.id"
        border
        :data="data"
        default-text="无"
        :label-width="labelWidth"
        :options="infoMap"
      >
        <template #leaseContractName="{ value }">
          <ElLink :href="data?.leaseContractUrl" target="_blank" type="primary">
            {{ value[0].name }}
          </ElLink>
        </template>
        <template #agreementName="{ value }">
          <ElLink :href="data?.agreementUrl" target="_blank" type="primary">
            {{ value[0].name }}
          </ElLink>
        </template>
      </Descriptions>
      <ElEmpty v-else />
    </div>
    <div class="flex flex-col mt-4 px-4 font-bold">
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

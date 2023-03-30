<script setup lang="ts">
import { transformResponsePush } from '@/utils/helper'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const { data: detailInfo } = useAxios('/order/leaseOrder/getLeaseOrderByNo', {
  method: 'POST',
  data: {
    workCode: route.query.workCode,
  },
  transformResponse: transformResponsePush(data => data),
})

const dialogCancelReasonVisible = ref(false)

const form = reactive({
  approvalNotes: '',
})

async function handlePass() {
  const con = {
    workCode: route.query?.workCode,
    flowCode: route.query?.flowCode,
    taskCode: route.query?.taskCode,
    // nextTaskCode: '',
    approvalStatus: 1, // 1 同意 0 不同意
  }
  await axios.post(
    '/workFlow/workFlow/submit',
    {
      ...con,
      approvalNotes: '',
      params: {
        statue: 1,
      },
    },
  )
  ElMessage.success(t('handle.success'))
  router.push('/lease/work-order')
}

async function handleCancel() {
  const con = {
    workCode: route.query?.workCode,
    flowCode: route.query?.flowCode,
    taskCode: route.query?.taskCode,
    // nextTaskCode: '',
    approvalStatus: 0, // 1 同意 0 不同意
  }
  if (form.approvalNotes) {
    await axios.post(
      '/workFlow/workFlow/submit',
      {
        ...con,
        approvalNotes: form.approvalNotes,
        params: {
          statue: 3,
        },
      },
    )
    dialogCancelReasonVisible.value = false
    router.push('/lease/work-order')
  }
  else {
    ElMessage.warning('请先填写拒绝原因！')
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <PageHeader :title="`租车申请-${$route.query?.workCode}`">
      <template #extra>
        <ElButton type="danger" @click="dialogCancelReasonVisible = true">
          拒绝
        </ElButton>
        <ElButton type="primary" @click="handlePass()">
          通过
        </ElButton>
      </template>
    </PageHeader>

    <ElCard header="基本信息">
      <Descriptions
        v-if="detailInfo?.leaseOrderBasic"
        border
        column="4"
        :data="detailInfo?.leaseOrderBasic"
        default-text="无"
        label-width="130px"
        :options="[
          { label: '司机姓名', prop: 'driverName' },
          { label: '手机号', prop: 'driverPhone' },
          { label: '身份证号', prop: 'identityCard' },
          { label: '居住地址', prop: 'address' },
          { label: '租赁城市', prop: 'city' },
          { label: '车牌号', prop: 'licensePlateNumber' },
          { label: '车架号', prop: 'vehicleFrameNumber' },
          { label: '品牌车系车型', prop: 'vehicleBrand' },
          { label: '车务姓名', prop: 'vehicleService' },
          { label: '租入到期日', prop: 'endTime' },
          { label: '司服姓名', prop: 'exclusiveService' },
          { label: '方案编号', prop: 'caseCode' },
          { label: '方案类型', prop: 'caseType' },
          { label: '活动名称', prop: 'activityName' },
          { label: '销售姓名', prop: 'salesLeader' },
          { label: '申请时间', prop: 'createTime' },
        ]"
      />
      <ElEmpty v-else />
    </ElCard>

    <ElCard header="租赁信息">
      <Descriptions
        v-if="detailInfo?.leaseOrder"
        border
        column="4"
        :data="detailInfo?.leaseOrder"
        default-text="无"
        label-width="130px"
        :options="[
          { label: '品牌车系车型', prop: 'vehicleBrand' },
          { label: '租期（月）', prop: 'leaseTerm' },
          { label: '押金（元）', prop: 'cashPledge' },
          { label: '里程（km）', prop: 'mileage' },
          { label: '原月租（元）', prop: 'rent' },
          { label: '优惠月租（元）', prop: 'preferentialRent' },
          { label: '押金（元）', prop: 'cashPledge' },
          { label: '起租日期', prop: 'startTime' },
          { label: '原终止日期', prop: 'primaryEndTime' },
          { label: '终止日期', prop: 'endTime' },
          { label: '备注', prop: 'remarks' },
        ]"
      />
      <ElEmpty v-else />
    </ElCard>

    <ElCard header="账单信息">
      <QueryTable
        :columns="[
          { label: '期数', prop: 'numberOfPeriods' },
          { label: '账期', prop: 'accountingPeriod' },
          { label: '月租', prop: 'rent' },
        ]"
        :data="detailInfo?.leaseOrderBill"
      />
    </ElCard>
  </div>
  <ElDialog v-model="dialogCancelReasonVisible" title="审批拒绝" width="40%">
    <ElForm :model="form">
      <ElFormItem label="原因" label-width="60px">
        <ElInput
          v-model="form.approvalNotes"
          maxlength="30"
          placeholder="请输入拒绝原因"
          show-word-limit
          type="textarea"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="dialogCancelReasonVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleCancel()">
          提交
        </ElButton>
      </span>
    </template>
  </ElDialog>
</template>

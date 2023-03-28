<script setup lang="ts">
const route = useRoute()
// const router = useRouter()

const driverInfoMap = [
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'driverPhone',
    label: '司机手机号',
  },
  {
    prop: 'identityCard',
    label: '身份证号',
  },
]
const carInfoMap = [
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vinNo',
    label: '车架号',
  },
  {
    prop: 'bodyColor',
    label: '车身颜色',
  },
  {
    prop: 'brandCarModel', // 暂时空着
    label: '品牌车系车型',
  },
]
const leaseInfoMap = [
  {
    prop: 'leaseOrderNo',
    label: '订单编号',
  },
  {
    prop: 'schemeName',
    label: '方案名称',
  },
  {
    prop: 'brandCarModel',
    label: '品牌车系车型', // 暂时空着
  },
  {
    prop: 'leaseTerm',
    label: '租期（月）',
  },
  {
    prop: 'cashPledge',
    label: '押金（元）',
  },
  {
    prop: 'rent',
    label: '原月租（元）',
  },
  {
    prop: 'preferentialRent',
    label: '现月租（元）',
  },
  {
    prop: 'startTime',
    label: '起租日期',
  },
  {
    prop: 'primaryEndTime',
    label: '原终止日期',
  },
  {
    prop: 'endTime',
    label: '终止日期',
  },
  {
    prop: 'contractName',
    label: '合同名',
  },
  {
    prop: 'other',
    label: '其他附件',
  },
  {
    prop: 'remarks',
    label: '备注',
  },
]

const { data } = useAxios('/order/leaseOrder/getLeaseOrderInfo', {
  method: 'POST',
  data: { leaseOrderId: route.params.id },
})
</script>

<template>
  <div class="flex flex-col gap-4 p-2">
    <PageHeader title="订单详情" />
    <div class="flex flex-col gap-4 p-2">
      <Descriptions
        v-if="data?.driverInfo"
        border
        :data="data?.driverInfo"
        default-text="无"
        :options="driverInfoMap"
        title="司机信息"
      />
      <Descriptions
        v-if="data?.vehicleInfo"
        border
        :data="data?.vehicleInfo"
        default-text="无"
        :options="carInfoMap"
        title="车辆信息"
      />
      <Descriptions
        v-if="data?.orderInfo"
        border
        :data="data?.orderInfo"
        default-text="无"
        :options="leaseInfoMap"
        title="租赁信息"
      >
        <template #contractName="{ value }">
          <ElLink v-if="data?.orderInfo?.contractUrl" :href="data?.orderInfo?.contractUrl" target="_blank" type="primary">
            {{ value || '无' }}
          </ElLink>
          <span v-else>无</span>
        </template>
      </Descriptions>
      <ElEmpty v-else />
      <div class="flex flex-col">
        <div class="text-base font-bold mb-4">
          账单信息
        </div>
        <ElTable
          border
          :data="data?.billingInfo"
          empty-text="暂无信息"
          stripe
          style="width: 100%"
        >
          <ElTableColumn
            label="期数"
            prop="numberOfPeriods"
          />
          <ElTableColumn
            label="账期"
            prop="accountingPeriod"
          />
          <ElTableColumn
            label="月租"
            prop="rent"
          />
          <ElTableColumn
            label="备注"
            prop="remarks"
          >
            <template #default="{ row }">
              {{ row.remarks ?? '无' }}
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

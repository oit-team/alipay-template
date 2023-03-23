<script setup lang="ts">
import { pick } from 'lodash-es'
import { workOrderApplySymbol } from '../../types'
import schema from './schema/form.json'
import { transformResponsePush } from '@/utils/helper'
import { transformUploadData } from '@/utils/actions'

const vehicleId = ref()
const router = useRouter()

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/order/returnVehicleOrder/getVehicleMap',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)

const vehicleInfo = computed(() => vehicleList.value?.find((item: any) => item.vehicleId === vehicleId.value))

const form = createForm()
const workOrderApply = inject(workOrderApplySymbol)

async function submit(data: any) {
  if (!vehicleInfo.value)
    return ElMessage.error('请选择车辆')

  await workOrderApply?.({
    ...data,
    ...pick(vehicleInfo.value, ['vehicleId', 'driverId', 'leaseOrderNo']),
    appendix: transformUploadData(data.appendix)?.map(file => file.url),
  })

  ElMessage.success('提交成功')
  router.back()
}
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <FormProvider :form="form">
      <PageHeader title="申请退租">
        <template #extra>
          <Submit type="primary" @submit="submit" />
        </template>
      </PageHeader>

      <ElCard>
        <template #header>
          <div>
            <span>车牌号：</span>
            <ElSelect
              v-model="vehicleId"
              default-first-option
              filterable
              :loading="vehicleLoading"
              placeholder="请输入内容搜索"
              remote
              :remote-method="(v: any) => v && getVehicleList({ data: { licensePlateNumber: v } })"
              remote-show-suffix
              reserve-keyword
            >
              <ElOption
                v-for="item in vehicleList"
                :key="item.vehicleId"
                :label="item.vehicleFrameNumber"
                :value="item.vehicleId"
              />
            </ElSelect>
          </div>
        </template>
        <Descriptions
          border
          :data="vehicleInfo"
          default-text="暂无"
          label-width="130px"
          :options="[
            { label: '车架号', prop: 'vehicleFrameNumber' },
            { label: '司机姓名', prop: 'driverName' },
            { label: '身份证号', prop: 'identityCard' },
            { label: '所属运营商', prop: 'driverOperate' },
            { label: '起租日期', prop: 'startTime' },
            { label: '到租日期', prop: 'endTime' },
          ]"
        />
      </ElCard>

      <ElCard header="退车信息">
        <div class="pt-4">
          <FormLayout
            label-col="5"
          >
            <UseSchemaField :schema="schema" />
          </FormLayout>
        </div>
      </ElCard>
    </FormProvider>
  </div>
</template>

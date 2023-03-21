<script setup lang="ts">
import schema from './schema/form.json'
import { transformResponsePush } from '@/utils/helper'

const vehicleId = ref()

console.log(schema)

function executeQuery(fn: any, data: any) {
  fn({
    data: {
      pageNum: 1,
      pageSize: 10,
      ...data,
    },
  })
}

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/vehicle/vehicle/getVehicleList',
  { transformResponse: transformResponsePush(data => data.vehicleList) },
  { immediate: false },
)

const form = createForm({})

const log = console.log
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <FormProvider :form="form">
      <PageHeader title="申请退车">
        <template #extra>
          <Submit type="primary" @submit="log">
            提交
          </Submit>
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
              :remote-method="(v: any) => v && executeQuery(getVehicleList, { licensePlateNumber: v })"
              remote-show-suffix
              reserve-keyword
            >
              <ElOption
                v-for="item in vehicleList"
                :key="item.vehicleId"
                :label="`${item.licensePlateNumber}`"
                :value="item.vehicleId"
              />
            </ElSelect>
          </div>
        </template>
        <Descriptions
          border
          :data="vehicleList?.find((item: any) => item.vehicleId === vehicleId)"
          default-text="暂无"
          label-width="130px"
          :options="[
            { label: '车架号', prop: 'vehicleFrameNumber' },
            { label: '司机姓名', prop: 'city' },
            { label: '身份证号', prop: 'brandSeries' },
            { label: '所属运营商', prop: 'bodyColor' },
            { label: '起租日期', prop: 'mileage' },
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

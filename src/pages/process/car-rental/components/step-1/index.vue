<script setup lang="ts">
import { transformResponsePush } from '@/utils/helper'

const state = reactive({
  driverId: '',
  vehicleId: '',
  schemeId: '',
  activityId: '',
})
const schemeTypeId = ref(0)

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
  data: driverList,
  isLoading: driverLoading,
  execute: getDriverList,
} = useAxios(
  '/driverServer/driver/getDriverList',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/vehicle/vehicle/getVehicleList',
  { transformResponse: transformResponsePush(data => data.vehicleList) },
  { immediate: false },
)

const {
  data: schemeList,
  isLoading: schemeLoading,
  execute: getSchemeList,
} = useAxios(
  '/order/scheme/getSchemeList',
  { transformResponse: transformResponsePush(data => data.schemeList) },
  { immediate: false },
)

const {
  data: activityList,
  isLoading: activityLoading,
  execute: getActivityList,
} = useAxios(
  '/order/activity/getActivityList',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)

const {
  data: activityData,
  execute: getActivityMap,
} = useAxios(
  '/order/activity/getActivityMap',
  { transformResponse: transformResponsePush(data => data.activityDetails) },
  { immediate: false },
)

watch(schemeTypeId, () => {
  state.schemeId = ''
  schemeList.value = []
})
watch(() => state.activityId, () => {
  getActivityMap({
    data: {
      activityId: state.activityId,
    },
  })
})
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <PageHeader title="申请租车">
      <template #extra>
        <ElButton type="primary">
          提交
        </ElButton>
      </template>
    </PageHeader>

    <ElCard>
      <template #header>
        <div>
          <span>司机：</span>
          <ElSelect
            v-model="state.driverId"
            default-first-option
            filterable
            :loading="driverLoading"
            placeholder="请输入手机号搜索"
            remote
            :remote-method="(v: any) => v && executeQuery(getDriverList, { driverPhone: v })"
            remote-show-suffix
            reserve-keyword
          >
            <ElOption
              v-for="item in driverList"
              :key="item.driverId"
              :label="`${item.driverName}`"
              :value="item.driverId"
            />
          </ElSelect>
        </div>
      </template>
      <Descriptions
        border
        :data="driverList?.find((item: any) => item.driverId === state.driverId)"
        default-text="暂无"
        label-width="130px"
        :options="[
          { label: '司机', prop: 'driverName' },
          { label: '手机号', prop: 'driverPhone' },
          { label: '身份证号', prop: 'identityCard' },
          { label: '地址', prop: 'address' },
        ]"
      />
    </ElCard>

    <ElCard>
      <template #header>
        <div>
          <span>车牌号：</span>
          <ElSelect
            v-model="state.vehicleId"
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
        :data="vehicleList?.find((item: any) => item.vehicleId === state.vehicleId)"
        default-text="暂无"
        label-width="130px"
        :options="[
          { label: '车牌号', prop: 'licensePlateNumber' },
          { label: '车架号', prop: 'vehicleFrameNumber' },
          { label: '城市', prop: 'city' },
          { label: '品牌车系车型', prop: 'brandSeries' },
          { label: '车身颜色', prop: 'bodyColor' },
          { label: '行驶里程', prop: 'mileage' },
          { label: '终止时间', prop: 'endTime' },
        ]"
      />
    </ElCard>

    <ElCard>
      <template #header>
        <div>
          <span>方案类型：</span>
          <ElRadioGroup v-model="schemeTypeId" u-mr-6>
            <ElRadio :label="0">
              自营方案
            </ElRadio>
            <ElRadio :label="1">
              T3方案
            </ElRadio>
          </ElRadioGroup>
          <span>方案编号/名称：</span>
          <ElSelect
            v-model="state.schemeId"
            default-first-option
            filterable
            :loading="schemeLoading"
            placeholder="请输入内容搜索"
            remote
            :remote-method="(v: any) => v && executeQuery(getSchemeList, {
              keyWord: v,
              caseType: schemeTypeId,
            })"
            remote-show-suffix
            reserve-keyword
          >
            <ElOption
              v-for="item in schemeList"
              :key="item.id"
              :label="`${item.caseName}/${item.caseCode}`"
              :value="item.id"
            />
          </ElSelect>
        </div>
      </template>
      <Descriptions
        border
        :data="schemeList?.find((item: any) => item.id === state.schemeId)"
        default-text="暂无"
        label-width="130px"
        :options="[
          { label: '品牌车系车型', prop: 'brandCarModel' },
          { label: '租期（月）', prop: 'leaseTerm' },
          { label: '月租（元）', prop: 'rent' },
          { label: '押金（元）', prop: 'cashPledge' },
          { label: '车龄（年）', prop: 'vehicleAge' },
          { label: '里程（km）', prop: 'mileage' },
          { label: '起租日期', prop: '' },
          { label: '终止日期', prop: 'expirationDate' },
        ]"
      />
    </ElCard>

    <ElCard>
      <template #header>
        <div>
          <span>活动名称：</span>
          <ElSelect
            v-model="state.activityId"
            default-first-option
            filterable
            :loading="activityLoading"
            placeholder="请输入内容搜索"
            remote
            :remote-method="(v: any) => v && executeQuery(getActivityList, {
              activityName: v,
            })"
            remote-show-suffix
            reserve-keyword
          >
            <ElOption
              v-for="item in activityList"
              :key="item.activityId"
              :label="`${item.activityName}`"
              :value="item.activityId"
            />
          </ElSelect>
        </div>
      </template>
      <Descriptions
        border
        :data="activityList?.find((item: any) => item.activityId === state.activityId)"
        default-text="暂无"
        label-width="130px"
        :options="[
          { label: '活动名称', prop: 'activityName' },
          { label: '开始时间', prop: 'startTime' },
          { label: '结束时间', prop: 'endTime' },
          { label: '活动说明', prop: 'activityDescription', span: 3 },
          { label: '活动奖励', prop: 'reward', span: 3 },
        ]"
      >
        <template #reward>
          <QueryTable
            border
            :columns="[
              { label: '奖励类型', prop: 'rewardMethod' },
              { label: '数量', prop: 'number' },
              { label: '兑现方式', prop: 'cashingMethod' },
            ]"
            :data="activityData"
          />
        </template>
      </Descriptions>
    </ElCard>

    <ElCard header="优惠信息">
      <Descriptions
        border
        :data="[]"
        default-text="暂无"
        label-width="130px"
        :options="[
          { label: '租期（月）', prop: '' },
          { label: '原月租（元）', prop: '' },
          { label: '优惠月租（元）', prop: '' },
          { label: '押金（元）', prop: '' },
          { label: '起租日期', prop: '' },
          { label: '原终止日期', prop: '' },
          { label: '终止日期', prop: '' },
          { label: '备注', prop: '' },
        ]"
      />
    </ElCard>

    <ElCard header="账单信息">
      <QueryTable
        :columns="[
          { label: '期数', prop: '' },
          { label: '账期', prop: '' },
          { label: '月租', prop: '' },
          { label: '备注', prop: '' },
        ]"
        :data="driverList"
      />
    </ElCard>
  </div>
</template>

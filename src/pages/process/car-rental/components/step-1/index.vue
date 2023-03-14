<script setup lang="ts">
import { transformResponse } from '@/utils/helper'

const state = reactive({
  driverId: '',
})

const {
  data: driverList,
  isLoading: driverLoading,
  execute: getDriverList,
} = useAxios(
  '/driverServer/driver/getDriverList',
  { transformResponse: transformResponse(data => data.body.resultList) },
  { immediate: false },
)
</script>

<template>
  <div u-h-full u-flex="~ col">
    <PageHeader title="租车申请">
      <template #extra>
        <ElButton type="primary">
          提交
        </ElButton>
      </template>
    </PageHeader>

    <ElSteps :space="200" :active="1" simple class="sticky top-0 z-10">
      <ElStep title="申请租车" />
      <ElStep title="付款" />
      <ElStep title="财务" />
      <ElStep title="完成" />
    </ElSteps>

    <ElScrollbar view-class="flex flex-col gap-2 p-2">
      <ElCard>
        <div class="p-2">
          <span>司机：</span>
          <ElSelect
            v-model="state.driverId"
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            placeholder="请选择"
            default-first-option
            :remote-method="(data: any) => getDriverList({ data: { driverName: data, pageNum: 1, pageSize: 10 } })"
            :loading="driverLoading"
          >
            <ElOption
              v-for="item in driverList"
              :key="item.driverId"
              :label="`${item.driverName}(${item.driverPhone})`"
              :value="item.driverId"
            />
          </ElSelect>
        </div>
        <Descriptions
          border
          label-width="150px"
          :data="driverList?.find((item: any) => item.driverId === state.driverId)"
          :options="[
            { label: '司机', prop: 'driverName' },
            { label: '手机号', prop: 'driverName' },
            { label: '身份证号', prop: 'driverName' },
            { label: '地址', prop: 'driverName' },
          ]"
        />
      </ElCard>

      <ElCard>
        <div class="p-2">
          <span>车牌/车架号：</span>
          <ElSelect
            v-model="state.driverId"
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            placeholder="请选择"
            default-first-option
          >
            <ElOption
              v-for="item in driverList"
              :key="item.driverId"
              :label="`${item.driverName}(${item.driverPhone})`"
              :value="item.driverId"
            />
          </ElSelect>
        </div>
        <Descriptions
          border
          label-width="150px"
          :data="[]"
          :options="[
            { label: '车牌号', prop: '' },
            { label: '车架号', prop: '' },
            { label: '城市', prop: '' },
            { label: '品牌车系车型', prop: '' },
            { label: '车身颜色', prop: '' },
            { label: '行驶里程', prop: '' },
            { label: '租入到期日', prop: '' },
          ]"
        />
      </ElCard>

      <ElCard>
        <div class="p-2">
          <span>方案类型：</span>
          <ElRadioGroup u-mr-6>
            <ElRadio label="1">
              自营方案
            </ElRadio>
            <ElRadio label="2">
              T3方案
            </ElRadio>
          </ElRadioGroup>
          <span>司机：</span>
          <ElSelect
            v-model="state.driverId"
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            placeholder="车牌/车架号"
            default-first-option
          >
            <ElOption
              v-for="item in driverList"
              :key="item.driverId"
              :label="`${item.driverName}(${item.driverPhone})`"
              :value="item.driverId"
            />
          </ElSelect>
        </div>
        <Descriptions
          border
          label-width="150px"
          :data="[]"
          :options="[
            { label: '车牌号', prop: '' },
            { label: '车架号', prop: '' },
            { label: '城市', prop: '' },
            { label: '品牌车系车型', prop: '' },
            { label: '车身颜色', prop: '' },
            { label: '行驶里程', prop: '' },
            { label: '租入到期日', prop: '' },
          ]"
        />
      </ElCard>

      <ElCard>
        <div class="border-b p-2">
          <span>活动名称：</span>
          <ElSelect
            v-model="state.driverId"
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            placeholder="请选择"
            default-first-option
          >
            <ElOption
              v-for="item in driverList"
              :key="item.driverId"
              :label="`${item.driverName}(${item.driverPhone})`"
              :value="item.driverId"
            />
          </ElSelect>
        </div>
        <Descriptions
          border
          label-width="150px"
          :data="[]"
          column="3"
          :options="[
            { label: '活动名称', prop: '' },
            { label: '开始时间', prop: '' },
            { label: '结束时间', prop: '' },
            { label: '活动说明', prop: '', span: 3 },
            { label: '活动奖励', prop: 'reward', span: 3 },
          ]"
        >
          <template #reward>
            <QueryTable
              :data="driverList"
              :columns="[
                { label: '奖励类型', prop: '' },
                { label: '数量', prop: '' },
                { label: '兑现方式', prop: '' },
              ]"
            />
          </template>
        </Descriptions>
      </ElCard>

      <ElCard>
        <div class="p-2">
          <span>优惠信息：</span>
          <ElSelect
            v-model="state.driverId"
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            placeholder="请选择"
            default-first-option
          >
            <ElOption
              v-for="item in driverList"
              :key="item.driverId"
              :label="`${item.driverName}(${item.driverPhone})`"
              :value="item.driverId"
            />
          </ElSelect>
        </div>
        <Descriptions
          border
          label-width="150px"
          column="4"
          :data="[]"
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

      <ElCard>
        <div class="p-2">
          <span>账单信息</span>
        </div>
        <QueryTable
          :data="driverList"
          :columns="[
            { label: '期数', prop: '' },
            { label: '账期', prop: '' },
            { label: '月租', prop: '' },
            { label: '备注', prop: '' },
          ]"
        />
      </ElCard>
    </ElScrollbar>
  </div>
</template>

<style scoped>
.el-card {
  --el-card-padding: 0;
}
</style>

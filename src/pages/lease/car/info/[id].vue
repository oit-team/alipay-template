<script setup lang="ts">
import IllegalRecords from './components/IllegalRecords.vue'
import ExtraInfo from './components/ExtraInfo.vue'
const route = useRoute()
const transportationMap = [
  {
    prop: 'transporteCardNumber',
    label: '运输证编号',
  },
  {
    prop: 'certificateHandlingMoney',
    label: '办证金额',
  },
  {
    prop: 'cardCommencementDate',
    label: '运输证生效日期',
  },
  {
    prop: 'cardMaturityDate',
    label: '运输证到期日期',
  },
  {
    prop: 'transporteCardImg',
    label: '运输证照片',
    span: 2,
  },
]
const driveLicenseMap = [
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'licenseNumber',
    label: '行驶证编号',
  },
  {
    prop: 'fileNumber',
    label: '档案编号',
  },
  {
    prop: 'owner',
    label: '归属人',
  },
  {
    prop: 'registrationDate',
    label: '注册日期',
  },
  {
    prop: 'openingDate',
    label: '发证日期',
  },
  {
    prop: 'checkValidUntil',
    label: '校验有效期至',
  },
  {
    prop: 'driveLicenceOriginal',
    label: '驾驶证正本',
    span: 2,
  },
  {
    prop: 'driveLicenceEctype',
    label: '驾驶证副本',
    span: 2,
  },
]
const carIdentityMap = [
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vehicleFrameNumber',
    label: '车架号',
  },
  {
    prop: 'vehicleBrand',
    label: '车辆品牌',
    span: 2,
  },
  {
    prop: 'brandSeries',
    label: '品牌系列',
  },
  {
    prop: 'serialModelNo',
    label: '系列型号',
  },
  {
    prop: 'bodyColor',
    label: '车身颜色',
  },
  {
    prop: 'vehicleType',
    label: '车辆类型',
  },
  {
    prop: 'orgName',
    label: '所属区域名称',
  },
  {
    prop: 'vehicleState',
    label: '车辆状态',
  },
  {
    prop: 'stateMsg',
    label: '状态值',
  },
  {
    prop: 'belongPlatform',
    label: '所属平台',
  },
]

const { data } = useAxios('/vehicle/vehicle/getVehicleDetailed', {
  method: 'POST',
  data: { vehicleId: route.params.id },
})
</script>

<template>
  <div u-h-full>
    <PageHeader title="车辆详情" />
    <ElTabs type="border-card" u-h-full u-rounded-b-lg>
      <ElTabPane label="基本信息">
        <div class="flex flex-col gap-3">
          <ElCollapse model-value="base">
            <ElCollapseItem name="base" title="基本信息">
              <Descriptions v-if="data?.vehicleDetailed" border :data="data?.vehicleDetailed" default-text="无" :options="carIdentityMap" />
              <ElEmpty v-else />
            </ElCollapseItem>
            <ElCollapseItem title="运输证信息">
              <Descriptions v-if="data?.vehicleDetailed?.transporteCard" border :data="data?.vehicleDetailed?.transporteCard" default-text="无" :options="transportationMap">
                <template #transporteCardImg="{ value }">
                  <ElImage :src="value" />
                </template>
              </Descriptions>
              <ElEmpty v-else />
            </ElCollapseItem>
            <ElCollapseItem title="行驶证信息">
              <Descriptions v-if="data?.vehicleDetailed?.driveLicense" border :data="data?.vehicleDetailed?.driveLicense" default-text="无" :options="driveLicenseMap">
                <template #driveLicenceOriginal="{ value }">
                  <ElImage :src="value" />
                </template>
              </Descriptions>
              <ElEmpty v-else />
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </ElTabPane>
      <ElTabPane label="补充信息">
        <ExtraInfo />
      </ElTabPane>
      <ElTabPane label="违章记录">
        <IllegalRecords />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

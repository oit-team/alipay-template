<script setup lang="ts">
import { vehicleParamsSymbol } from '../types'

const labelWidth = ref('180px')
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
  },
]
const driveLicenseMap = [
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
  },
  {
    prop: 'driveLicenceEctype',
    label: '驾驶证副本',
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
    prop: 'vehicleModel',
    label: '品牌车系车型',
  },
  {
    prop: 'bodyColor',
    label: '车身颜色',
  },
  {
    prop: 'city',
    label: '所属城市',
  },
  {
    prop: 'vehicleService',
    label: '所属车务',
  },
]

const vehicleParams = inject(vehicleParamsSymbol)
const vehicleId = vehicleParams?.vehicleId

const { data } = useAxios('/vehicle/vehicle/getVehicleDetailed', {
  method: 'POST',
  data: { vehicleId },
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <ElCollapse model-value="base">
      <ElCollapseItem name="base" title="基本信息">
        <Descriptions
          v-if="data?.vehicleDetailed"
          border
          :data="data?.vehicleDetailed"
          default-text="无"
          :label-width="labelWidth"
          :options="carIdentityMap"
        />
        <ElEmpty v-else />
      </ElCollapseItem>
      <ElCollapseItem title="运输证信息">
        <Descriptions
          v-if="data?.vehicleDetailed?.transporteCard"
          border
          :data="data?.vehicleDetailed?.transporteCard"
          default-text="无"
          :label-width="labelWidth"
          :options="transportationMap"
        >
          <template #transporteCardImg="{ value }">
            <ElImage
              v-if="value"
              fit="cover"
              hide-on-click-modal
              :preview-src-list="[value]"
              :src="value"
              style="width: 100px; height: 100px"
            />
            <div v-else>
              无
            </div>
          </template>
        </Descriptions>
        <ElEmpty v-else />
      </ElCollapseItem>
      <ElCollapseItem title="行驶证信息">
        <Descriptions
          v-if="data?.vehicleDetailed?.driveLicense"
          border
          :data="data?.vehicleDetailed?.driveLicense"
          default-text="无"
          :label-width="labelWidth"
          :options="driveLicenseMap"
        >
          <template #driveLicenceOriginal="{ value }">
            <ElImage
              v-if="value"
              fit="cover"
              hide-on-click-modal
              :preview-src-list="[value]"
              :src="value"
              style="width: 100px; height: 100px"
            />
            <div v-else>
              无
            </div>
          </template>
          <template #driveLicenceEctype="{ value }">
            <ElImage
              v-if="value"
              fit="cover"
              hide-on-click-modal
              :preview-src-list="[value]"
              :src="value"
              style="width: 100px; height: 100px"
            />
            <div v-else>
              无
            </div>
          </template>
        </Descriptions>
        <ElEmpty v-else />
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

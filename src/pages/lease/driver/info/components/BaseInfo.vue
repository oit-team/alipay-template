<script setup lang="ts">
defineProps({
  data: Object,
})

const route = useRoute()

const infoMap = [
  {
    prop: 'driverName',
    label: '司机名称',
  },
  {
    prop: 'sexValue',
    label: '性别',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'orgName',
    label: '区域名称',
  },
  {
    prop: 'address',
    label: '住址',
    span: 2,
  },
  {
    prop: 'identityCard',
    label: '身份证号',
  },
  {
    prop: 'exclusiveService',
    label: '专属私服',
  },
  {
    prop: 'driverType',
    label: '类型',
  },
  {
    prop: 'vehicleStatue',
    label: '车辆状态',
  },
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vehicleModel',
    label: '车型',
  },
  {
    prop: 'driverPhone',
    label: '联系电话',
  },
]

const driverQualificaMap = [
  {
    prop: 'qualificaCode',
    label: '网约车证号',
  },
  {
    prop: 'issuingAuthority',
    label: '发放机构',
  },
  {
    prop: 'isOnlineCar',
    label: '政府人证情况',
  },
  {
    prop: 'issuingTime',
    label: '发放时间',
  },
  {
    prop: 'theFirstTime',
    label: '初次领取时间',
  },
  {
    prop: 'theFirstTime',
    label: '初次领取时间',
  },
  {
    prop: 'effectiveStartTime',
    label: '生效时间',
  },
  {
    prop: 'effectiveEndTime',
    label: '失效时间',
  },
  {
    prop: 'reportingTime',
    label: '报备时间',
  },
  {
    prop: 'certificateImg',
    label: '网约车证图',
  },
]

const driveLicenseMap = [
  {
    prop: 'driveLicenseCode',
    label: '驾驶证编号',
  },
  {
    prop: 'permitDriveVehicle',
    label: '准驾车型',
  },
  {
    prop: 'startTime',
    label: '生效时间',
  },
  {
    prop: 'endTime',
    label: '失效时间',
  },
  {
    prop: 'drawTime',
    label: '初次领证时间',
  },
  {
    prop: 'filesCode',
    label: '档案编号',
  },
  {
    prop: 'driveLicenseHost',
    label: '驾驶证主页',
  },
  {
    prop: 'driveLicenseAssistant',
    label: '驾驶证副页',
  },
]

const driverIdentityMap = [
  {
    prop: 'startTime',
    label: '生效时间',
  },
  {
    prop: 'endTime',
    label: '失效时间',
  },
  {
    prop: 'issuingInstitution',
    label: '发放机构',
  },
  {
    prop: 'identityStraight',
    label: '身份证正面',
    span: 2,
  },
  {
    prop: 'identityReverse',
    label: '身份证反面',
  },
  {
    prop: 'identityImg',
    label: '手持身份证照',
  },
]

const { data } = useAxios('/driverServer/driver/getDriverMap', {
  method: 'POST',
  data: { driverId: route.params.id },
})
</script>

<template>
  <div class="flex flex-col gap-3 p-2">
    <ElCollapse class="border-x" model-value="base">
      <ElCollapseItem name="base" title="基本信息">
        <Descriptions border :data="data?.body" default-text="无" :options="infoMap" />
      </ElCollapseItem>
      <ElCollapseItem title="身份证信息">
        <Descriptions
          v-if="data?.body?.driverIdentity"
          border
          :data="data?.body?.driverIdentity"
          default-text="无"
          :options="driverIdentityMap"
        >
          <template #identityImg="{ value }">
            <ElImage :src="value" />
          </template>
          <template #identityStraight="{ value }">
            <ElImage :src="value" />
          </template>
          <template #identityReverse="{ value }">
            <ElImage :src="value" />
          </template>
        </Descriptions>
        <ElEmpty v-else />
      </ElCollapseItem>
      <ElCollapseItem title="驾驶证信息">
        <Descriptions
          v-if="data?.body?.driverQualifica"
          border
          :data="data?.body?.driverQualifica"
          default-text="无"
          :options="driverQualificaMap"
        />
        <ElEmpty v-else />
      </ElCollapseItem>
      <ElCollapseItem title="网约车证信息">
        <Descriptions
          v-if="data?.body?.driveLicense"
          border
          :data="data?.body?.driveLicense"
          default-text="无"
          :options="driveLicenseMap"
        >
          <template #driveLicenseHost="{ value }">
            <ElImage :src="value" />
          </template>
          <template #driveLicenseAssistant="{ value }">
            <ElImage :src="value" />
          </template>
        </Descriptions>
        <ElEmpty v-else />
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const infoMap = [
  {
    prop: 'sexValue',
    label: '性别',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'sex',
    label: '性别',
  },
  {
    prop: 'address',
    label: '住址',
  },
  {
    prop: 'orgName',
    label: '区域名称',
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
    prop: 'orgId',
    label: '区域id',
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
    prop: 'driverId',
    label: '司机id',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'vehicleModel',
    label: '车型',
  },
  {
    prop: 'driverName',
    label: '司机名称',
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

useAxios('/driverServer/replenish/getT3DriverReplenish', {
  method: 'POST',
  data: { driverId: route.params.id },
})
</script>

<template>
  <div u-h-full>
    <PageHeader title="司机详情" />
    <ElTabs type="border-card" u-h-full u-rounded-b-lg>
      <ElTabPane label="基本信息">
        <div class="flex flex-col gap-3">
          <ElCollapse model-value="base">
            <ElCollapseItem title="基本信息" name="base">
              <Descriptions :data="data?.body" :map="infoMap" border default-text="无" />
            </ElCollapseItem>
            <ElCollapseItem title="身份证信息">
              <Descriptions :data="data?.body?.driverIdentity" :map="driverIdentityMap" border default-text="无">
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
            </ElCollapseItem>
            <ElCollapseItem title="驾驶证信息">
              <Descriptions :data="data?.body?.driverQualifica" :map="driverQualificaMap" border default-text="无" />
            </ElCollapseItem>
            <ElCollapseItem title="网约车证信息">
              <Descriptions :data="data?.body?.driveLicense" :map="driveLicenseMap" border default-text="无">
                <template #driveLicenseHost="{ value }">
                  <ElImage :src="value" />
                </template>
                <template #driveLicenseAssistant="{ value }">
                  <ElImage :src="value" />
                </template>
              </Descriptions>
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </ElTabPane>
      <ElTabPane label="补充信息">
        <div>
          补充
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

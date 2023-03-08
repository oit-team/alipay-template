<script setup lang="ts">
const route = useRoute()

const map = [
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

const { data } = useAxios('/driverServer/driver/getDriverMap', {
  method: 'POST',
  data: { driverId: route.params.id },
})
</script>

<template>
  <div u-h-full>
    <PageHeader title="司机详情" />
    <ElTabs type="border-card" u-h-full u-rounded-b-lg>
      <ElTabPane label="基本信息">
        <Descriptions :data="data?.body" :map="map" border default-text="无" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

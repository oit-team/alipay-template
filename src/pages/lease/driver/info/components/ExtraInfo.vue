<script setup lang="ts">
const route = useRoute()
const type = ref()

const extraMap = [
  { prop: 'driverId', label: '司机id' },
  { prop: 'studyRecord', label: '学历' },
  { prop: 'entryTime', label: '入职日期' },
  { prop: 'isPatrol', label: '是否巡游' },
  { prop: 'driverGrade', label: '司机等级' },
  { prop: 'urgentUserName', label: '紧急联系人姓名' },
  { prop: 'urgentUserPhone', label: '紧急联系人电话' },
  { prop: 'urgentUserAdd', label: '紧急联系人住址' },
  { prop: 'politicalOutlook', label: '政治面貌' },
  { prop: 'bloodGroup', label: '血型' },
  { prop: 'operator', label: '所属运营商' },
  { prop: 'city', label: '所属区域' },
  { prop: 'serviceType', label: '服务类型' },
  { prop: 'driverSalaryType', label: '司机工资类别' },
  { prop: 'soleDuty', label: '是否专职' },
  { prop: 'maritalStatus', label: '婚姻状态' },
  { prop: 'householdRegistraHierarchy', label: '户口等级机关' },
  { prop: 'vaccination', label: '疫苗接种情况' },
  { prop: 'replenishType', label: '补充类型' },
]

const { data: typeList } = useAxios('/driverServer/replenish/getReplenishTypeList', {
  method: 'POST',
  data: {
    driverId: route.params.id,
  },
})

const { data: desc, execute } = useAxios('/driverServer/replenish/getDriverReplenish', {
  method: 'POST',
}, { immediate: false })

watch(type, () => execute({
  data: {
    driverId: route.params.id,
    replenishType: type.value,
  },
}))
</script>

<template>
  <div class="p-2">
    <div class="flex">
      <ElSelect v-model="type" placeholder="选择补充类型" size="large">
        <ElOption
          v-for="item in typeList?.body.resultList"
          :key="item.replenishTypeValue"
          :label="item.replenishTypeName"
          :value="item.replenishTypeValue"
        />
      </ElSelect>
      <ElButton class="ml-auto" size="large" type="primary">
        新增
      </ElButton>
    </div>
    <Descriptions class="mt-2" :data="desc?.body" :map="extraMap" border default-text="无" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const Dataform = ref({
  activityName: '',
  startTime: '',
  endTime: '',
  activityDescription: '',
  activityDetails: [],
})

onMounted(() => {
  getData()
})

async function getData() {
  const res = await axios.post('/order/activity/getActivityMap', {
    activityId: route.params.id,
  })
  Dataform.value = res.data
}
</script>

<template>
  <div class="h-full p-3">
    <PageHeader title="活动详情" />
    <div class="px-4">
      <ElForm ref="form" class="flex justify-between" :inline="true" :model="Dataform">
        <ElFormItem label="活动名称" prop="activityName">
          <ElInput v-model="Dataform.activityName" disabled />
        </ElFormItem>
        <ElFormItem label="开始时间" prop="startTime">
          <ElDatePicker v-model="Dataform.startTime" disabled placeholder="请选择" />
        </ElFormItem>
        <ElFormItem label="结束时间" prop="endTime">
          <ElDatePicker v-model="Dataform.endTime" disabled placeholder="请选择" />
        </ElFormItem>
      </ElForm>
      <div class="text-sm text-[#606266] w-full">
        <div class="mb-2">
          活动奖励
        </div>
        <div class="w-full rounded-md p-6 border">
          <ElTable :data="Dataform.activityDetails" max-height="250" style="width: 100%">
            <ElTableColumn label="奖励方式" prop="rewardMethod" />
            <ElTableColumn label="数量" prop="number" />
            <ElTableColumn label="单位" prop="unit" />
            <ElTableColumn label="兑现方式" prop="cashingMethod" />
            <ElTableColumn label="操作" width="120">
              <template #default>
                <ElButton disabled plain type="info">
                  编辑
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <div class="text-sm text-[#606266] py-4">
        <div class="mb-4">
          活动说明
        </div>
        <ElInput v-model="Dataform.activityDescription" disabled rows="6" type="textarea" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>

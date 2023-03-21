<script setup lang="ts">
import { cloneDeep } from 'lodash-es'

const route = useRoute()
const router = useRouter()

const taskAllList = ref([])
const taskCheckList = ref([])

onMounted(() => {
  getWorkFlowSteps()
  getSelectedWorkFlowTask()
})

async function getWorkFlowSteps() {
  const res = await axios.post('/workFlow/workFlowForManage/getWorkFlowSteps', {})
  taskAllList.value = cloneDeep(res.data.workFlowList)
}

async function getSelectedWorkFlowTask() {
  const res = await axios.post('/workFlow/workFlowForManage/getSelectedWorkFlowTask', {
    roleIds: [route.query.id],
  })
  if (res.data.workFlowList)
    taskCheckList.value = res.data.workFlowList?.map((item: any) => item.taskCode)
}

async function submit() {
  await axios.post('/workFlow/workFlowForManage/saveSelectedWorkFlowTask', {
    roleId: route.query.id,
    workFlowTaskCodeList: taskCheckList.value,
  })
  ElMessage.success('操作成功')
  router.push('/system/role')
}
</script>

<template>
  <div class="h-full">
    <PageHeader title="角色任务" />
    <div class="w-full flex flex-col items-center p-4">
      <ElTransfer
        v-model="taskCheckList"
        :data="taskAllList"
        :props="{
          key: 'taskCode',
          label: 'name',
        }"
        :titles="['任务列表', '已关联任务']"
      />
      <div class="mt-4">
        <ElButton size="large" type="success" @click="submit">
          完成
        </ElButton>
      </div>
    </div>
  </div>
</template>

  <style lang="scss" scoped>
  :deep{
    .el-transfer-panel{
      width: 20vw;
      min-height: 30vh;
      .el-transfer-panel__body{
        height: 40vh;
        .el-transfer-panel__list{
          height: 40vh;
        }
      }
    }
  }
  </style>

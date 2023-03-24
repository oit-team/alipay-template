<route lang="yaml">
meta:
  cache: false
</route>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const schemeNotActivity = ref<{
  caseCode: string
  caseName: string
  orgName: string
  schemeId: number | string
  disabled: Boolean
}[]>([])
// const schemeActivity = ref<{
//   caseCode: string
//   caseName: string
//   orgName: string
//   schemeId: number | string
// }[]>([])
const schemeActivity = ref<any>([])

onMounted(() => {
  getdata()
})

async function getdata() {
  const res = await axios.post('/order/activity/getSchemeActivityList', {
    activityId: route.params.id,
  })

  const arr = res.data.schemeActivity
  schemeNotActivity.value = res.data.schemeNotActivity
  if (res.data.schemeActivity)
    schemeNotActivity.value.push(...arr)
  schemeActivity.value = arr.map((item: any) => item.schemeId)
}

async function submit() {
  await axios.post('/order/activity/addSchemeActivity', {
    activityId: route.params.id,
    schemeIdList: schemeActivity.value,
  })
  ElMessage.success('操作成功')
  router.push('/activity/list')
}

// function handleChange(
//   value: number | string,
//   direction: 'left' | 'right',
//   movedKeys: string[] | number[],
// ) {
//   console.log(value, direction, movedKeys)
// }
</script>

<template>
  <div class="h-full">
    <PageHeader title="关联方案" />
    <div class="w-full flex flex-col items-center p-4">
      <ElTransfer
        v-model="schemeActivity"
        :data="schemeNotActivity"
        :props="{
          key: 'schemeId',
          label: 'caseName',
        }"
        :titles="['关联方案', '已关联方案']"
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

<script setup lang="ts">
const route = useRoute()

const allList = ref([])
const checkList = ref([])

onMounted(() => {
  getRoleUserList()
})

async function getRoleUserList() {
  const { data } = await axios.post('/system/role/getRoleUserList', {
    roleId: route.query.id,
  })
  allList.value = data.allUser
  checkList.value = data.isAssociatedUser
}

function handleChange(_value: any, direction: 'right' | 'left', movedKeys: any) {
  // value 右侧数组集合
  // direction 有right和left两个值 代表向左右两边传值
  // movedKeys 移动元素id组成的数组集合
  submit(movedKeys, direction === 'right' ? 0 : 1)
}

async function submit(keys: any, id: number) {
  await axios.post('/system/role/addUserAndRole', {
    roleIds: `${route.query.id}`,
    userIds: keys.toString(),
    operateId: id,
  })
  ElMessage.success('操作成功')
}
</script>

<template>
  <div class="h-full">
    <PageHeader title="角色授权" />
    <div class="w-full flex flex-col items-center p-4">
      <ElTransfer
        v-model="checkList"
        :button-texts="['取消', '授权']"
        :data="allList"
        :props="{
          key: 'id',
          label: 'nickName',
        }"
        :titles="['人员列表', '已关联人员']"
        @change="handleChange"
      />
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

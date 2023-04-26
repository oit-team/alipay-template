<script setup lang="ts">
const emit = defineEmits(['done'])
const { t } = useI18n()

const assignDrawer = ref(false)
const userList = ref<any[]>()
const form = reactive({
  person: '',
})
const ids = ref('')
const type = ref(0)

const getUserByKeyword = async () => {
  const { data } = await axios.post('/system/user/getUserByKeyword', {
    keyword: form.person,
  })
  userList.value = data.result
}

async function open(checkUserIds: any, t = 0) {
  assignDrawer.value = true
  form.person = ''
  ids.value = checkUserIds.value
  type.value = t
  await nextTick()
  await getUserByKeyword()
}

function close() {
  assignDrawer.value = false
}

const updateResponsiblePerson = async () => {
  await axios.post('/vehicle/vehicle/updateResponsiblePerson', {
    updateType: type.value,
    personId: form.person,
    dataIds: ids.value,
  })
  ElMessage.success(t('handle.success'))
  close()
  emit('done')
}

async function onSubmit() {
  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'warning',
  })
  await updateResponsiblePerson()
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <ElDrawer
    v-model="assignDrawer"
    direction="rtl"
    title="分配负责人"
  >
    <div class="p-4">
      <ElForm label-width="80px" :model="form">
        <ElFormItem label="负责人">
          <ElSelect v-model="form.person" filterable placeholder="请选择负责人">
            <ElOption
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton @click="close()">
            取消
          </ElButton>
          <ElButton type="primary" @click="onSubmit">
            提交
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </ElDrawer>
</template>

<style lang='scss' scoped>

</style>

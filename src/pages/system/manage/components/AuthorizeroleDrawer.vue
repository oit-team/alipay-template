<script setup lang="ts">
import { QueryProvide } from '@uxuip/element-plus-query'
import type { ElTable } from 'element-plus'
const { t } = useI18n()

const authDrawer = ref(false)
const queryDrawerRef = ref<InstanceType<typeof QueryProvide>>()
const tableRef = ref<InstanceType<typeof ElTable>>()

const ids = ref('')
const selectedRow = ref()

async function open(checkUserIds: any) {
  authDrawer.value = true
  await nextTick()
  queryDrawerRef.value?.query()
  ids.value = checkUserIds.value
}

function close() {
  authDrawer.value = false
}

function handleSelectionDrawerChange(val: any) {
  if (val)
    selectedRow.value = val
}

const addUserAndRole = async () => {
  await axios.post('/system/role/addUserAndRole', {
    operateId: 0, // 授权0 取消1
    roleIds: selectedRow.value?.roleId,
    userIds: ids.value,
  })
  ElMessage.success(t('handle.success'))
  tableRef.value!.setCurrentRow(selectedRow.value)
  close()
}

function authorizeSubmit() {
  addUserAndRole()
}

function cancelAuthrize() {
  tableRef.value!.setCurrentRow(selectedRow.value)
  close()
}

const columns = [
  {
    prop: 'roleName',
    label: '角色名称',
  },
  {
    prop: 'roleCode',
    label: '角色编码',
  },
  {
    prop: 'roleRemark',
    label: '角色描述',
  },
]

defineExpose({
  open,
  close,
})
</script>

<template>
  <ElDrawer
    v-model="authDrawer"
    direction="rtl"
    size="40%"
    title="角色授权"
  >
    <div class="p-4">
      <UseQuery
        v-slot="attrs"
        :columns="columns"
        :data="{
          pageNum: 1,
          pageSize: 999,
        }"
        :key-map="{
          data: 'resultList',
          total: 'count',
        }"
        url="/system/role/getRoleList"
      >
        <QueryProvide v-bind="attrs" ref="queryDrawerRef">
          <QueryTable
            ref="tableRef"
            class="flex-1"
            :selection="{
              type: 'radio',
            }"
            @current-change="handleSelectionDrawerChange"
          />
        </QueryProvide>
      </UseQuery>
      <div style="margin-top: 20px">
        <ElButton @click="cancelAuthrize()">
          取消
        </ElButton>
        <ElButton type="primary" @click="authorizeSubmit()">
          确认
        </ElButton>
      </div>
    </div>
  </ElDrawer>
</template>

<style lang='scss' scoped>

</style>

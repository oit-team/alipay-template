<route>
meta:
  cache: true
</route>

<script setup lang="ts">
const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
    type: 'warning',
  })
  await axios.post('/system/role/delRoleById', { roleId: row.roleId })
  await queryRef.value.query()
  ElMessage.success('操作成功')
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="query"
      url="/system/role/getRoleList"
      column="1677137737909"
      form="1677659603116"
    >
      <QueryProvide v-bind="query" ref="queryRef" auto-query="active">
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary">
            新增
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="150px">
              <ElButton type="primary">
                编辑
              </ElButton>
              <ElButton type="danger" @click="onDelete(row)">
                删除
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

<route>
meta:
  cache: true
</route>

<script setup lang="ts">
const { t } = useI18n()
const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm(
    t('confirm.delete'),
    t('tip.info'),
    {
      type: 'warning',
    },
  )
  await axios.post('/system/role/delRoleById', { roleId: row.roleId })
  await queryRef.value.query()
  ElMessage.success(t('handle.success'))
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
            {{ $t('button.new') }}
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" width="150px">
              <ElButton type="primary">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton type="danger" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

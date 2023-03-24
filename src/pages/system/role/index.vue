<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import router from '@/router'

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

function toTask(id: number | string) {
  router.push({
    path: './role/task',
    query: {
      id,
    },
  })
}

function toAuthorize(id: number | string) {
  router.push({
    path: './role/authorize',
    query: {
      id,
    },
  })
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="query"
      column="1677137737909"
      form="1677659603116"
      url="/system/role/getRoleList"
    >
      <QueryProvide v-bind="query" ref="queryRef" auto-query="active">
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./role/new')">
            {{ $t('button.new') }}
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" width="260px">
              <ElButton @click="toTask(row.roleId)">
                任务
              </ElButton>
              <ElButton type="primary" @click="$router.push(`./role/${row.roleId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton type="danger" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
              <ElButton type="success" @click="toAuthorize(row.roleId)">
                授权
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

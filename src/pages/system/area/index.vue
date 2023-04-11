<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
const queryRef = ref()

const { t } = useI18n()

async function dltArea(id: number | string) {
  await ElMessageBox.confirm(
    t('confirm.delete'),
    t('tip.info'),
    {
      type: 'warning',
    },
  )
  await axios.post('/system/org/delOrgInfo', {
    orgId: id,
  })
  await queryRef.value.query()
  ElMessage.success(t('handle.success'))
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="query"
      columns-key="1681104977767"
      :key-map="{
        data: 'result',
      }"
      schema-key="1681104994725"
      url="/system/org/getTreeOrgList"
    >
      <QueryProvide
        v-bind="query"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./area/new')">
            {{ $t('button.new') }}
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="150px">
              <ElButton size="small" type="info" @click="$router.push(`./area/${row.orgId}`)">
                编辑
              </ElButton>
              <ElButton size="small" type="danger" @click="dltArea(row.orgId)">
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

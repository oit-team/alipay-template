<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
const { t } = useI18n()

const query = ref<any>(null)

async function dltList(id: string) {
  await ElMessageBox.confirm(t('confirm.delete'), t('tip.info'), {
    type: 'warning',
  })
  await axios.post('/order/activity/deleteActivity', {
    activityId: id,
  })
  ElMessage.success('删除成功')
  query.value?.query()
}

async function upOrDown(item: any) {
  const msg = item.activityStatue === 0 ? '确定上架吗' : '确定下架吗'
  await ElMessageBox.confirm(msg, t('tip.info'), {
    type: 'warning',
  })
  await axios.post('/order/activity/updateActivityStatue', {
    activityId: item.activityId,
    activityStatue: item.activityStatue === 0 ? 1 : 0,
  })
  ElMessage.success('成功')
  query.value?.query()
}
</script>

<template>
  <div class="h-full p-3">
    <UseQuery v-slot="attrs" url="/order/activity/getActivityList">
      <QueryProvide v-bind="attrs" ref="query" auto-query="active" columns-key="1681104260564" schema-key="1681104292358">
        <QueryForm />
        <QueryToolbar>
          <TButton icon="add" @click="$router.push('./list/new')">
            {{ $t('button.add') }}
          </TButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="350">
              <ElButton size="small" type="primary" @click="$router.push(`./list/plan/${row.activityId}`)">
                关联方案
              </ElButton>
              <ElButton size="small" :type="row.activityStatue === 1 ? '' : 'success'" @click="upOrDown(row)">
                {{ row.activityStatue === 1 ? '下架' : '上架' }}
              </ElButton>
              <ElButton size="small" type="info" @click="$router.push(`./list/info/${row.activityId}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton :disabled="row.activityStatue === 1" size="small" type="warning" @click="$router.push(`./list/${row.activityId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton :disabled="row.activityStatue === 1" size="small" type="danger" @click="dltList(row.activityId)">
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

<style lang="scss" scoped>
</style>

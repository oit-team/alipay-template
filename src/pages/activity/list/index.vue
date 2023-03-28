<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import schema from './schema/indexSearchForm.json'

const { t } = useI18n()

const query = ref<any>(null)

const columns = [
  {
    prop: 'activityName',
    label: '活动名称',
  },
  {
    prop: 'activityStatueName',
    label: '活动状态',
  },
  {
    prop: 'activityDescription',
    label: '活动说明',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'startTime',
    label: '生效时间',
  },
  {
    prop: 'endTime',
    label: '失效时间',
  },
]

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
      <QueryProvide v-bind="attrs" ref="query" auto-query="active" :columns="columns" :schema="schema">
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./list/new')">
            {{ $t('button.add') }}
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="350">
              <ElButton :disabled="row.activityStatue === 1" size="small" type="primary" @click="$router.push(`./list/plan/${row.activityId}`)">
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

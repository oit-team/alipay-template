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
    prop: 'rulesName',
    label: '规则名称',
  },
  {
    prop: 'rulesUnit',
    label: '规则单位',
  },
  {
    prop: 'cashingMethod',
    label: '兑现方式',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
]

async function dltRules(id: string) {
  await ElMessageBox.confirm(t('confirm.delete'), t('tip.info'), {
    type: 'warning',
  })
  await axios.post('/order/activityRules/deleteActivityRules', {
    rulesId: id,
  })
  ElMessage.success('删除成功')
  query.value?.query()
}
</script>

<template>
  <div class="h-full p-3">
    <UseQuery v-slot="attrs" url="/order/activityRules/getActivityRules">
      <QueryProvide v-bind="attrs" ref="query" auto-query="active" :columns="columns" :schema="schema">
        <QueryForm />
        <QueryToolbar>
          <TButton icon="add" @click="$router.push('./rules/new')">
            {{ $t('button.add') }}
          </TButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="180px">
              <ElButton size="small" type="info" @click="$router.push(`./rules/info/${row.rulesId}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton size="small" type="warning" @click="$router.push(`./rules/${row.rulesId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton size="small" type="danger" @click="dltRules(row.rulesId)">
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

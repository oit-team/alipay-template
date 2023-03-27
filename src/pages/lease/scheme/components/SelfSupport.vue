<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import schema from './schema/self.json'
import { mergeColumns } from '@/utils/helper'
import { getCityList, useSelectAsyncDataSource } from '@/reactions'

const queryRef = ref()

onMounted(() => {
  queryRef.value?.query()
})

async function onDelete(row: any) {
  await ElMessageBox.confirm('要删除该方案吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/delSchemeInfo', { caseId: row.id })
  await queryRef.value?.query()
  ElMessage.success('操作成功')
}

async function onPutaway(row: any) {
  // 0 下架 1 上架
  const casedescript = row.caseState === 1 ? '下架' : '上架'
  await ElMessageBox.confirm(`要${casedescript}该方案吗?`, '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/updateSchemeStatus', {
    caseId: row.id,
    caseState: row.caseState === 1 ? 0 : 1,
  })
  await queryRef.value?.query()
  ElMessage.success('操作成功')
}
const _columns = [
  {
    prop: 'caseCode',
    label: '方案编号',
  },
  {
    prop: 'caseName',
    label: '方案名称',
  },
  {
    prop: 'caseType',
    label: '方案类型',
  },
  {
    prop: 'brandCarModel',
    label: '品牌车系车型',
  },
  {
    prop: 'leasingCity',
    label: '租赁城市',
  },
  {
    prop: 'leaseTerm',
    label: '租期（月）',
  },
  {
    prop: 'rent',
    label: '租金（元）',
  },
  {
    prop: 'cashPledge',
    label: '押金（元）',
  },
  {
    prop: 'expirationDate',
    label: '失效日期',
  },
  {
    prop: 'caseStateMsg',
    label: '状态',
  },
  {
    prop: 'operatorName',
    label: '操作人',
  },
]

const columns = mergeColumns(_columns, {
  caseCode: {
    width: 100,
    showOverflowTooltip: true,
  },
  caseName: {
    width: 150,
    showOverflowTooltip: true,
  },
  caseType: {
    width: 100,
    showOverflowTooltip: true,
  },
  brandCarModel: {
    width: 150,
    showOverflowTooltip: true,
  },
  leaseTerm: {
    width: 100,
    showOverflowTooltip: true,
  },
  rent: {
    width: 100,
    showOverflowTooltip: true,
  },
  cashPledge: {
    width: 100,
    showOverflowTooltip: true,
  },
  expirationDate: {
    width: 150,
    showOverflowTooltip: true,
  },
  caseStateMsg: {
    width: 100,
    showOverflowTooltip: true,
  },
  updateId: {
    width: 100,
    showOverflowTooltip: true,
  },
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :data="{
        caseType: 0, // 自营: 0 t3: 1
      }"
      :key-map="{ data: 'schemeList', total: 'totalCount' }"
      url="/order/scheme/getSchemeList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
        :columns="columns"
        :schema="schema"
      >
        <QueryForm :scope="{ useSelectAsyncDataSource, getCityList }" />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push(`./scheme/new`)">
            新增方案
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="180px">
              <ElButton :disabled="row.caseState === 1" size="small" type="primary" @click="$router.push(`./scheme/${row.id}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton :disabled="row.caseState === 1" size="small" type="danger" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
              <ElButton size="small" type="warning" @click="onPutaway(row)">
                {{ row.caseState === 1 ? '下架' : '上架' }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>


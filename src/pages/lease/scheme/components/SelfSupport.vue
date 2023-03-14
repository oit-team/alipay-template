<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { mergeColumns } from '@/utils/helper'

const schema = {
  type: 'object',
  properties: {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-index': 0,
      'properties': {
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'properties': {
            caseCode: {
              'type': 'string',
              'title': '方案编号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        'xt9ff93t76p': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 1,
          'properties': {
            caseName: {
              'title': '方案名称',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        'xl5ijh663zj': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'properties': {
            leasingCity: {
              'type': 'string',
              'title': '租赁城市',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 3,
          'properties': {
            caseState: {
              'type': 'string',
              'title': '状态',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
      },
    },
  },
}

const queryRef = ref()

async function onDelete(row: any) {
  console.log(row)
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
    prop: 'caseState',
    label: '状态',
  },
  {
    prop: 'updateId',
    label: '操作人',
  },
]
const columns = mergeColumns(_columns, {
  caseCode: {
    width: 150,
    showOverflowTooltip: true,
  },
  caseName: {
    width: 150,
    showOverflowTooltip: true,
  },
  brandCarModel: {
    width: 200,
    showOverflowTooltip: true,
  },
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      url="/order/scheme/getSchemeList"
      :data="{
        caseType: 0,
      }"
      :key-map="{ data: 'schemeList', total: 'totalCount' }"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
        :columns="columns"
        :schema="schema"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push(`./scheme/new`)">
            新增方案
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="180px" fixed="right">
              <ElButton type="primary" size="small" :disabled="row.caseState === 1" @click="$router.push(`./scheme/${row.id}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton type="danger" size="small" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
              <ElButton type="warning" size="small" @click="onPutaway(row)">
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


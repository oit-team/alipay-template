<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { getCityList, useSelectAsyncDataSource } from '@/reactions'

const { t } = useI18n()

enum statusColorMap {
  '', // 审批中
  'text-green-500', // 履约中
  'text-yellow-500', // 已到期
  'text-red-500', // '已作废'
}

const queryRef = ref()

onMounted(() => {
  queryRef.value?.query()
})

async function onDelete(row: any) {
  await ElMessageBox.confirm('确定要删除该方案吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/delSchemeInfo', { caseId: row.id })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

async function onPutaway(row: any) {
  // 0 下架 1 上架
  const casedescript = row.caseState === 1 ? '下架' : '上架'
  await ElMessageBox.confirm(`确定要${casedescript}该方案吗?`, '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/updateSchemeStatus', {
    caseId: row.id,
    caseState: row.caseState === 1 ? 0 : 1,
  })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

const columnsConfig = {
  caseCode: {
    width: 100,
  },
  caseName: {
    width: 150,
  },
  caseType: {
    width: 100,
  },
  brandCarModel: {
    width: 180,
  },
  leaseTerm: {
    width: 100,
  },
  rent: {
    minWidth: 100,
  },
  cashPledge: {
    width: 100,
  },
  expirationDate: {
    width: 150,
  },
  createTime: {
    width: 180,
  },
  caseStateMsg: {
    minWidth: 100,
  },
  updateId: {
    minWidth: 100,
  },
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681103842609"
      :data="{
        caseType: 0, // 自营: 0 t3: 1
      }"

      :key-map="{ data: 'schemeList', total: 'totalCount' }"
      schema-key="1681103889971"
      url="/order/scheme/getSchemeList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm :scope="{ useSelectAsyncDataSource, getCityList }" />
        <QueryToolbar>
          <TButton icon="add" @click="$router.push(`./scheme/new`)">
            新增方案
          </TButton>
        </QueryToolbar>
        <QueryTable>
          <!-- 1 已上架 0 未上架 -->
          <template #content:caseStateMsg="{ row }">
            <div :class="statusColorMap[row.caseState]">
              {{ row.caseStateMsg }}
            </div>
          </template>
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


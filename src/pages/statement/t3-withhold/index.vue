<route>
  meta:
    cache: true
</route>

<script setup lang="ts">
import querySchema from './schema/query.json'

const columns = [
  { prop: 'driverName', label: '姓名' },
  { prop: 'licensePlate', label: '车牌号' },
  { prop: 'statementNumber', label: '账单编号' },
  { prop: 'associatedOrder', label: '关联订单' },
  { prop: 'nowLeaseTerm', label: '当前租期' },
  { prop: 'monthlyRent', label: '账期' },
  { prop: 'endDate', label: '租金' },
  { prop: 'createTime', label: '创建时间' },
]

const queryData = ref()
</script>

<template>
  <div class="h-full p-3">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="{}"
      :schema="querySchema"
      url="/order/withholding/getWithholding"
      @query="queryData = $event"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="120px">
              <ElButton size="small" type="success" @click="$router.push(`./t3-withhold/info/${row.statementNumber}`)">
                {{ $t('button.info') }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

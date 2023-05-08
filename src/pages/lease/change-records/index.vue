<route lang="yaml">
meta:
  cache: true
  </route>

<script lang="ts" setup>
const queryRef = ref()
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      columns-key="1683518035995"
      :key-map="{ data: 'result', total: 'totalCount' }"
      schema-key="1683518111791"
      url="/order/leaseOrder/getVehicleChangeList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="100px">
              <ElButton size="small" type="info" @click="$router.push(`./order/transfer/${row.recordsId}?hide=1`)">
                详情
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

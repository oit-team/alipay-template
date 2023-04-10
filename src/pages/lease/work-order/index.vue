<route>
meta:
  cache: true
</route>

<script setup lang="ts">
const router = useRouter()

// 0 进行中 1已完成 -1 已作废
const statusColorMap: Record<string, string> = {
  '-1': 'text-red-500',
  '1': 'text-green-500',
  '2': '',
}

const routeMap: Record<string, string> = {
  CAR_RENTAL: '/process/car-rental',
  CAR_RETURN: '/process/car-rental-return',
}
async function goDetail(row: any) {
  const path = routeMap[row.flowCode]
  if (!path)
    return ElMessage.warning('未找到对应的流程页面')
  router.push({
    path,
    query: {
      workCode: row.workCode,
      flowCode: row.flowCode,
      // taskCode: row.taskCode,
    },
  })
}

const columnsConfig = {
  workCode: {
    minWidth: 180,
  },
  workName: {
    minWidth: 100,
  },
  orderCode: {
    width: 220,
  },
  taskName: {
    width: 100,
  },
  flowCode: {
    minWidth: 150,
  },
  statusName: {
    minWidth: 100,
  },
  licensePlateNumber: {
    width: 150,
  },
  driverName: {
    minWidth: 100,
  },
  city: {
    minWidth: 100,
  },
  createDate: {
    width: 200,
  },
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681097272956"
      :key-map="{ data: 'resultList', total: 'count' }"
      schema-key="1681097566645"
      url="/workFlow/workFlow/workOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        auto-query="active"
      >
        <QueryForm />
        <QueryTable>
          <template #content:statusName="{ row }">
            <div :class="statusColorMap[row.status]">
              {{ row.statusName }}
            </div>
          </template>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="120px">
              <ElButton size="small" type="success" @click="goDetail(row)">
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

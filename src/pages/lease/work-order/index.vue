<route>
meta:
  cache: true
</route>

<script setup lang="ts">
import querySchema from './schema/query.json'
const router = useRouter()

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
      taskCode: row.taskCode,
    },
  })
}

const columns = [
  {
    prop: 'workCode',
    label: '工单编号',
  },
  {
    prop: 'workName',
    label: '工单名称',
  },
  {
    prop: 'flowCode',
    label: '流程编号',
  },
  {
    prop: 'status',
    label: '状态',
  },
  {
    prop: 'driverId',
    label: '司机ID',
  },
  {
    prop: 'driverCode',
    label: '司机编号',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'city',
    label: '所属城市',
  },
]
const columnsConfig = {
  workCode: {
    width: 250,
    showOverflowTooltip: true,
  },
  workName: {
    width: 150,
    showOverflowTooltip: true,
  },
  flowCode: {
    width: 150,
    showOverflowTooltip: true,
  },
  taskCode: {
    width: 150,
    showOverflowTooltip: true,
  },
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :key-map="{ data: 'resultList', total: 'count' }"
      :schema="querySchema"
      url="/workFlow/workFlow/workOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        auto-query="active"
      >
        <QueryForm />
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="80px">
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

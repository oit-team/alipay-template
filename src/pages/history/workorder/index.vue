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
      // taskCode: row.taskCode,
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
    prop: 'orderCode',
    label: '订单编号',
  },
  {
    prop: 'taskName',
    label: '当前任务',
  },
  {
    prop: 'statusName',
    label: '状态',
  },
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'city',
    label: '所属城市',
  },
  {
    prop: 'createDate',
    label: '创建时间',
  },
]
const columnsConfig = {
  workCode: {
    minWidth: 150,
  },
  workName: {
    minWidth: 100,
  },
  orderCode: {
    width: 150,
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
    width: 150,
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
      url="/workFlow/workFlow/getWorkOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        auto-query="active"
      >
        <QueryForm />
        <QueryTable>
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

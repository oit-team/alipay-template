<script setup lang="ts">
import numeral from 'numeral'
import type { TableColumnCtx } from 'element-plus'

defineProps({
  data: Array,
})

const columns = [
  {
    prop: 'orgName',
    label: '所属公司',
    width: 200,
  },
  {
    prop: 'totalDeductionPoints',
    label: '扣分',
  },
  {
    prop: 'totalFines',
    label: '罚款',
  },
  {
    prop: 'total',
    label: '条数',
  },
  {
    prop: 'vehicleNum',
    label: '运营车辆',
  },
  {
    prop: 'violationsProportion',
    label: '违规占比',
  },
]

interface Product {
  total: number
  orgName: string
  violationsProportion: number
  vehicleNum: number
  totalFines: number
  totalDeductionPoints: number
  orgId: number
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }
    const values = data.map((item: any) => Number(item[column.property]))
    if (!values.every(value => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value))
          return prev + curr
        else
          return prev
      }, 0)}`
      if (index === columns.length - 1) {
        const n3 = Number(sums[columns.length - 3])
        const n2 = Number(sums[columns.length - 2])
        if (n3 > 0 || n2 > 0)
          sums[index] = numeral(n3 / n2).format('0%')
        else
          sums[index] = '0%'
      }
    }
    else {
      sums[index] = '0'
    }
  })

  return sums
}
</script>

<template>
  <div>
    <QueryTable :columns="columns" :data="data" :height="400" show-summary :summary-method="getSummaries">
      <template #content:violationsProportion="{ row }">
        <div>
          {{ row.violationsProportion }}%
        </div>
      </template>
    </QueryTable>
  </div>
</template>

<style lang="scss" scoped></style>

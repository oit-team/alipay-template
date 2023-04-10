<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { getCityList, useSelectAsyncDataSource } from '@/reactions'
import { useUserStore } from '@/store/user'

const { t } = useI18n()

const queryRef = ref()

onMounted(() => {
  queryRef.value?.query()
})

const columnsConfig = {
  orderNo: {
    width: 150,
  },
  brandCarModel: {
    width: 200,
  },
  orderType: {
    minWidth: 100,
  },
  t3CreatTime: {
    width: 200,
  },
  actualEndDate: {
    width: 150,
  },
  endDate: {
    width: 150,
  },
  tenancy: {
    width: 150,
  },
  schemeNo: {
    width: 150,
  },
  carNumber: {
    width: 150,
  },
  t3DriverId: {
    minWidth: 150,
  },
  driverName: {
    minWidth: 100,
  },
  driverMobileNumber: {
    width: 150,
  },
  assetCompany: {
    width: 150,
  },
  vinNo: {
    width: 200,
  },
  deliveryDate: {
    width: 200,
  },
  importUserName: {
    width: 200,
  },
  monthlyRent: {
    width: 100,
  },
  importTime: {
    width: 200,
  },
}

// 导入T3方案
const { files, open } = useFileDialog()

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  axios.post('/order/leaseOrder/importT3LeaseOrder', {
    file: value[0],
    userId: profile?.userId,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(() => {
      ElMessage.success(t('import.success'))
    })
    .catch((err) => {
      ElMessageBox.alert(err.message, '警告', {
        type: 'warning',
      })
    })
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681098546360"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      schema-key="1681098737339"
      url="/order/leaseOrder/getT3LeaseOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm :scope="{ getCityList, useSelectAsyncDataSource }" />
        <QueryToolbar>
          <TButton icon="import" @click="open({ multiple: false })">
            {{ $t('button.import') }}T3租赁订单
          </TButton>
        </QueryToolbar>
        <QueryTable>
          <!-- 点击车牌号跳转到车辆详情 -->
          <template #content:carNumber="{ row, value }">
            <ElLink
              @click=" $router.push({
                path: `./car/info/${row.vehicleId}`,
                query: { carNumber: value },
              }) "
            >
              {{ value }}
            </ElLink>
          </template>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="100px">
              <ElButton size="small" type="success" @click="$router.push(`./order/info/t-three/${row.id}`)">
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


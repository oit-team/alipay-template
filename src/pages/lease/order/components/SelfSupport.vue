<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { transformResponsePush } from '@/utils/helper'

const { t } = useI18n()
const router = useRouter()

const queryRef = ref()

enum statusColorMap {
  '', // 审批中
  'text-green-500', // 履约中
  'text-yellow-500', // 已到期
  'text-red-500', // '已作废'
  'text-orange-500',
  'text-blue-500',
}

// 订单作废
async function onCancellation(row: any) {
  await ElMessageBox.confirm('要作废该订单吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/order/leaseOrder/updateOrderStatue', {
    leaseOrderNo: row.leaseOrderNo,
    orderStatue: 3,
  })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

const relevanceDrawer = ref(false)

const leaseOrderNo = ref('')

// 输入订单编号查询是否绑定
function useOrderInfo() {
  const orderNo = ref()

  const {
    data,
    execute,
  } = useAxios(
    '/order/leaseOrder/getT3LeaseOrder',
    { transformResponse: transformResponsePush(data => data) },
    { immediate: false },
  )

  watch(orderNo, (orderNo) => {
    orderNo && execute({
      data: {
        orderNo,
      },
    })
  })

  return {
    data,
    orderNo,
  }
}

const {
  data: orderInfo,
  orderNo,
} = useOrderInfo()

// 关联、解绑订单列操作
async function onRelevanceOrder(row: any) {
  // 0 未绑定  1 已绑定
  if (row.isAssociated === 0) {
    relevanceDrawer.value = true
    leaseOrderNo.value = row.leaseOrderNo
    orderNo.value = ''
    orderInfo.value = {}
  }
  else {
    await ElMessageBox.confirm('确认是否要解除自营订单与T3订单的绑定关系？', '提示', {
      type: 'warning',
    })
    await axios.post('/order/leaseOrder/addOrdelOrderAssocia', {
      type: 1, // 状态是1已关联 所以要解除
      leaseOrderNo: row.leaseOrderNo,
      orderNo: row.t3OrderNo.trim(),
    })
    await queryRef.value?.query()
    ElMessage.success('解绑成功')
  }
}

async function submitRelevanceOrder() {
  await ElMessageBox.confirm('确定要关联绑定该T3订单吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/order/leaseOrder/addOrdelOrderAssocia', {
    type: 0, // 状态是1已关联 所以要解除
    leaseOrderNo: leaseOrderNo.value,
    orderNo: orderNo.value,
  })
  await queryRef.value?.query()
  ElMessage.success('关联绑定成功！')
  relevanceDrawer.value = false
}

function cancelRelevanceOrder() {
  relevanceDrawer.value = false
  orderInfo.value = {}
  orderNo.value = ''
}

// 点击单项关联订单
function handleRowT3OrderNo(row: any) {
  router.push(`/lease/order/info/t-three/${row.t3LeaseOrderId}`)
}

// 点击操作列工单编号
function handleRowRentalWorkCode(row: any) {
  const flowCode = row.flowCode
  router.push(`/process/car-rental?workCode=${row.rentalWorkCode}&flowCode=${flowCode}&disabled=1`)
}

// 点击退租订单编号跳转详情
function handleRowReturnWorkCode(row: any) {
  const flowCode = row.flowCode
  router.push(`/process/car-rental-return?workCode=${row.returnWorkCode}&flowCode=${flowCode}&disabled=1`)
}

const columnsConfig = {
  caseCode: {
    width: 150,
  },
  leaseTerm: {
    width: 150,
  },
  cashPledge: {
    minWidth: 150,
  },
  updateTime: {
    width: 150,
  },
  vinNo: {
    width: 150,
  },
  rent: {
    minWidth: 150,
  },
  leaseOrderNo: {
    width: 240,
  },
  licensePlateNumber: {
    width: 150,
  },
  createTime: {
    width: 150,
  },
  driverName: {
    minWidth: 150,
  },
  startTime: {
    width: 150,
  },
  orderStatue: {
    minWidth: 100,
  },
  orderStatueName: {
    width: 150,
  },
  endTime: {
    width: 200,
  },
  t3OrderNo: {
    width: 150,
  },
  rentalWorkCode: {
    width: 200,
  },
  returnWorkCode: {
    width: 200,
  },
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681098160963"
      :data="{
        caseType: 0,
      }"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      schema-key="1681098177002"
      url="/order/leaseOrder/getLeaseOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar>
          <TButton icon="apply" link @click="$router.push('/process/car-rental')">
            {{ $t('button.apply') }}租车
          </TButton>
          <TButton icon="apply" link @click="$router.push('/process/car-rental-return')">
            {{ $t('button.apply') }}退车
          </TButton>
        </QueryToolbar>
        <QueryTable>
          <!-- 点击车牌号跳转到车辆详情 -->
          <template #content:licensePlateNumber="{ row, value }">
            <ElLink
              @click=" $router.push({
                path: `./car/info/${row.vehicleId}`,
                query: { carNumber: value },
              }) "
            >
              {{ value }}
            </ElLink>
          </template>
          <template #content:t3OrderNo="{ row }">
            <ElLink @click="handleRowT3OrderNo(row)">
              {{ row.t3OrderNo }}
            </ElLink>
          </template>
          <template #content:rentalWorkCode="{ row }">
            <ElLink @click="handleRowRentalWorkCode(row)">
              {{ row.rentalWorkCode }}
            </ELLink>
          </template>
          <template #content:returnWorkCode="{ row }">
            <ElLink @click="handleRowReturnWorkCode(row)">
              {{ row.returnWorkCode }}
            </ElLink>
          </template>
          <!-- 0 审批中 1 履约中  2 已到期 3 已作废 -->
          <template #content:orderStatueName="{ row }">
            <div :class="statusColorMap[row.orderStatue]">
              {{ row.orderStatueName }}
            </div>
          </template>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" width="180px">
              <ElButton size="small" type="success" @click="$router.push(`./order/info/self-support/${row.id}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElDropdown>
                <ElButton class="el-dropdown-link" type="primary">
                  更多
                  <ElIcon class="el-icon--right">
                    <ArrowDown />
                  </ElIcon>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem>
                      <div @click="$router.push(`/process/car-renewal?orderNo=${row.leaseOrderNo}`)">
                        续租
                      </div>
                    </ElDropdownItem>
                    <ElDropdownItem>
                      <div @click="$router.push(`/lease/order/transfer?orderNo=${row.leaseOrderNo}&vehicleId=${row.vehicleId}`)">
                        换车
                      </div>
                    </ElDropdownItem>
                    <ElDropdownItem>
                      <div
                        type="primary"
                        @click="$router.push({
                          path: '/process/extension-request',
                          query: {
                            leaseOrderNo: row.leaseOrderNo,
                            rentalWorkCode: row.rentalWorkCode,
                          },
                        })"
                      >
                        延期申请
                      </div>
                    </ElDropdownItem>
                    <ElDropdownItem>
                      <div :disabled=" row.isAssociated === 0 && (row.orderStatue === 2 || row.orderStatue === 3)" size="small" type="warning" @click="onRelevanceOrder(row)">
                        {{ row.isAssociated === 0 ? '关联订单' : '解除订单' }}
                      </div>
                    </ElDropdownItem>
                    <ElDropdownItem>
                      <div :disabled="row.orderStatue === 2 || row.orderStatue === 3" size="small" type="danger" @click="onCancellation(row)">
                        订单作废
                      </div>
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
  <ElDrawer
    v-model="relevanceDrawer"
    direction="rtl"
    title="关联订单"
  >
    <div class="p-4">
      <ElCard>
        <template #header>
          <div>
            <span>T3订单编号：</span>
            <ElInput v-model="orderNo" placeholder="请输入T3订单编号" />
          </div>
        </template>
        <div v-if="orderNo && Object.keys(orderInfo).length === 0" class="text-red-500 text-xs py-2 px-4">
          *未找到相关订单,请重新输入
        </div>
        <Descriptions
          v-if="orderInfo && Object.keys(orderInfo).length > 0"
          border
          column="1"
          :data="orderInfo"
          default-text="暂无"
          label-width="130px"
          :options="[
            { label: '司机id', prop: 'driverId' },
            { label: '司机手机号', prop: 'driverPhone' },
            { label: '司机姓名', prop: 'driverName' },
            { label: '车牌号', prop: 'carNumber' },
            { label: '车架号', prop: 'vinNo' },
            { label: '资产公司', prop: 'assetCompany' },
          ]"
        />
      </ElCard>
      <div v-if="orderInfo?.isAssociated === 1" class="text-xs flex my-4">
        <span class="text-red-500 px-2">*该订单已被关联</span>
      </div>
      <div class="p-4 flex justify-around">
        <ElButton :disabled="!orderNo || orderInfo?.isAssociated === 1" type="primary" @click="submitRelevanceOrder()">
          关联
        </ElButton>
        <ElButton type="info" @click="cancelRelevanceOrder()">
          {{ $t('button.cancel') }}
        </ElButton>
      </div>
    </div>
  </ElDrawer>
</template>


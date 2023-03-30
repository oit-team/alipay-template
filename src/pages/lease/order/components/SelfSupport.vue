<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { transformResponsePush } from '@/utils/helper'

const schema
= {
  'type': 'object',
  'properties': {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-index': 0,
      'name': '7t2oddolmd3',
      'x-designable-id': 'zbecpn3oyrz',
      'x-validator': [],
      'x-component-props': {
        maxColumns: 3,
      },
      'properties': {
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'name': '94exvsf2iwc',
          'x-designable-id': 'yppd6g3e59z',
          'properties': {
            orderNo: {
              'type': 'string',
              'title': '订单编号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'orderNo',
              'x-designable-id': 'uwmt4p2jxkg',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {
                colon: false,
              },
            },
          },
        },
        'xt9ff93t76p': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 1,
          'name': 'xt9ff93t76p',
          'x-designable-id': '2gepa9vm7hj',
          'x-validator': [],
          'x-component-props': {},
          'properties': {
            carNumber: {
              'title': '车牌号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'carNumber',
              'x-designable-id': 'h2ztdd8xho4',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {
                colon: false,
              },
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'name': '8yncuhbvicl',
          'x-designable-id': 'dhl2uc5dtei',
          'properties': {
            driverName: {
              'type': 'string',
              'title': '司机姓名',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'driverName',
              'x-designable-id': '3qswva5pmz8',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {
                colon: false,
              },
            },
          },
        },
        'wac1milvyta': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-designable-id': 'wac1milvyta',
          'x-index': 3,
          'properties': {
            schemeNo: {
              'type': 'string',
              'title': '方案编号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {
                colon: false,
              },
              'x-designable-id': '9t5dc851oyr',
              'x-index': 0,
              'name': 'schemeNo',
            },
          },
        },
        '3lox43bzr24': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-validator': [],
          'x-component-props': {},
          'x-designable-id': '3lox43bzr24',
          'x-index': 4,
          'properties': {
            '[startcreateTime,endcreateTime]': {
              'type': 'string',
              'title': '创建时间',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-validator': [],
              'x-component-props': {
                type: 'daterange',
                placeholder: '',
              },
              'x-decorator-props': {
                colon: false,
              },
              'x-designable-id': 'ieg19fxsl6t',
              'x-index': 0,
              'name': '[startcreateTime,endcreateTime]',
            },
          },
        },
      },
    },
  },
  'x-designable-id': 'x3rigs4m5hd',
}

const { t } = useI18n()

const queryRef = ref()

enum statusColorMap {
  '', // 审批中
  'text-green-500', // 履约中
  'text-yellow-500', // 已到期
  'text-red-500', // '已作废'
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

const columns = [
  {
    prop: 'leaseOrderNo',
    label: '订单编号',
  },
  {
    prop: 'orderStatueName',
    label: '订单状态',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vinNo',
    label: '车架号',
  },
  {
    prop: 'caseCode',
    label: '方案编号',
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
    prop: 'startTime',
    label: '起租日期',
  },
  {
    prop: 'endTime',
    label: '终止时间',
  }, {
    prop: 't3OrderNo',
    label: '关联订单',
  },
  {
    prop: 'rentalWorkCode',
    label: '租赁工单编号',
  },
  {
    prop: 'returnWorkCode',
    label: '退租工单编号',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'updateTime',
    label: '更新时间',
  },
]

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
    width: 150,
  },
  returnWorkCode: {
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
      :data="{
        caseType: 0,
      }"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      :schema="schema"
      url="/order/leaseOrder/getLeaseOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton :auto-insert-space="false" link @click="$router.push('/process/car-rental')">
            <template #icon>
              <div class="i-ic:baseline-add-task" />
            </template>
            {{ $t('button.apply') }}租车
          </ElButton>
          <ElButton :auto-insert-space="false" link @click="$router.push('/process/car-rental-return')">
            <template #icon>
              <div class="i-ic:baseline-add-task" />
            </template>
            {{ $t('button.apply') }}退车
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <!-- 0 审批中 1 履约中  2 已到期 3 已作废 -->
          <template #content:orderStatueName="{ row }">
            <div :class="statusColorMap[row.orderStatue]">
              {{ row.orderStatueName }}
            </div>
          </template>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="240px">
              <ElButton size="small" type="success" @click="$router.push(`./order/info/self-support/${row.id}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton size="small" type="warning" @click="onRelevanceOrder(row)">
                {{ row.isAssociated === 0 ? '关联订单' : '解除订单' }}
              </ElButton>
              <ElButton :disabled="row.orderStatue === 2 || row.orderStatue === 3" size="small" type="danger" @click="onCancellation(row)">
                订单作废
              </ElButton>
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
        <div v-if="orderNo && !orderInfo" class="text-red-500 text-xs py-2 px-4">
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


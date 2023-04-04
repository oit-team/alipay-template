<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { downloadFile } from '@oit/utils'
import { useUserStore } from '@/store/user'
import { getCityList, useSelectAsyncDataSource } from '@/reactions'

const { t } = useI18n()

enum statusColorMap {
  '', // 审批中
  'text-green-500', // 履约中
  'text-yellow-500', // 已到期
  'text-red-500', // '已作废'
}
// 搜索框json
const schema = {
  'type': 'object',
  'properties': {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-index': 0,
      'name': '7t2oddolmd3',
      'x-designable-id': 'm2ujwvnd4n3',
      'properties': {
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'name': '94exvsf2iwc',
          'x-designable-id': 'tjsj9rlcs6x',
          'properties': {
            caseCode: {
              'type': 'string',
              'title': '方案编号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'caseCode',
              'x-designable-id': 'lua72g0jziq',
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
          'x-designable-id': '3p0qr6sfqc1',
          'properties': {
            caseName: {
              'title': '方案名称',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'caseName',
              'x-designable-id': 'n8es9vta59y',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {
                colon: false,
              },
            },
          },
        },
        'xl5ijh663zj': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'name': 'xl5ijh663zj',
          'x-designable-id': 'umiatul0ot6',
          'properties': {
            leasingCity: {
              'type': 'string',
              'title': '租赁城市',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-index': 0,
              'name': 'leasingCity',
              'x-designable-id': '7atsa1nbj8w',
              'x-validator': [],
              'x-component-props': {
                'filterable': true,
                'remote': true,
                'reserve-keyword': true,
                'remote-show-suffix': true,
                'placeholder': '请输入租赁城市',
              },
              'x-reactions': '{{useSelectAsyncDataSource(getCityList)}}',
              'x-decorator-props': {
                colon: false,
              },
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 3,
          'name': '8yncuhbvicl',
          'x-designable-id': '0gsa3kgh2ma',
          'properties': {
            caseState: {
              'title': '状态',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {
                colon: false,
              },
              'name': 'caseState',
              'enum': [{
                children: [],
                label: '未上架',
                value: '0',
              }, {
                children: [],
                label: '已上架',
                value: '1',
              }, {
                children: [],
                label: '已失效',
                value: '2',
              }],
              'x-designable-id': 'hf4x7n0xnvi',
              'x-index': 0,
            },
          },
        },
      },
    },
  },
  'x-designable-id': 'x3rigs4m5hd',
}

const queryRef = ref()

onMounted(() => {
  queryRef.value?.query()
})

async function onDelete(row: any) {
  await ElMessageBox.confirm('要删除该方案吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/delSchemeInfo', { caseId: row.id })
  await queryRef.value?.query()
  ElMessage.success('操作成功')
}

async function onPutaway(row: any) {
  // 0 下架 1 上架
  const casedescript = row.caseState === 1 ? '下架' : '上架'
  await ElMessageBox.confirm(`要${casedescript}该方案吗?`, '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/updateSchemeStatus', {
    caseId: row.id,
    caseState: row.caseState === 1 ? 0 : 1,
  })
  await queryRef.value?.query()
  ElMessage.success('操作成功')
}

// 表格的json
const columns = [
  {
    prop: 'caseCode',
    label: '方案编号',
  },
  {
    prop: 'caseName',
    label: '方案名称',
  },
  {
    prop: 'caseType',
    label: '方案类型',
  },
  {
    prop: 'brandCarModel',
    label: '品牌车系车型',
  },
  {
    prop: 'leasingCity',
    label: '租赁城市',
  },
  {
    prop: 'leaseTerm',
    label: '租期（月）',
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
    prop: 'expirationDate',
    label: '失效日期',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'caseStateMsg',
    label: '状态',
  },
  {
    prop: 'operatorName',
    label: '操作人',
  },
]
const columnsConfig = {
  caseCode: {
    width: 150,
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

const exportDialogVisible = ref(false)

// 下载模板
async function downloadModel() {
  const { data } = await axios.get('/order/scheme/getImportTemplate', { responseType: 'arraybuffer' })
  downloadFile(data, 'T3方案导入模板.xls')
}

// 导入方案
const { files, open, reset } = useFileDialog()

const schemeT3Loading = ref(false)
watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  schemeT3Loading.value = true
  axios.post('/order/scheme/importSchemeInfo', {
    file: value[0],
    userId: profile?.userId,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((res) => {
      if (res.data?.addCount || res.data?.failureCount)
        ElMessage.success(`${t('import.success')}, ${res.data?.addCount ? res.data?.addCount : ''}, ${res.data?.failureCount ? res.data?.failureCount : ''}`)
      exportDialogVisible.value = false
    })
    .catch((err) => {
      ElMessageBox.alert(err.message, '警告', {
        type: 'warning',
      })
    }).finally(() => {
      schemeT3Loading.value = false
    })
  reset()
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :data="{
        caseType: 1,
      }"
      :key-map="{ data: 'schemeList', total: 'totalCount' }"
      :schema="schema"
      url="/order/scheme/getSchemeList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm :scope="{ useSelectAsyncDataSource, getCityList }" />
        <QueryToolbar>
          <TButton icon="import" @click="exportDialogVisible = true">
            导入
          </TButton>
        </QueryToolbar>
        <QueryTable v-loading="schemeT3Loading" element-loading-text="数据正在导入...">
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
  <ElDialog
    v-model="exportDialogVisible"
    title="导入T3方案"
    width="25%"
  >
    <ElButton type="primary" @click="open({ multiple: false })">
      导入T3方案
    </ElButton>
    <div class="my-4 text-xs">
      <span class="text-red-500">*</span>点击下方可以下载导入模板
    </div>
    <ElButton size="small" type="success" @click="downloadModel()">
      下载模板
    </ElButton>
  </ElDialog>
</template>


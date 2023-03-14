<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { downloadFile } from '@oit/utils'
import { useUserStore } from '@/store/user'
import { mergeColumns } from '@/utils/helper'

const { t } = useI18n()
// 搜索框json
const schema = {
  type: 'object',
  properties: {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-index': 0,
      'properties': {
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'properties': {
            licensePlateNumber: {
              'type': 'string',
              'title': '方案编号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        'xt9ff93t76p': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 1,
          'properties': {
            vehicleFrameNumber: {
              'title': '方案名称',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        'xl5ijh663zj': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'properties': {
            vehicleBrand: {
              'type': 'string',
              'title': '租赁城市',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 3,
          'properties': {
            createTime: {
              'type': 'string',
              'title': '状态',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
      },
    },
  },
}

const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm('要删除该方案吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/delSchemeInfo', { caseId: row.caseId })
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
const _columns = [
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
    prop: 'caseState',
    label: '状态',
  },
  {
    prop: 'updateId',
    label: '操作人',
  },
]
const columns = mergeColumns(_columns, {
  caseCode: {
    width: 150,
    showOverflowTooltip: true,
  },
  caseName: {
    width: 150,
    showOverflowTooltip: true,
  },
  brandCarModel: {
    width: 200,
    showOverflowTooltip: true,
  },
})

const exportDialogVisible = ref(false)

// 下载模板
async function downloadModel() {
  const { data } = await axios.get('/order/scheme/getImportTemplate', { responseType: 'arraybuffer' })
  downloadFile(data, 'T3方案导入模板.xls')
}

// 导入方案
const { files, open } = useFileDialog()

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  axios.post('/order/scheme/importSchemeInfo', {
    file: value[0],
    userId: profile?.userId,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(() => {
      ElMessage.success(t('import.success'))
      exportDialogVisible.value = false
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
      url="/order/scheme/getSchemeList"
      :data="{
        caseType: 1,
      }"
      :key-map="{ data: 'schemeList', total: 'totalCount' }"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
        :columns="columns"
        :schema="schema"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="exportDialogVisible = true">
            T3方案导入
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="180px" fixed="right">
              <ElButton type="primary" size="small" :disabled="row.caseState === 1" @click="$router.push(`./scheme/${row.id}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton type="danger" size="small" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
              <ElButton type="warning" size="small" @click="onPutaway(row)">
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
      <span class="text-red-500">*</span>导入方案后请选择下载模板
    </div>
    <ElButton type="success" size="small" @click="downloadModel()">
      下载模板
    </ElButton>
  </ElDialog>
</template>


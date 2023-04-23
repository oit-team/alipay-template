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
  const casedescript = row.caseState === 1 ? '下架' : '提交'
  await ElMessageBox.confirm(`要${casedescript}该方案吗?`, '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/updateSchemeStatus', {
    caseId: row.id,
    caseState: row.caseState === 1 ? 0 : 2,
  })
  await queryRef.value?.query()
  ElMessage.success('操作成功')
}

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
  await downloadFile(data, 'T3方案导入模板.xls')
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
    .then(() => {
      ElMessage.success(t('import.success'))
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
      :columns-config="columnsConfig"
      columns-key="1681104007968"
      :data="{
        caseType: 1,
      }"
      :key-map="{ data: 'schemeList', total: 'totalCount' }"
      schema-key="1681104042616"
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
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="260px">
              <!--              <ElButton size="small" type="info" @click="$router.push(`./scheme/info/${row.id}?is=${row.isHeadquarters}`)"> -->
              <!--                {{ row.isHeadquarters === 1 ? '审核' : $t('button.info') }} -->
              <!--              </ElButton> -->
              <ElButton v-if="row.caseState === 2 && row.isHeadquarters === 1" size="small" type="success" @click="$router.push(`./scheme/info/${row.id}?is=${row.isHeadquarters}`)">
                审核
              </ElButton>
              <ElButton v-else size="small" type="info" @click="$router.push(`./scheme/info/${row.id}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton v-if="row.isHeadquarters === 0" :disabled="row.caseState === 1" size="small" type="primary" @click="$router.push(`./scheme/${row.id}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton v-if="row.isHeadquarters === 0" :disabled="row.caseState === 1" size="small" type="danger" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
              <ElButton v-if="row.caseState === 0 && row.isHeadquarters === 0" size="small" type="warning" @click="onPutaway(row)">
                提交审核
              </ElButton>
              <ElButton v-if="row.caseState === 1 && row.isHeadquarters === 0" size="small" type="warning" @click="onPutaway(row)">
                下架
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


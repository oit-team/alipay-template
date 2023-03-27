<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import schema from './schema/indexSearchForm.json'

const { t } = useI18n()

const query = ref<any>()

const columns = [
  {
    prop: 'menuName',
    label: '菜单名称',
  },
  {
    prop: 'menuUrl',
    label: '菜单路径',
  },
  {
    prop: 'menuRemark',
    label: '菜单描述',
  },
  {
    prop: 'menuCode',
    label: '菜单编码',
  },
  {
    prop: 'createDate',
    label: '创建时间',
  },
]

async function dltList(id: string) {
  await ElMessageBox.confirm(t('confirm.delete'), t('tip.info'), {
    type: 'warning',
  })
  await axios.post('/system/menu/delMenuById', {
    menuId: id,
  })
  ElMessage.success('删除成功')
  query.value?.query()
}
</script>

<template>
  <div class="h-full p-3">
    <UseQuery v-slot="attrs" url="/system/menu/getAllMenuList">
      <QueryProvide v-bind="attrs" ref="query" auto-query="active" :columns="columns" :schema="schema">
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./menu/new')">
            {{ $t('button.add') }}
          </ElButton>
          <!-- <ElDivider direction="vertical" /> -->
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="150">
              <ElButton size="small" type="warning" @click="$router.push(`./menu/${row.menuId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton size="small" type="danger" @click="dltList(row.menuId)">
                {{ $t('button.delete') }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

  <style lang="scss" scoped>
  </style>

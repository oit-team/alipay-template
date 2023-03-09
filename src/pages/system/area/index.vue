<route>
  meta:
    cache: true
</route>

<script setup lang="ts">
const queryRef = ref()

const schema = {
  'type': 'object',
  'properties': {
    grqhw98nznf: {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-validator': [],
      'x-component-props': {},
      'x-designable-id': 'grqhw98nznf',
      'properties': {
        'agfbpt98p0b': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-designable-id': 'agfbpt98p0b',
          'properties': {
            tc5wodr0j33: {
              'type': 'string',
              'title': '区域',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
              'x-designable-id': 'tc5wodr0j33',
              'x-index': 0,
            },
          },
          'x-index': 0,
        },
        '3wj34bj49c5': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-validator': [],
          'x-component-props': {},
          'x-designable-id': '3wj34bj49c5',
          'properties': {
            v7tt8ki7ora: {
              'type': 'string',
              'title': '地址',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
              'x-designable-id': 'v7tt8ki7ora',
              'x-index': 0,
            },
          },
          'x-index': 1,
        },
        'v9ocb6tbj0g': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-designable-id': 'v9ocb6tbj0g',
          'properties': {
            sp3nqeuauq3: {
              'type': 'string[]',
              'title': '创建时间',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-validator': [],
              'x-component-props': {
                type: 'daterange',
              },
              'x-decorator-props': {},
              'x-designable-id': 'sp3nqeuauq3',
              'x-index': 0,
            },
          },
          'x-index': 2,
        },
      },
      'x-index': 0,
    },
  },
  'x-designable-id': 'kz22atjmtgk',
}

const columns = [
  {
    label: '区域',
    prop: 'orgName',
  },
  {
    label: '地址',
    prop: 'address',
  },
  {
    label: '创建时间',
    prop: 'createTime',
  },
]
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="query"
      url="/system/org/getTreeOrgList"
      :key-map="{
        data: 'result',
      }"
    >
      <QueryProvide
        v-bind="query"
        ref="queryRef"
        auto-query="active"
        :columns="columns"
        :schema="schema"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary">
            新增
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn label="操作" width="150px">
              <ElButton type="primary">
                编辑
              </ElButton>
              <ElButton type="danger">
                删除
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

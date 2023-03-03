<route>
meta:
  cache: true
</route>

<script setup lang="ts">
</script>

<template>
  <div class="h-full">
    <UseQuery
      v-slot="query"
      url="/system/role/getRoleList"
      column="1677137737909"
      form="1677659603116"
    >
      <QueryProvide v-bind="query" ref="query" auto-query="active">
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary">
            新增
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn label="操作" width="150px">
              <ElButton type="primary" size="small">
                编辑
              </ElButton>
              <ElButton type="danger" size="small">
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

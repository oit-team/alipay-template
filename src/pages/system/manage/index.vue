<script setup lang="ts">
import { QueryProvide } from '@uxuip/element-plus-query'
import { ElTree } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import OrgDrawer from './components/OrgDrawer.vue'
import { OrganizationType } from './enum'
import AuthorizeDrawer from './components/AuthorizeroleDrawer.vue'
import { transformResponsePush } from '@/utils/helper'

interface Tree {
  id: number
  key: string
  label: string
  type: number
  data: any
  children?: Tree[]
}

const { t } = useI18n()
const router = useRouter()

const columnsConfig = {
  createTime: {
    width: 190,
  },
  phoneNum: {
    minWidth: 150,
  },
}

const filterText = ref('')
const activeTree = ref<Tree>()
const queryRef = ref<InstanceType<typeof QueryProvide>>()
const treeRef = ref<InstanceType<typeof ElTree>>()
const orgDrawerRef = ref<InstanceType<typeof OrgDrawer>>()

watch(filterText, () => {
  treeRef.value?.filter(filterText.value)
})

const {
  data: deptList,
  isLoading: treeLoading,
  execute: getDeptList,
} = useAxios(
  '/system/dept/getDeptList',
  { transformResponse: transformResponsePush(data => data.result) },
  {
    immediate: true,
    onSuccess: async () => {
      setTreeChecked()
    },
  },
)

watch(activeTree, () => {
  queryRef.value?.query()
})

const treeData = computed<Tree[]>(() => {
  function formatTree(data: any) {
    return data?.map((item: any) => {
      const id = item.orgId ?? item.deptId
      return {
        id,
        key: `${id}-${item.orgType}`,
        label: item.orgName ?? item.deptName,
        type: item.orgType,
        data: item,
        children: (item.childrenList ?? item.deptVOS) ? formatTree(item.childrenList ?? item.deptVOS) : undefined,
      }
    })
  }
  return formatTree(deptList.value)
})

async function setTreeChecked() {
  await nextTick()
  if (!treeData.value)
    return
  if (!activeTree.value)
    activeTree.value = treeData.value[0]

  treeRef.value?.setCurrentKey(activeTree.value.key, true)
}

const filterNode = (value: string, data: any) => {
  if (!value)
    return true
  return data.label.includes(value)
}

function toAdd() {
  if (activeTree.value?.id) {
    router.push({
      path: './manage/new',
      query: {
        orgId: activeTree.value?.id,
        orgType: activeTree.value?.type,
      },
    })
  }
  else { ElMessage.warning('请选择所属部门') }
}

async function delUser(id: any) {
  await ElMessageBox.confirm(
    t('confirm.delete'),
    t('tip.info'),
    {
      type: 'warning',
    },
  )
  await axios.post('/system/user/delUserById', {
    userId: id,
  })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

async function delTreeItem() {
  await ElMessageBox.confirm(t('confirm.delete'), t('tip.warning'), { type: 'warning' })
  switch (activeTree.value?.type) {
    case OrganizationType.Company:
    case OrganizationType.HeadOffice:
      await axios.post('/system/org/delOrgInfo', { orgId: activeTree.value?.id })
      break
    case OrganizationType.Department:
      await axios.post('/system/dept/delDeptInfo', { deptId: activeTree.value?.id })
      break
  }
  ElMessage.success('删除成功')
  await getDeptList()
}

function handleCommand(command: string) {
  switch (command) {
    case 'new':
      orgDrawerRef.value?.open(activeTree.value, true)
      break
    case 'edit':
      orgDrawerRef.value?.open(activeTree.value, false)
      break
    case 'delete':
      delTreeItem()
      break
  }
}

const authorDrawerRef = ref<InstanceType<typeof AuthorizeDrawer>>()

// 多选数据勾选事件
const checkedUserArr = ref<any[]>()
const checkUserIds = ref('') // 选中的用户ids
const queryDrawerRef = ref<InstanceType<typeof QueryProvide>>()

function handleSelectionListChange(val: any) {
  checkedUserArr.value = val
}

// 点击角色授权按钮
async function openToAuthorize() {
  if (checkedUserArr.value && checkedUserArr.value.length > 0) {
    await nextTick()
    queryDrawerRef.value?.query()

    const ids = checkedUserArr.value.map(item => item.userId)
    checkUserIds.value = ids.join()
    authorDrawerRef.value?.open(checkUserIds)
  }
  else { ElMessage.warning('请先选择要批量授权的用户') }
}
</script>

<template>
  <div class="h-full flex p-2">
    <div v-loading="treeLoading" class="flex flex-col h-full overflow-hidden w-250px">
      <div class="flex gap-2">
        <ElInput v-model.trim="filterText" clearable placeholder="关键字过滤" />
        <ElButton :icon="Refresh" :loading="treeLoading" @click="getDeptList()" />
      </div>
      <ElScrollbar class="flex-basis-0 flex-1 mt-2">
        <ElTree
          ref="treeRef"
          class="tree"
          :data="treeData"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          highlight-current
          node-key="key"
          @node-click="activeTree = $event"
        >
          <template #default="{ data }">
            <div class="w-full flex items-center justify-between pr-2">
              <span>{{ data.label }}</span>
              <ElDropdown
                trigger="click"
                @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <div class="i-ic:outline-more-horiz tree-node-action text-lg" />
                </span>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem v-if="data.type !== OrganizationType.Department" command="new">
                      新增
                    </ElDropdownItem>
                    <ElDropdownItem command="edit">
                      编辑
                    </ElDropdownItem>
                    <ElDropdownItem v-if="data.type !== OrganizationType.HeadOffice" command="delete">
                      删除
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
          </template>
        </ElTree>
      </ElScrollbar>
    </div>

    <ElDivider class="h-auto" direction="vertical" />

    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681104657841"
      :data="{
        orgId: activeTree?.id,
        orgType: activeTree?.type,
      }"
      :key-map="{
        data: 'result',
        total: 'totalCount',
      }"
      schema-key="1681104720025"
      url="/system/user/getUsers"
    >
      <QueryProvide v-bind="attrs" ref="queryRef" auto-query="active">
        <QueryForm />
        <QueryToolbar>
          <TButton icon="add" @click="toAdd">
            {{ $t('button.new') }}
          </TButton>
          <ElTooltip class="item" content="只有管家用户和APP及管家用户才可以授权" effect="dark" placement="top-start">
            <TButton icon="authorize" @click="openToAuthorize()">
              角色授权
            </TButton>
          </ElTooltip>
        </QueryToolbar>
        <QueryTable
          ref="userTableRef"
          :selection="{
            type: 'checkbox',
          }"
          @selection-change="handleSelectionListChange"
        >
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="180px">
              <ElButton size="small" type="info" @click="$router.push(`./manage/${row.userId}`)">
                编辑
              </ElButton>
              <ElButton size="small" type="danger" @click="delUser(row.userId)">
                删除
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>

    <OrgDrawer ref="orgDrawerRef" @done="getDeptList()" />
    <AuthorizeDrawer ref="authorDrawerRef" />
  </div>
</template>

<style lang="scss" scoped>
.tree:deep() {
  .el-tree-node__content {
    height: 32px;
  }

  .tree-node-action {
    visibility: hidden;
  }

  .el-tree-node__content:hover, .is-current > .el-tree-node__content {
    .tree-node-action {
      visibility: visible;
    }
}
}
</style>

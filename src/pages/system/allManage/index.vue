<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import indexSearchForm from './schema/indexSearchForm.json'
import drawerDeptForm from './schema/drawerDeptForm.json'
import type { FormInstance } from 'element-plus'
import { handleSubmitFailed } from '@/utils/actions'

const drawerForm = createForm({
  validateFirst: true,
})
const drawerFormRef = ref<FormInstance>()

const columns = [
  {
    label: '创建时间',
    prop: 'createTime',
  }, {
    label: '真实姓名',
    prop: 'nickName',
  }, {
    label: '性别',
    prop: 'sexName',
  }, {
    label: '手机号',
    prop: 'phoneNum',
  }, {
    label: '用户名',
    prop: 'userName',
  }, {
    label: '部门名称',
    prop: 'deptName',
  }, {
    label: '区域名称',
    prop: 'orgName',
  },
]

const queryRef = ref<any>()

const showPanel = ref(false)

// 部门列表
const deptList = ref([])
// 区域列表
const areaList = ref([])

const handleClickFlag = ref(false)

const now_nodeInfo = ref<any>()
const isNew = ref(false)
const divisionForm = ref<{
  deptName: string
  describe: string
  parentId: number | string
}>({
  deptName: '',
  describe: '',
  parentId: 0,
})
const divisionDrawer = ref(false)

const filterText = ref('')
const curCheckedKey = ref('')
const deptId = ref(0)

// interface Tree {
//   id: number
//   label: string
//   children?: Tree[]
// }

// 树节点搜索过滤
// const filterNode = (value: string, data: Tree) => {
const filterNode = (value: string, data: any) => {
  if (!value)
    return true

  return data.deptName.includes(value)
}

const treeRef = ref()

const orgListLoading = ref(false)

onMounted(async () => {
  await getDeptList()
  await queryRef.value.query()
})

watch(filterText, () => {
  treeRef.value.filter(filterText.value)
})

async function getDeptList() {
  const res = await axios.post('system/dept/getDeptList', {})
  deptList.value = res.data.result
}

function addDivision() {
  isNew.value = true
  divisionForm.value.parentId = 0
  divisionDrawer.value = true
}

// 右键点击部门
function nodeRightClick(_MouseEvent: any, _object: any, Node: any, _VueComponent: any) {
  handleClickFlag.value = true
  now_nodeInfo.value = Node.data
}

// 点击 node 节点 触发
async function nodeClick(data: any) {
  // console.log(data)
  deptId.value = data.deptId
  await queryRef.value.query()
}

// 新增部门
async function onSubmit() {
  if (!drawerFormRef)
    return
  await drawerFormRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      if (isNew.value) {
        await ElMessageBox.confirm('确定新增吗', '提示')
        await axios.post('/system/dept/addDeptInfo', { ...divisionForm.value })
        ElMessage.success('新增成功')
      }
      else {
        await ElMessageBox.confirm('确定修改吗', '提示')
        await axios.post('/system/dept/updateDeptInfo', { ...divisionForm.value })
        ElMessage.success('修改成功')
      }
      divisionDrawer.value = false
      await getDeptList()
    }
  })
}

async function getTreeOrgList() {
  const res = await axios.post('/system/org/getTreeOrgList', {
    pageSize: 1000,
    pageNum: 1,

  })
  areaList.value = res.data.body.result
}

// async function beforeCloseDiv(done: any) {
//   drawerForm.reset()
//   console.log(drawerForm)
//   done()
// }
// 删除部门
async function clickDel() {
  handleClickFlag.value = false
  await ElMessageBox.confirm('确定删除吗', '提示', { type: 'warning' })
  await axios.post('/system/dept/delDeptInfo', { deptId: now_nodeInfo.value.deptId })
  ElMessage.success('删除成功')
  await getDeptList()
}
// 修改部门
async function clickEdit() {
  divisionDrawer.value = true
  handleClickFlag.value = false
  isNew.value = false
  drawerForm.reset()
  nextTick(() => {
    divisionForm.value = cloneDeep(now_nodeInfo.value)
    drawerForm.setValues({ deptName: divisionForm.value.deptName, describe: divisionForm.value.describe }, 'overwrite')
  })
}
// 新增部门
function clickAdd() {
  handleClickFlag.value = false
  nextTick(() => {
    drawerForm.setInitialValues({ deptName: '', describe: '' })
  })
  // drawerForm.deleteInitialValuesIn()
  isNew.value = true
  divisionForm.value.parentId = now_nodeInfo.value.deptId
  divisionDrawer.value = true
}

async function dltUser(id: any) {
  await axios.post('/system/user/delUserById', {
    userId: id,
  })
}
</script>

<template>
  <div class="h-full p-3 flex">
    <!--      左侧树形结构 -->
    <div class="flex flex-col h-full text-sm w-1/6">
      <div class="w-full flex p-2 box-border">
        <ElTooltip content="新增区域部门" placement="top">
          <ElButton circle small type="danger" @click="addDivision">
            <div class="i-ic:round-plus" />
          </ElButton>
        </ElTooltip>
        <ElTooltip content="搜索" placement="top">
          <ElButton circle small type="primary" @click="showPanel = !showPanel">
            <div class="i-ic:sharp-search" />
          </ElButton>
        </ElTooltip>
      </div>
      <div v-show="showPanel" class="p-2 box-border">
        <ElInput v-model.trim="filterText" clearable placeholder="关键字过滤" />
      </div>
      <div ref="orgTree" class="orgTreeBox">
        <ElTree
          ref="treeRef"
          v-if="deptList && deptList.length > 0"
          :current-node-key="curCheckedKey"
          :data="deptList"
          :filter-node-method="filterNode"
          highlight-current
          node-key="deptId"
          :props="{ children: 'childrenList', label: 'deptName' }"
          @node-click="nodeClick"
          @node-contextmenu="nodeRightClick"
        >
          <template #scope="{ data }">
            <span>{{ data.deptName }}</span>
            <span v-if="data.isShop === '2'" style="margin-left:30px;" @click.stop="getTreeOrgList()">
              <div class="i-ri-tabler:refresh" />
            </span>
          </template>
        </ElTree>
        <div v-else class="flex justify-center items-center">
          <div v-if="!orgListLoading" style="line-height:200px;">
            加载中...
          </div>
          <div v-if="orgListLoading" style="line-height:100px;">
            暂无数据
          </div>
        </div>
      </div>
    </div>

    <div class="w-px mx-4 h-full bg-[#DCDFE6]" />

    <div class="flex-1">
      <UseQuery
        v-slot="attrs"
        :data="{ deptId }"
        :key-map="{
          data: 'result',
          total: 'totalCount',
        }"
        url="/system/user/getUsers"
      >
        <QueryProvide v-bind="attrs" ref="queryRef" auto-query="active" :columns="columns" :schema="indexSearchForm">
          <QueryForm />
          <QueryTable>
            <template #actions>
              <QueryActionColumn v-slot="{ row }" label="操作" width="180px">
                <ElButton size="small" type="info" @click="$router.push(`./allManage/details?id=${row.userId}`)">
                  编辑
                </ElButton>
                <ElButton size="small" type="danger" @click="dltUser(row.userId)">
                  删除
                </ElButton>
              </QueryActionColumn>
            </template>
          </QueryTable>
          <QueryPagination />
        </QueryProvide>
      </UseQuery>
    </div>

    <!-- 新增/编辑部门 -->
    <ElDrawer v-model="divisionDrawer" direction="rtl" title="部门信息">
      <div class="h-full flex flex-col p-4 justify-between box-border">
        <FormProvider ref="drawerFormRef" :form="drawerForm">
          <div class="flex flex-col h-full px-4 py-2">
            <FormLayout
              label-col="8"
              wrapper-col="10"
            >
              <UseSchemaField :schema="drawerDeptForm" />
            </FormLayout>
            <div class="mt-auto flex justify-center py-2">
              <Submit size="large" @submit="onSubmit" @submit-failed="handleSubmitFailed">
                保存
              </Submit>
            </div>
          </div>
        </FormProvider>
      </div>
    </ElDrawer>

    <ElDialog
      v-model="handleClickFlag"
      center
      title="操作"
      width="270px"
    >
      <div class="flex justify-around items-center">
        <ElButton size="small" @click="clickAdd">
          新 增
        </ElButton>
        <ElButton size="small" @click="clickEdit">
          编 辑
        </ElButton>
        <ElButton size="small" @click="clickDel">
          删 除
        </ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<style lang="">

</style>

<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import indexSearchForm from './schema/indexSearchForm.json'
import drawerDeptForm from './schema/drawerDeptForm.json'
// import { drawerColumn } from './column/drawerRole.js'
import type { FormInstance } from 'element-plus'
import { handleSubmitFailed } from '@/utils/actions'

const drawerForm = createForm({
  validateFirst: true,
})
const drawerFormRef = ref<FormInstance>()

const { t } = useI18n()

const router = useRouter()

const columns = [{
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
}, {
  label: '创建时间',
  prop: 'createTime',
},
]

const columnsConfig = {
  createTime: {
    width: 190,
  },
  phoneNum: {
    minWidth: 150,
  },
}

const userTableRef = ref()

const queryRef = ref<any>()

const showPanel = ref(false)

// const roleDrawer = ref(false)

// const checkedUserArr = ref<any>([])

// const queryRoleRef = ref()

// 部门列表
const deptList = ref([])
// 区域列表
// const areaList = ref([])

const handleClickFlag = ref(false)

const now_nodeInfo = ref<any>()

const isNewUp = ref(false)
// 是不是新增部门
const isNew = ref(false)
const divisionForm = ref<any>({
  deptName: '',
  describe: '',
  deptId: 0,
  parentId: 0,
})
const divisionDrawer = ref(false)

const filterText = ref('')
const curCheckedKey = ref('')
const deptId = ref(0)

// 树节点搜索过滤
// const filterNode = (value: string, data: Tree) => {
const filterNode = (value: string, data: any) => {
  if (!value)
    return true

  return data.deptName.includes(value)
}

const treeRef = ref()

const orgListLoading = ref(false)

// const roleId = ref<number | string>(0)

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
  isNewUp.value = true
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
  deptId.value = data.deptId
  await nextTick()
  await queryRef.value.query()
}

async function beforeClose(done: any) {
  await drawerForm.reset()
  done()
}

// 新增部门
async function onSubmit(form: any) {
  await ElMessageBox.confirm(isNew.value ? '确定新增吗' : '确定修改吗', '提示')
  const params = { ...form }
  if (isNew.value) {
    params.parentId = divisionForm.value.parentId
  }
  else {
    params.deptId = divisionForm.value.deptId
    params.parentId = divisionForm.value.parentId
  }

  await axios.post(isNew.value ? '/system/dept/addDeptInfo' : '/system/dept/updateDeptInfo', params)

  ElMessage.success('成功')
  divisionDrawer.value = false
  await getDeptList()
}

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
  divisionForm.value = { ...now_nodeInfo.value }
  drawerForm.reset()
  drawerForm.setValues({ deptName: divisionForm.value.deptName, describe: divisionForm.value.describe })
}
// 新增部门
function clickAdd() {
  handleClickFlag.value = false
  isNew.value = true
  divisionForm.value.parentId = now_nodeInfo.value.deptId
  divisionDrawer.value = true
}

async function dltUser(id: any) {
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
  await queryRef.value.query()
  ElMessage.success(t('handle.success'))
}

function toAdd() {
  if (deptId.value) {
    // router.push(`./manage/details/${deptId}`)
    router.push({
      path: './manage/new',
      query: {
        deptId: deptId.value,
      },
    })
  }
  else { ElMessage.warning('请选择所属部门') }
}

// async function getRoleList() {
//   const { data } = await axios.post('/system/role/getRoleList', {
//     pageNum: 1,
//     pageSize: 1000,
//   })
//   roleList.value = data.resultList
// }
// getRoleList()

// async function showRolePower() {
//   console.log(queryRoleRef.value)
//   if (checkedUserArr.value.length === 0) {
//     ElMessage.warning('请先选择要批量授权的用户')
//   }
//   else if (checkedUserArr.value.length === 1) {
//     roleDrawer.value = true
//     roleId.value = checkedUserArr.value[0].roleId
//     await nextTick()
//     queryRoleRef.value?.query()
//   }
//   else {
//     roleId.value = checkedUserArr.value[0].roleId
//     roleDrawer.value = true
//     await nextTick()
//     queryRoleRef.value?.query()
//   }
// }

// 当页勾选以及取消   selection-动态勾选的所有行  row-改变勾选状态的当前项
// function selectUser(selection: any, row: any) {
//   // 从保存项saveCheckList里面寻找,如果找到了row则删除，如果没找到则添加
//   const fitemIndex = checkedUserArr.value.findIndex((item: any) => {
//     return item === row.userId
//   })
//   if (fitemIndex === -1)
//     checkedUserArr.value.push(row.userId)

//   else
//     checkedUserArr.value.splice(fitemIndex, 1)
// }
// // 表格全选内容
// function selectAllUser(val: any) {
//   // 如果为空，则为清除选项状态，此时将table中的所有内容都从saveCheckList移除
//   if (val && val.length === 0) { checkedUserArr.value = [] }

//   else if (val && val.length !== 0 && checkedUserArr.value.length !== 0) {
//     // 如果不为空,且this.checkedUserArr也不为空则从val里面找
//     val.forEach((row: any) => {
//       // 从保存项checkedUserArr里面寻找,如果找到了row则删除，如果没找到则添加
//       const fitemIndex = checkedUserArr.value.findIndex((item: any) => {
//         return item === row.userId
//       })
//       if (fitemIndex !== -1)
//         checkedUserArr.value.push(row.userId)
//     })
//   }
//   else if (val && val.length !== 0 && checkedUserArr.value.length === 0) {
//     val.forEach((row: any) => {
//       checkedUserArr.value.push(row.userId)
//     })
//   }
// }

// 确认授权
// async function confirmBatch() {
//   await axios.post('/system/user/addUserAndRole', {

//   })
// addUserAndRole({
//   roleIds: this.roleId.toString(),
//   userIds: this.userIds.toString(),
//   usRoCode:'1',
// }).then((res) => {
//   if (res.head.status === 0) {
//     this.$message({
//       message: "用户授权成功",
//       type: "success",
//     });
//     this.batchPowerFlag = false;
//   } else {
//     this.$message({
//       message: res.head.msg,
//       type: "warning",
//     });
//   }
// });
// }
</script>

<template>
  <div class="h-full p-3 flex">
    <!--      左侧树形结构 -->
    <div class="flex flex-col h-full text-sm w-[13vw]">
      <div class="w-full flex p-2 box-borde justify-center">
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
            <!-- <span v-if="data.isShop === '2'" style="margin-left:30px;" @click.stop="getTreeOrgList()">
              <div class="i-ri-tabler:refresh" />
            </span> -->
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
        :columns="columns"
        :columns-config="columnsConfig"
        :data="{ deptId }"
        :key-map="{
          data: 'result',
          total: 'totalCount',
        }"
        :schema="indexSearchForm"
        url="/system/user/getUsers"
      >
        <QueryProvide v-bind="attrs" ref="queryRef" auto-query="active">
          <QueryForm />
          <QueryToolbar>
            <ElButton type="primary" @click="toAdd">
              {{ $t('button.new') }}
            </ElButton>
            <!-- <ElTooltip class="item" content="只有管家用户和APP及管家用户才可以授权" effect="dark" placement="top-start">
              <ElButton type="warning" @click="showRolePower">
                角色授权
              </ElButton>
            </ElTooltip> -->
          </QueryToolbar>
          <!-- :selection="{
              type: 'checkbox',
            }"
            @select="selectUser"
            @select-all="selectAllUser" -->
          <QueryTable
            ref="userTableRef"
          >
            <template #actions>
              <QueryActionColumn v-slot="{ row }" label="操作" width="180px">
                <ElButton size="small" type="info" @click="$router.push(`./manage/${row.userId}`)">
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
    <ElDrawer v-model="divisionDrawer" :before-close="beforeClose" direction="rtl" title="部门信息">
      <div class="h-full flex flex-col p-4 justify-between box-border">
        <FormProvider ref="drawerFormRef" :form="drawerForm">
          <div class="flex flex-col h-full px-4 py-2">
            <FormLayout
              label-col="4"
              wrapper-col="14"
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

    <!-- <ElDrawer
      v-model="roleDrawer"
      direction="rtl"
    >
      <template #header>
        <div class="w-full text-center">
          角色授权
        </div>
      </template>
      <div class="w-full h-full p-4">
        <UseQuery
          v-slot="query"
          column="1677137737909"
          :data="{ roleId }"
          url="/system/role/getRoleList"
        >
          <QueryProvide
            v-bind="query"
            ref="queryRoleRef"
            auto-query="active"
          > -->
    <!-- :column="drawerColumn" -->
    <!-- <QueryTable
              :selection="{
                type: 'checkbox',
                width: 60,
              }"
              @select="selectUser"
              @select-all="selectAllUser"
            />
          </QueryProvide>
        </UseQuery>
        <div class="roleTips">
          <i
            class="el-icon-magic-stick"
            style="font-size: 16px; margin-right: 6px"
          />选择单用户时，可查看该用户已授权的角色。
        </div>

        <div class="text-center mt-0">
          <ElButton
            size="small"
            type="primary"
            @click="confirmBatch()"
          >
            确认
          </ElButton>
          <ElButton size="small" @click="cancelBatch()">
            取消
          </ElButton>
        </div>
      </div>
    </ElDrawer> -->

    <ElDialog
      v-model="handleClickFlag"
      center
      title="操作"
      width="270px"
    >
      <div class="flex justify-around items-center">
        <ElButton @click="clickAdd">
          新 增
        </ElButton>
        <ElButton @click="clickEdit">
          编 辑
        </ElButton>
        <ElButton @click="clickDel">
          删 除
        </ElButton>
      </div>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
:deep{
  .el-tooltip{
    padding: 7px !important;
  }
  .el-tree-node{
    padding: 0 5px;
  }
  .el-upload-dragger{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
 .leftTreeCon .orgTreeBox :deep(.el-tree) {
    min-width: 100%;
    padding-right: 6px;
    display: inline-block;
    margin-bottom: 6px;
  }
  .el-tree .el-tree-node__content {
    height: 38px;
  }
  .el-tree-node:focus > .el-tree-node__content {
    color: #1978FE;
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #C5DDFF;
    color: #1978FE;
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content:hover {
    background-color: #F5F7FA;
  }
}
</style>

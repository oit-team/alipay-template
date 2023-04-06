<script setup lang="ts">
import type { FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const userFormRef = ref()

const treeRef = ref()

const isNew = route.params.id === 'new'

const content = isNew ? '新增角色' : '编辑角色'

const allMenuOperationList = ref<any>([])
const openDrawer = ref(false)
const btnDisable = ref(false)
const limitList = ref<any>([])
const limitId = ref<string | number>(0)
const currentMenuName = ref()

const menuList = ref([])
const defaultCheckedKeys = ref([])
const userForm = ref<any>({
  roleName: '',
  roleRemark: '',
  roleId: '',
})
const userFormRules = reactive<FormRules>({
  roleName: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
})

const menuIds = ref<{
  menuId: number | string
  menuOperation: any
  menuName: string
}[]>([])

onMounted(() => {
  getHomeMenuList()

  !isNew && getInfo()
  // if (!isNew) {
  //   userForm.value.roleName = route.query.roleName
  //   userForm.value.roleRemark = route.query.roleName
  //   userForm.value.roleId = route.query.roleId
  // }
})

async function getInfo() {
  const { data } = await axios.post('/system/role/getRoleById', {
    roleId: route.params.id,
  })
  userForm.value = data.resultList
}

// 获取菜单树
async function getHomeMenuList() {
  const con = {
    roleId: route.params.id || '0',
    userId: '0',
    isShowMenu: '0',
  }
  const res = await axios.post('/system/menu/getTreeMenuList', con)
  menuList.value = res.data.resultList
  allMenuOperationList.value = res.data.allMenuOperationList
  // 初始默认勾选项
  defaultCheckedKeys.value = res.data.menuIdList || []
}

async function submit() {
  // const params = { ...form }
  if (!isNew)
    userForm.parentId = route.params.id

  const halfCheckedKeys = treeRef.value.getHalfCheckedNodes() // 半选中的节点所组成的数组
  const checkedKeys = treeRef.value.getCheckedNodes() // 选中的节点所组成的数组

  halfCheckedKeys.forEach((item: any, i: number) => checkedKeys.push(halfCheckedKeys[i]))
  checkedKeys.forEach((item: any) => {
    let menuOperation = ''
    if (item.menuOperation) {
      if (typeof item.menuOperation !== 'string')
        menuOperation = JSON.stringify(item.menuOperation)

      else
        menuOperation = item.menuOperation
    }
    menuIds.value.push({
      menuId: item.menuId,
      menuOperation,
      menuName: item.menuName,
    })
  })
  await axios.post(
    isNew
      ? '/system/role/insertRole'
      : '/system/role/updateRoleById',
    {
      ...userForm.value,
      menuIds: menuIds.value,
    },
  )
  ElMessage.success(t('save.success'))
  router.push('/system/role')
}

function resetForm() {
  userFormRef.value?.resetFields()
}

function authBtn(data: { menuId: string | number; menuOperation: string; menuName: string }) {
  openDrawer.value = true
  const checkedKeys = treeRef.value.getCheckedKeys()
  btnDisable.value = checkedKeys.findIndex((item: any) => item === data.menuId) === -1
  const checkedMenu = allMenuOperationList.value.findIndex((item: { menuId: string | number }) => Number(item.menuId) === data.menuId)
  if (checkedMenu !== -1)
    data.menuOperation = allMenuOperationList.value[checkedMenu].menuOperation

  limitList.value = JSON.parse(data.menuOperation)
  limitId.value = data.menuId
  currentMenuName.value = data.menuName
}

function closeDrawer(done: () => void) {
  menuList.value.forEach((item: any) => {
    if (item.menuId === limitId.value) {
      item.menuOperation = JSON.stringify(limitList.value)
    }
    else if (item.menuId !== limitId.value && item.childrenMenu) {
      item.childrenMenu.forEach((e: any) => {
        if (e.menuId === limitId.value)
          e.menuOperation = JSON.stringify(limitList.value)
      })
    }
  })
  done()
}
</script>

<template>
  <div id="addRole" class="pageCommonStyle page-container text-sm bg-white p-3">
    <ElPageHeader :content="content" @back="$router.back()" />
    <ElDivider />
    <ElForm ref="userFormRef" class="demo-ruleForm" label-width="120px" :model="userForm" :rules="userFormRules">
      <ElFormItem label="角色名称" prop="roleName">
        <ElInput v-model="userForm.roleName" maxlength="10" placeholder="请输入角色名称" style="width:60%;" />
      </ElFormItem>
      <ElFormItem label="角色描述" prop="roleRemark">
        <ElInput v-model="userForm.roleRemark" maxlength="32" placeholder="请输入角色描述" style="width:60%;" />
      </ElFormItem>
      <ElFormItem label="菜单权限">
        <ElTree
          ref="treeRef"
          :data="menuList"
          :default-checked-keys="defaultCheckedKeys"
          default-expand-all
          :expand-on-click-node="false"
          node-key="menuId"
          :props="{
            children: 'childrenMenu',
            label: 'menuName',
          }"
          :show-checkbox="true"
        >
          <template #default="{ data }">
            <span>{{ data.menuName }}</span>
            <div class="ml-2 flex items-center hover:text-[#5cb6ff]">
              <div class="i-cil:hand-point-up" @click.stop="() => authBtn(data)" />
            </div>
          </template>
        </ElTree>
      </ElFormItem>
      <ElFormItem>
        <ElButton icon="el-icon-check" size="small" type="primary" @click="submit()">
          保存
        </ElButton>
        <ElButton icon="el-icon-refresh" size="small" @click="resetForm()">
          重置
        </ElButton>
      </ElFormItem>
    </ElForm>

    <ElDrawer
      v-model="openDrawer"
      :before-close="closeDrawer"
      direction="rtl"
      size="40%"
      :title="`${currentMenuName}--请选择需要授权的按钮`"
    >
      <div class="p-4">
        <div class="flex flex-col gap-2">
          <ElCheckbox
            v-for="(item, index) in limitList"
            :key="index"
            v-model="item.statue"
            :disabled="btnDisable"
            :false-label="0"
            :label="item.operationValue"
            :true-label="1"
          />
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

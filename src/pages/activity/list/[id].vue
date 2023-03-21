<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()

const isNew = route.params.id === 'new'

const activityInfoForm = ref<{
  activityName: string
  startTime: string
  endTime: string
  activityDescription: string
  activityDetails: {
    cashingMethod: string
    number: number | string
    rewardMethod: string
    unit: string
  }[]
}>({
  activityName: '',
  startTime: '',
  endTime: '',
  activityDescription: '',
  activityDetails: [],
})

const activityInfoFormRules = reactive<FormRules>({
  activityName: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
  startTime: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
  endTime: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
})

const drawer = ref(false)

const isAdd = ref(false)

const rulesForm = ref({
  rewardMethod: '',
  number: '',
  unit: '',
  cashingMethod: '',
})

const rulesFormRules = reactive<FormRules>({
  rewardMethod: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
  number: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { type: 'number', message: '数字类型' },
  ],
  unit: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
  cashingMethod: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
  ],
})

// 奖励列表/规则列表
const rulesList = ref<{
  cashingMethod: string
  createTime: string
  rulesId: string | number
  rulesName: string
  rulesType: string | number
  rulesUnit: string
}[]>([])
const activityInfoFormRef = ref<FormInstance>()
const rulesFormRef = ref<FormInstance>()
// drawer 可选规则对象
const selectRules = ref()
// 当前可选兑换 列表
const cashingMethodList = ref([])
// 当前可选单位 列表
const rulesUnit = ref([])
// 活动奖励是否选择 先选择奖励名称
const isDisabled = ref(false)
// 修改活动奖励 Id
const nowEditRulesIndex = ref(0)
// 是不是 drawer 修改活动奖励
const isEditRules = ref(false)

onBeforeMount(() => {
  getRules()
  !isNew && getData()
})

watch(selectRules, async () => {
  cashingMethodList.value = selectRules.value.cashingMethod.split(',')
  rulesUnit.value = selectRules.value.rulesUnit.split(',')
})

async function getData() {
  const res = await axios.post('/order/activity/getActivityMap', {
    activityId: route.params.id,
  })
  activityInfoForm.value = res.data
}

function open(e: any) {
  drawer.value = true
  if (e.row) {
    isAdd.value = true
    nextTick(() => {
      rulesForm.value = cloneDeep(e.row)
      isDisabled.value = false
      nowEditRulesIndex.value = e.$index
    })
    isEditRules.value = true
  }
  else {
    isEditRules.value = false
    isAdd.value = false
    isDisabled.value = true
  }
}

async function getRules() {
  const res = await axios.post('/order/activityRules/getActivityRules', {
    pageNum: 1,
    pageSize: 9999,
  })
  rulesList.value = res.data.resultList
  selectRules.value = rulesList.value[0]
}

const handleClose = (done: () => void) => {
  done()
  rulesFormRef.value?.resetFields()
}

// 这一方法需要规则列表的 规则名称只能是唯一的  如果后面更改逻辑会影响
function changeRules(val: string) {
  selectRules.value = rulesList.value?.find((item: any) => item.rulesName === val)
  if (val) {
    isDisabled.value = false
    rulesForm.value.number = ''
    rulesForm.value.unit = ''
    rulesForm.value.cashingMethod = ''
  }
  else { isDisabled.value = true }
}

async function submit() {
  if (activityInfoForm.value?.activityDetails.length === 0) {
    ElMessage.warning('至少添加一项活动奖励')
    return false
  }
  const url = isNew ? '/order/activity/addActivity' : '/order/activity/updateActivity'
  if (activityInfoFormRef.value) {
    await activityInfoFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        await axios.post(url, {
          ...activityInfoForm.value,
        })
        ElMessage.success('操作成功')
        router.push('/activity/list')
      }
      else { ElMessage.error('请完善信息后再提交') }
    })
  }
}

function submitRules() {
  if (isEditRules.value && activityInfoForm.value) {
    activityInfoForm.value.activityDetails[nowEditRulesIndex.value] = cloneDeep(rulesForm.value)
    drawer.value = false
  }
  else {
    const form = cloneDeep(rulesForm.value)
    activityInfoForm.value?.activityDetails.push(form)
    drawer.value = false
  }
}
</script>

<template>
  <div class="h-full p-3">
    <PageHeader :title="isNew ? '新增活动' : '修改活动'" />
    <div class="text-end mb-2">
      <ElButton type="success" @click="submit">
        {{ $t('button.save') }}
      </ElButton>
    </div>
    <div v-if="activityInfoForm" class="px-4">
      <!-- 顶部三个 -->
      <ElForm
        ref="activityInfoFormRef"
        class="flex justify-between"
        :inline="true"
        :model="activityInfoForm"
        :rules="activityInfoFormRules"
      >
        <ElFormItem label="活动名称" prop="activityName">
          <ElInput v-model="activityInfoForm.activityName" />
        </ElFormItem>
        <ElFormItem label="开始时间" prop="startTime">
          <ElDatePicker
            v-model="activityInfoForm.startTime"
            format="YYYY/MM/DD"
            placeholder="请选择"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
        <ElFormItem label="结束时间" prop="endTime">
          <ElDatePicker
            v-model="activityInfoForm.endTime"
            format="YYYY/MM/DD"
            placeholder="请选择"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
      </ElForm>
      <!-- 活动奖励 -->
      <div class="text-sm text-[#606266] w-full">
        <div class="mb-2">
          活动奖励
        </div>
        <div class="w-full rounded-md p-6 border">
          <ElTable :data="activityInfoForm.activityDetails" max-height="250" style="width: 100%">
            <ElTableColumn label="奖励方式" prop="rewardMethod" />
            <ElTableColumn label="数量" prop="number" />
            <ElTableColumn label="单位" prop="unit" />
            <ElTableColumn label="兑现方式" prop="cashingMethod" />
            <ElTableColumn label="操作" width="120">
              <template #default="scope">
                <ElButton plain type="primary" @click.prevent="open(scope)">
                  {{ $t('button.edit') }}
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
          <div class="text-center">
            <ElButton class="my-2" type="primary" @click="open">
              新增奖励
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 活动说明 -->
      <div class="text-sm text-[#606266] py-4">
        <div class="mb-4">
          活动说明
        </div>
        <ElInput v-model="activityInfoForm.activityDescription" rows="6" type="textarea" />
      </div>
    </div>

    <ElDrawer v-model="drawer" :before-close="handleClose" direction="rtl" title="规则">
      <div class="py-4 px-6">
        <ElForm ref="rulesFormRef" label-width="80" :model="rulesForm" :rules="rulesFormRules">
          <ElFormItem label="规则名称" prop="rewardMethod">
            <ElSelect v-model="rulesForm.rewardMethod" placeholder="请选择" @change="changeRules">
              <ElOption v-for="item in rulesList" :key="item.rulesId" :label="item.rulesName" :value="item.rulesName" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="数量" prop="number">
            <ElInput v-model.number="rulesForm.number" />
          </ElFormItem>
          <ElFormItem label="单位" prop="unit">
            <ElSelect v-model="rulesForm.unit" :disabled="isDisabled" placeholder="请选择">
              <ElOption v-for="(item, index) in rulesUnit" :key="index" :label="item" :value="item" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="兑换方式" prop="cashingMethod">
            <ElSelect v-model="rulesForm.cashingMethod" :disabled="isDisabled" placeholder="请选择">
              <ElOption v-for="(item, index) in cashingMethodList" :key="index" :label="item" :value="item" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="submitRules">
              {{ $t('button.ok') }}
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </ElDrawer>
  </div>
</template>

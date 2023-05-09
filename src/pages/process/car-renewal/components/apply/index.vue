<script setup lang="ts">
import { pick } from 'lodash-es'
import { InputNumber } from '@formily/element-plus'
import { onFieldReact } from '@formily/core'
import type { Field as FieldType } from '@formily/core'
import { useFlowOption } from '@/pages/process/hooks/useFlowOption'
import { transformResponsePush } from '@/utils/helper'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const flowOption = useFlowOption()!
const reviewData = inject('workOrderReview') as Ref<any>
const orderNo = reviewData.value?.leaseOrderBasic?.fatherOrderNo ?? route.query.orderNo
const isReview = flowOption?.isReview
const form = createForm({
  initialValues: reviewData.value?.leaseOrderBasic,
  readOnly: isReview,
  effects() {
    !isReview && onCalcRent()
  },
})

const schemeTypeId = ref(0)
const state = reactive({
  schemeId: reviewData.value?.leaseOrderBasic?.schemeId ?? '',
  activityId: reviewData.value?.leaseOrderBasic?.activityId ?? '',
})

const {
  data: schemeInfo,
  execute: getSchemeInfo,
} = useAxios(
  '/order/scheme/getSchemeInfo',
  { transformResponse: transformResponsePush(data => data.resultMap) },
  { immediate: false },
)
const {
  data: schemeList,
  isLoading: schemeLoading,
  execute: getSchemeList,
} = useAxios(
  '/order/scheme/getLeaseOrderSchemes',
  { transformResponse: transformResponsePush(data => data.schemeList) },
  { immediate: false },
)
const schemeItem = computed(() => schemeInfo.value ?? schemeList.value?.find((item: any) => item.id === state.schemeId))

const {
  data: activityList,
  isLoading: activityLoading,
  execute: getActivityList,
} = useAxios(
  '/order/activity/getActivitys',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)

const {
  data: activityData,
  execute: getActivityMap,
} = useAxios(
  '/order/activity/getActivityMap',
  {},
  { immediate: false },
)

// 优惠信息 账单信息
const {
  data: preferentialList,
  execute: getOrderPreferential,
} = useAxios(
  '/order/leaseOrder/getOrderPreferential',
  {},
  { immediate: false },
)

// 租金查验
const {
  data: orderInfo,
} = useAxios(
  '/order/leaseOrder/selectOrderInfoAndRentInspection',
  {
    data: {
      leaseOrderNo: orderNo,
      selectRentInspectionTag: reviewData.value ? 0 : 1,
    },
  },
)

// 计算欠缴租金
function onCalcRent() {
  onFieldReact('*.unpaidRent', (field) => {
    field = field as FieldType
    field.value = orderInfo.value?.rentInspection?.rentReceivable
       - field.query('*.t3Withholding').value()
        - field.query('*.offlinePay').value()
  })
}

watch(() => state.activityId, (value) => {
  if (!value) {
    activityData.value = undefined
    return
  }

  getActivityMap({
    data: {
      activityId: state.activityId,
    },
  })
})
watch(() => state.schemeId, () => {
  state.activityId = ''
  getActivityList({
    data: {
      schemeId: state.schemeId,
      activityStatue: 1,
    },
  })
})
watch(schemeTypeId, () => {
  // 单独执行重置
  state.schemeId = ''
})
watch(schemeTypeId, () => {
  schemeList.value = []
  getSchemeList({
    data: {
      caseType: schemeTypeId.value,
      caseState: 1,
    },
  })
}, { immediate: true })
watch(() => [state.activityId, state.schemeId], () => {
  preferentialList.value = undefined
  getOrderPreferential({
    data: {
      schemeId: state.schemeId,
      activityId: state.activityId,
      time: orderInfo.value.endTime,
    },
  })
})

flowOption.isReview && init()
function init() {
  getOrderPreferential({
    data: {
      schemeId: state.schemeId,
      activityId: state.activityId,
    },
  })
  state.activityId && getActivityMap({
    data: {
      activityId: state.activityId,
    },
  })
  getSchemeInfo({
    data: {
      caseId: state.schemeId,
    },
  })
}

async function submit(formData: any) {
  const check = [
    [state.schemeId, '请选择方案'],
  ]
  const checkResult = check.find(item => !item[0])
  if (checkResult) {
    ElMessage.error(checkResult[1] as string)
    return
  }

  await ElMessageBox.confirm(t('confirm.submit'), t('tip.info'), {
    type: 'info',
  })

  const params = {
    ...pick(schemeItem.value, [
      'leaseTerm',
      'rent',
      'cashPledge',
      'vehicleAge',
    ]),
    ...pick(preferentialList.value?.preferentialMap, [
      'primaryEndTime',
      'preferentialRent',
      'startTime',
      'remarks',
    ]),
    ...pick(orderInfo.value?.leaseOrder, [
      'vehicleId',
      'driverId',
    ]),
    ...state,
    ...formData,
    fatherOrderNo: orderNo,
    fatherOrderType: 1,
    leaseOrderType: 2,
    time: orderInfo.value?.leaseOrder?.endTime,
  }

  await flowOption.apply(params)

  ElMessage.success(t('tip.success'))
  router.back()
}
</script>

<template>
  <div class="formily-readonly">
    <FormProvider :form="form">
      <FormLayout>
        <PageHeader title="续租申请">
          <template v-if="!isReview" #extra>
            <Submit type="primary" @submit="submit">
              提交
            </Submit>
          </template>
        </PageHeader>
        <div class="p-2 flex flex-col gap-2">
          <ElCard header="订单信息">
            <Descriptions
              border
              :data="orderInfo?.leaseOrder"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '订单编号', prop: 'leaseOrderNo' },
                { label: '车牌号', prop: 'licensePlateNumber' },
                { label: '司机姓名', prop: 'driverName' },
                { label: '订单类型', prop: 'address' },
                { label: '起租日期', prop: 'startTime' },
                { label: '截至日期', prop: 'endTime' },
                { label: '租期', prop: 'leaseTerm' },
                { label: '月租', prop: 'rent' },
              ]"
            />
          </ElCard>
          <ElCard header="租金查验">
            <ObjectField name="appendix">
              <Descriptions
                border
                :data="orderInfo?.rentInspection ?? {}"
                default-text="暂无"
                label-width="130px"
                :options="[
                  { label: '总租金', prop: 'totalBillRent' },
                  { label: '应交租金', prop: 'rentReceivable' },
                  { label: 'T3代扣', prop: 't3Withholding' },
                  { label: '线下收取', prop: 'offlinePay' },
                  { label: '欠缴租金', prop: 'unpaidRent' },
                ]"
              >
                <template #t3Withholding>
                  <Field :component="[InputNumber]" :decorator="[FormItem]" name="t3Withholding" required />
                </template>
                <template #offlinePay>
                  <Field :component="[InputNumber]" :decorator="[FormItem]" name="offlinePay" required />
                </template>
                <template #unpaidRent>
                  <Field :component="[InputNumber]" :decorator="[FormItem]" name="unpaidRent" readonly />
                </template>
              </Descriptions>
            </ObjectField>
          </ElCard>
          <ElCard>
            <template #header>
              <div v-if="isReview">
                方案信息
              </div>
              <div v-else class="flex gap-4">
                <div>
                  <span>方案类型：</span>
                  <ElRadioGroup v-model="schemeTypeId" u-mr-6>
                    <ElRadio :label="0">
                      自营方案
                    </ElRadio>
                    <ElRadio :label="1">
                      T3方案
                    </ElRadio>
                  </ElRadioGroup>
                </div>
                <div>
                  <span>方案：</span>
                  <ElSelect
                    v-model="state.schemeId"
                    clearable
                    default-first-option
                    filterable
                    :loading="schemeLoading"
                    placeholder="请选择方案"
                    reserve-keyword
                  >
                    <ElOption
                      v-for="item in schemeList"
                      :key="item.id"
                      :label="`${item.caseName}/${item.caseCode}`"
                      :value="item.id"
                    />
                  </ElSelect>
                </div>
                <div>
                  <span>活动：</span>
                  <ElSelect
                    v-model="state.activityId"
                    clearable
                    default-first-option
                    filterable
                    :loading="activityLoading"
                    placeholder="请选择活动"
                    reserve-keyword
                  >
                    <ElOption
                      v-for="item in activityList"
                      :key="item.activityId"
                      :label="`${item.activityName}`"
                      :value="item.activityId"
                    />
                  </ElSelect>
                </div>
              </div>
            </template>
            <Descriptions
              border
              :data="schemeItem"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '品牌车系车型', prop: 'brandCarModel', span: 2 },
                { label: '租期（月）', prop: 'leaseTerm' },
                { label: '月租（元）', prop: 'rent' },
                { label: '押金（元）', prop: 'cashPledge' },
                { label: '车龄（年）', prop: 'vehicleAge' },
                { label: '里程（km）', prop: 'mileage' },
              ]"
            />
          </ElCard>
          <ElCard v-if="activityData" header="活动信息">
            <Descriptions
              border
              :data="activityData"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '活动名称', prop: 'activityName' },
                { label: '开始时间', prop: 'startTime' },
                { label: '结束时间', prop: 'endTime' },
                { label: '活动说明', prop: 'activityDescription', span: 3 },
                { label: '活动奖励', prop: 'reward', span: 3 },
              ]"
            >
              <template #reward>
                <QueryTable
                  border
                  :columns="[
                    { label: '奖励类型', prop: 'rewardMethod' },
                    { label: '数量', prop: 'number' },
                    { label: '兑现方式', prop: 'cashingMethod' },
                  ]"
                  :data="activityData?.activityDetails"
                />
              </template>
            </Descriptions>
          </ElCard>
          <ElCard header="租赁信息">
            <Descriptions
              v-if="preferentialList?.preferentialMap"
              border
              :data="preferentialList?.preferentialMap"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '租期（月）', prop: 'leaseTerm' },
                { label: '原月租（元）', prop: 'rent' },
                { label: '优惠月租（元）', prop: 'preferentialRent' },
                { label: '押金（元）', prop: 'cashPledge' },
                { label: '起租日期', prop: 'startTime' },
                { label: '原终止日期', prop: 'primaryEndTime' },
                { label: '终止日期', prop: 'endTime' },
                { label: '备注', prop: 'activityDescription' },
              ]"
            />
            <ElEmpty v-else />
          </ElCard>
          <ElCard header="账单信息">
            <QueryTable
              :columns="[
                { label: '期数', prop: 'numberOfPeriods' },
                { label: '账期', prop: 'accountingPeriod' },
                { label: '月租', prop: 'rent' },
                { label: '备注', prop: 'remarks' },
              ]"
              :data="preferentialList?.orderBill"
            />
          </ElCard>
        </div>
      </FormLayout>
    </FormProvider>
  </div>
</template>

<style lang="scss" scoped>
.formily-element-plus-form-item-feedback-layout-loose:not(.formily-element-plus-form-item-inset) {
  margin-bottom: 0;
}
</style>

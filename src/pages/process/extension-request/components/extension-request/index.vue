<script setup lang="ts">
import dayjs from 'dayjs'
import { onFieldReact } from '@formily/core'
import { DatePicker, Input } from '@formily/element-plus'
import DriverInfo from '@/pages/lease/driver/info/[id].vue'
import VehicleInfo from '@/pages/lease/car/info/[id].vue'
import { useFlowOption } from '@/pages/process/hooks/useFlowOption'

const PreviewText = (props: any) => props.value

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const flowOption = useFlowOption()!

const extensionReview = inject('workOrderReviewExtension') as Ref<any>
const isReview = !!extensionReview.value
const reviewData = computed(() => {
  const data = extensionReview.value?.extension
  return {
    ...data,
    rentInspection: data?.rentInspection && JSON.parse(data.rentInspection),
  }
})

const leaseOrderNo = route.query.leaseOrderNo || reviewData.value?.leaseOrderNo
const workCode = route.query.rentalWorkCode || route.query.workCode

const isDisabled = ref(false)

// 查询第一步上两条描述
const { data } = useAxios('/order/leaseOrder/selectOrderInfoAndRentInspection', {
  method: 'POST',
  data: {
    leaseOrderNo,
    workCode,
    selectRentInspectionTag: 1,
  },
})

const rentInspectionInfo = ref()
if (isReview)
  rentInspectionInfo.value = JSON.parse(extensionReview.value?.extension?.rentInspection)

const form = createForm({
  effects() {
    if (flowOption.isReview)
      return

    onFieldReact('*.unpaidRent', (field: any) => {
      const rentReceivable = field.query('*.rentReceivable').value()
      const t3Withholding = field.query('*.t3Withholding').value()
      const offlinePay = field.query('*.offlinePay').value()
      field.value = (rentReceivable - t3Withholding - offlinePay) || 0
    })

    onFieldReact('extensionDay', (field: any) => {
      const futureDay = dayjs(field.query('extensionEndTime').value()).diff(data.value?.leaseOrder?.endTime, 'day')
      if (futureDay > 0) {
        field.value = futureDay
        isDisabled.value = false
      }
      else {
        field.value = 0
        isDisabled.value = true
      }
    })

    onFieldReact('extensionRent', (field: any) => {
      field.value = field.query('extensionDay').value() * field.query('dayRent').value()
    })
  },
})

// 租金信息
if (flowOption.isReview) {
  form.readOnly = true
  form.setValues(reviewData.value)
}
else {
  watch(data, () => {
    form.setValues({ rentInspection: data.value?.rentInspection })
  })
}

// 监听延期日期做出校验
watch(() => data.value?.leaseOrder?.endTime, async (time) => {
  form.setFieldState('extensionEndTime', {
    validator: [
      { required: true },
      (value) => {
        return dayjs(time).diff(dayjs(value), 'day') > 0
          ? '延期时间不能小于截至时间'
          : true
      },
    ],
  })
})

async function submit(formData: any) {
  const params = {
    leaseOrderNo,
    workCode,
    ...formData,
    rentInspection: JSON.stringify(formData?.rentInspection),
  }

  await ElMessageBox.confirm(t('confirm.submit'), t('tip.info'), {
    type: 'info',
  })

  await flowOption?.apply(params)
  ElMessage.success(t('submit.success'))
  router.back()
}
</script>

<template>
  <div class="flex flex-col">
    <FormProvider :form="form">
      <PageHeader :title="workCode ? `延期申请-${workCode}` : '延期申请'">
        <template #extra>
          <Submit @submit="submit">
            提交
          </Submit>
        </template>
      </PageHeader>
      <ElTabs type="border-card" u-h-full>
        <ElTabPane label="延期申请">
          <div class="flex flex-col gap-2 p-2">
            <ElCard>
              <template #header>
                <div class="card-header">
                  订单信息
                </div>
              </template>
              <Descriptions
                v-if="data?.leaseOrder"
                border
                :data="data?.leaseOrder"
                default-text="暂无"
                label-width="130px"
                :options="[
                  { label: '订单编号', prop: 'leaseOrderNo' },
                  { label: '车牌号', prop: 'licensePlateNumber' },
                  { label: '司机姓名', prop: 'driverName' },
                  { label: '订单类型', prop: 'leaseOrderType' },
                  { label: '起租日期', prop: 'startTime' },
                  { label: '截至日期', prop: 'endTime' },
                  { label: '租期', prop: 'leaseTerm' },
                  { label: '月租', prop: 'rent' },
                ]"
              />
              <div v-else class="min-h-30 flex justify-center items-center">
                暂无数据
              </div>
            </ElCard>
            <ElCard>
              <template #header>
                <div class="card-header">
                  租金查验
                </div>
              </template>
              <ObjectField name="rentInspection">
                <ElDescriptions
                  border
                  :column="5"
                  style="--el-descriptions-label-width: 130px"
                >
                  <ElDescriptionsItem label="总租金">
                    <Field :component="[PreviewText]" name="totalBillRent" />
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="应交租金">
                    <Field :component="[PreviewText]" name="rentReceivable" />
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="T3代扣">
                    <Field :component="[InputNumber]" :decorator="[FormItem]" name="t3Withholding" required />
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="线下收取">
                    <Field :component="[InputNumber]" :decorator="[FormItem]" name="offlinePay" required />
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="欠缴租金">
                    <Field :component="[InputNumber]" :decorator="[FormItem]" name="unpaidRent" readonly />
                  </ElDescriptionsItem>
                </ElDescriptions>
              </ObjectField>
            </ElCard>
            <ElCard>
              <template #header>
                <div class="card-header">
                  延期信息
                </div>
              </template>
              <Descriptions
                border
                :data="[]"
                label-width="130px"
                :options="[
                  { label: '延期截至日期', prop: 'extensionEndTime' },
                  { label: '延期天数', prop: 'extensionDay' },
                  { label: '日租金', prop: 'dayRent' },
                  { label: '延期租金', prop: 'extensionRent' },
                  { label: '备注', prop: 'remarks' },
                ]"
              >
                <template #extensionEndTime>
                  <Field :component="[DatePicker]" :decorator="[FormItem]" name="extensionEndTime" />
                </template>
                <template #extensionDay>
                  <Field :component="[Input]" disabled :initial-value="0" name="extensionDay" />
                </template>
                <template #dayRent>
                  <Field :component="[Input]" :initial-value="0" name="dayRent" />
                </template>
                <template #extensionRent>
                  <Field :component="[Input]" :initial-value="0" name="extensionRent" />
                </template>
                <template #remarks>
                  <Field :component="[Input]" name="remarks" />
                </template>
              </Descriptions>
              <!-- <div v-else class="min-h-30 flex justify-center items-center">
                暂无数据
              </div> -->
            </ElCard>
          </div>
        </ElTabPane>
        <ElTabPane label="司机信息">
          <DriverInfo :driver-id="data?.leaseOrder.driverId" inset />
        </ElTabPane>
        <ElTabPane label="车辆信息">
          <VehicleInfo :car-number="data?.leaseOrder?.licensePlateNumber" inset :vehicle-id="data?.leaseOrder?.vehicleId" />
        </ElTabPane>
      </ElTabs>
    </FormProvider>
  </div>
</template>

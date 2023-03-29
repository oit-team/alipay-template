<script setup lang="ts">
import { pick } from 'lodash-es'
import { workOrderApplySymbol, workOrderInfoSymbol } from '../../types'
import schema from './schema/form.json'
import { transformResponsePush } from '@/utils/helper'
import { transformToUploadFiles, transformUploadData } from '@/utils/actions'

const { t } = useI18n()
const router = useRouter()
const vehicleId = ref()

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/order/returnVehicleOrder/getVehicleMap',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)

const vehicleInfo = computed(() => vehicleList.value?.find((item: any) => item.vehicleId === vehicleId.value))

const form = createForm()
const workOrderApply = inject(workOrderApplySymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const workOrderReview = inject('workOrderReview') as Ref<any>

watch(workOrderReview, (data) => {
  const initData = data?.returnVehicleOrderMap
  vehicleId.value = initData.vehicleId
  vehicleList.value = data?.resultList
  form.setInitialValues({
    ...initData,
    appendix: transformToUploadFiles(initData?.appendix),
  })
  form.readOnly = !!initData
}, { immediate: true })

async function submit(data: any) {
  if (!vehicleInfo.value)
    return ElMessage.error('请选择车辆')

  await workOrderApply?.({
    ...data,
    ...pick(vehicleInfo.value, ['vehicleId', 'driverId', 'leaseOrderNo']),
    appendix: transformUploadData(data.appendix, 'url'),
  })

  ElMessage.success(t('submit.success'))
  router.back()
}
</script>

<template>
  <div
    class="flex flex-col gap-2 p-2"
  >
    <FormProvider :form="form">
      <PageHeader title="申请退租">
        <template v-if="!workOrderInfo?.isReview" #extra>
          <Submit type="primary" @submit="submit" />
        </template>
      </PageHeader>

      <ElCard>
        <template #header>
          <div>
            <span>车牌号：</span>
            <ElSelect
              v-model="vehicleId"
              default-first-option
              filterable
              :loading="vehicleLoading"
              placeholder="请输入内容搜索"
              :readonly="workOrderInfo?.isReview"
              remote
              :remote-method="(v: any) => getVehicleList({ data: { licensePlateNumber: v, pageSize: 10, pageNum: 1 } })"
              remote-show-suffix
              reserve-keyword
            >
              <ElOption
                v-for="item in vehicleList"
                :key="item.vehicleId"
                :label="item.licensePlateNumber"
                :value="item.vehicleId"
              />
            </ElSelect>
          </div>
        </template>
        <Descriptions
          v-if="vehicleInfo"
          border
          :data="vehicleInfo"
          default-text="暂无"
          label-width="130px"
          :options="[
            { label: '车架号', prop: 'vehicleFrameNumber' },
            { label: '司机姓名', prop: 'driverName' },
            { label: '身份证号', prop: 'identityCard' },
            { label: '所属运营商', prop: 'driverOperate' },
            { label: '起租日期', prop: 'startTime' },
            { label: '到租日期', prop: 'endTime' },
          ]"
        />
      </ElCard>

      <ElCard class="whitespace-nowrap">
        <FormLayout class="p-2">
          <ObjectField name="supplementaryData">
            <div
              v-for="item of [
                { groupKey: 'rent', groupName: '租金' },
              ]"
              :key="item.groupKey"
              class="flex"
            >
              <div class="mt-1">
                {{ item.groupName }}：
              </div>
              <div class="grid grid-cols-[200px_200px_200px_1fr] flex-1 gap-2">
                <ObjectField :name="item.groupKey">
                  <Field
                    v-for="field of [
                      { name: '应收金额', key: 'receivable', validator: 'number' },
                      { name: '已收金额', key: 'netReceipts', validator: 'number' },
                      { name: '小计', key: 'subtotal' },
                      { name: '备注', key: 'remarks', required: false },
                    ]"
                    :key="field.name"
                    :component="[Input]"
                    :decorator="[FormItem]"
                    :name="field.key"
                    :required="field.required ?? true"
                    :validator="field.validator"
                  >
                    <template #prepend>
                      {{ field.name }}
                    </template>
                  </Field>
                </ObjectField>
              </div>
            </div>
          </ObjectField>
        </FormLayout>
      </ElCard>

      <ElCard header="退车信息">
        <div class="pt-4">
          <FormLayout
            label-col="5"
          >
            <UseSchemaField :schema="schema" />
          </FormLayout>
        </div>
      </ElCard>
    </FormProvider>
  </div>
</template>

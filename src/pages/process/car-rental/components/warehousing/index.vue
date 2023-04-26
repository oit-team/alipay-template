<script setup lang="ts">
import DriverInfo from '@/pages/lease/driver/info/[id].vue'
import VehicleInfo from '@/pages/lease/car/info/[id].vue'
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '@/pages/process/types'
import vehicleCondition from '~/pages/process/schema/vehicleCondition.json'
import Upload from '~/components/FUpload'
import { useFlowOption } from '@/pages/process/hooks/useFlowOption'

const { t } = useI18n()
const router = useRouter()
const flowOption = useFlowOption()
const workOrderSubmit = inject(workOrderSubmitSymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const isReview = computed(() => workOrderInfo?.value?.isReview)
const form = createForm()

async function submit(formData: any) {
  await workOrderSubmit?.(formData, {
    approvalStatus: 1,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}

onMounted(async () => {
  const { data: vehicleOutboundInfo } = await axios.post('/order/leaseOrder/getVehicleOutboundInfo', {
    workCode: flowOption?.workCode,
  })
  form.setInitialValues(vehicleOutboundInfo)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <FormProvider :form="form">
      <PageHeader :title="`申请租车-${$route.query?.workCode}`">
        <template v-if="!isReview" #extra>
          <Submit type="primary" @submit="submit">
            提交
          </Submit>
        </template>
      </PageHeader>

      <ElTabs class="flex-1" type="border-card">
        <ElTabPane label="附件">
          <FormLayout class="p-2" label-width="6em">
            <div class="flex flex-col gap-2">
              <ElCard header="附件">
                <div class="grid grid-cols-2 p-2">
                  <Field
                    :component="[Upload, {
                      multiple: true,
                      format: 'url',
                      limit: 3,
                    }]"
                    :decorator="[FormItem]"
                    name="driverAnnex"
                    title="司机附件"
                  />
                  <Field
                    :component="[Upload, {
                      multiple: true,
                      format: 'url',
                      limit: 3,
                    }]"
                    :decorator="[FormItem]"
                    name="resList"
                    title="车辆附件"
                  />
                </div>
              </ElCard>
              <ElCard header="车辆情况">
                <div class="p-2 grid grid-cols-4">
                  <ObjectField name="vehicleSupplementary">
                    <UseSchemaField :schema="vehicleCondition" />
                  </ObjectField>
                </div>
              </ElCard>
              <ElCard header="租赁合同">
                <div class="p-2">
                  <Field
                    :component="[Upload, {
                      'list-type': 'text',
                    }]"
                    :decorator="[FormItem]"
                    name="[contractUrl,contractName]"
                  />
                </div>
              </ElCard>
            </div>
          </FormLayout>
        </ElTabPane>
        <ElTabPane label="司机信息">
          <DriverInfo :driver-id="workOrderInfo?.mainParams.driverId" inset />
        </ElTabPane>
        <ElTabPane label="车辆信息">
          <VehicleInfo inset :vehicle-id="workOrderInfo?.mainParams.vehicleId" />
        </ElTabPane>
      </ElTabs>
    </FormProvider>
  </div>
</template>

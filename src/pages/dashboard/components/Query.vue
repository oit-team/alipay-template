<script setup lang="ts">
import { onFormReact, onFormValuesChange } from '@formily/core'
import dayjs from 'dayjs'
import querySchema from './schema/query.json'
import { getCompanyList, getDriverTypeList } from '@/reactions'

const props = defineProps({
  tab: String,
})

const emit = defineEmits<{
  (e: 'query', data: any): void
}>()

const loading = inject<Ref<boolean>>('loading')!

const form = createForm({
  effects() {
    onFormReact(async (form) => {
      const state: boolean[] = []
      form.query('*').forEach(field => state.push((field as any).loading))
      loading.value = state.some(item => item)
      await nextTick()
      !loading.value && emit('query', form.values)
    })

    onFormValuesChange(async () => {
      await nextTick()
      const data = form.values
      emit('query', { ...data })
    })
  },
})

form.setInitialValues({
  startTime: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endTime: dayjs().format('YYYY-MM-DD'),
  time: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
})

watchImmediate(() => props.tab, (tab) => {
  form.setFieldState('[startTime,endTime]', (state) => {
    // state.display = tab === '/dashboard/driver-violation' ? 'visible' : 'none'
    state.hidden = tab !== '/dashboard/driver-violation'
  })
  form.setFieldState('*(time,driverType)', (state) => {
    // state.display = tab === '/dashboard/driver-violation' ? 'none' : 'visible'
    state.hidden = tab === '/dashboard/driver-violation' || tab === '/dashboard/vehicle-rental'
  })
})
</script>

<template>
  <ElCard class="query-card p-2">
    <FormProvider :form="form">
      <FormLayout feedback-layout="none">
        <UseSchemaField :schema="querySchema" :scope=" { getDriverTypeList, getCompanyList }" />
      </FormLayout>
    </FormProvider>
  </ElCard>
</template>

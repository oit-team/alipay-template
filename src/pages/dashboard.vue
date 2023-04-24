<script setup lang="ts">
import Query from './dashboard/components/Query.vue'
import QueryViolation from './dashboard/components/QueryViolation.vue'

const route = useRoute()
const router = useRouter()

const tab = ref(route.path)
const showQuery = ref<Boolean>(false)

watch(tab, () => {
  if (tab.value === '/dashboard/driver-violation')
    showQuery.value = true
  else
    showQuery.value = false

  router.replace(tab.value)
})

const queryData = ref()
provide('queryData', queryData)

const ready = computed(() =>
  queryData.value
    ? Object.values(queryData.value).every(item => item !== undefined)
    : false,
)
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="pt-2 px-2 z-10 flex flex-col gap-2 items-center">
      <ElRadioGroup v-model="tab" class="mx-auto">
        <ElRadioButton label="/dashboard/data">
          数据看板
        </ElRadioButton>
        <ElRadioButton label="/dashboard/driver-classify">
          司机分类看板
        </ElRadioButton>
        <ElRadioButton label="/dashboard/driver-warning">
          司机预警看板
        </ElRadioButton>
        <ElRadioButton label="/dashboard/driver-violation">
          违规看板
        </ElRadioButton>
      </ElRadioGroup>
      <template v-if="showQuery">
        <QueryViolation class="w-full" @query="queryData = $event" />
      </template>
      <template v-else>
        <Query class="w-full" @query="queryData = $event" />
      </template>
    </div>

    <RouterView v-if="ready" class="flex-1 basis-0" view-class="p-2" />
  </div>
</template>

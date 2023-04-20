<script setup lang="ts">
import Query from './dashboard/components/Query.vue'

const route = useRoute()
const router = useRouter()

const tab = ref(route.path)
watch(tab, () => {
  router.replace(tab.value)
})

const queryData = ref()
provide('queryData', queryData)
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
      </ElRadioGroup>
      <Query class="w-full" @query="queryData = $event" />
    </div>

    <RouterView class="flex-1 basis-0" view-class="p-2" />
  </div>
</template>

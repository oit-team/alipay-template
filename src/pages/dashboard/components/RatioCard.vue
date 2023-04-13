<script setup lang="ts">
import numeral from 'numeral'

defineProps({
  header: String,
  value: Number,
  valueFormat: String,
  // 环比
  ratio1: Number,
  // 同比
  ratio2: Number,
})

const arrow = (number: number) => {
  if (number > 0)
    return '↑'
  else if (number < 0)
    return '↓'
}

const color = (number: number) => {
  if (number > 0)
    return 'text-green'
  else if (number < 0)
    return 'text-red'
}
</script>

<template>
  <ElCard class="text-center" shadow="hover" style="--el-card-padding: 8px">
    <template #header>
      <div class="text-primary font-bold">
        {{ header }}
      </div>
    </template>
    <div class="flex h-130px">
      <div class="flex-1 flex-center">
        <UseNumberAnime v-slot="{ value }" :value="value">
          <span class="text-4xl font-bold text-orange">
            {{ numeral(value).format(valueFormat) }}
          </span>
        </UseNumberAnime>
      </div>
      <div class="w-2/5 flex flex-col items-center justify-around py-2">
        <div>
          <div class="text-blue-800 font-bold text-sm">
            环比
          </div>
          <div>
            <UseNumberAnime v-slot="{ value }" :value="ratio1">
              <div class="font-bold" :class="color(value)">
                <span>{{ arrow(value) }}</span>
                <span>{{ value ? numeral(value).format('0[.]00%') : '-' }}</span>
              </div>
            </UseNumberAnime>
          </div>
        </div>
        <div>
          <div class="text-blue-800 font-bold text-sm">
            同比
          </div>
          <div>
            <UseNumberAnime v-slot="{ value }" :value="ratio2">
              <div class="font-bold" :class="color(value)">
                <span>{{ arrow(value) }}</span>
                <span>{{ value ? numeral(value).format('0[.]00%') : '-' }}</span>
              </div>
            </UseNumberAnime>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>

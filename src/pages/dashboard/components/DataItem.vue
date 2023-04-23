<script setup lang="ts">
import numeral from 'numeral'

defineProps({
  value: Number,
  valueFormat: String,
  // 环比
  ratio1: Number,
  // 同比
  ratio2: Number,
  // 垂直布局
  column: Boolean,
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
  <div class="flex text-center" :class="{ 'flex-col': column }">
    <div class="flex-1 flex-center">
      <UseNumberAnime v-slot="{ value }" :value="value">
        <span class="text-2xl font-bold text-orange">
          {{ numeral(value).format(valueFormat) }}
        </span>
      </UseNumberAnime>
    </div>
    <div class="flex items-center justify-around py-2" :class="column ? '' : 'w-2/5 flex-col'">
      <div>
        <div class="text-blue-800 font-bold text-xs">
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
        <div class="text-blue-800 font-bold text-xs">
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
</template>

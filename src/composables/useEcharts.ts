import type { ECBasicOption } from 'echarts/types/dist/shared'
import type { EChartsType } from 'echarts/core'

type Echarts = typeof import('echarts/core')

// option变化
export function useEcharts<Opt extends ECBasicOption>(el: Ref<HTMLElement> | HTMLElement, echarts: Echarts, option: Ref<Opt> | Opt) {
  const chart = ref<EChartsType>()

  onMounted(() => {
    chart.value = echarts.init(unref(el))
    watch(option, () => {
      chart.value?.setOption(unref(option))
    }, {
      immediate: true,
    })
  })

  return {
    chart,
  }
}

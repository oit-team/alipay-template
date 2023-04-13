import gsap from 'gsap'

// 数字动画
export function useNumberAnime(
  value: Ref<number | undefined>,
  options?: {
    duration?: number
    immediate?: boolean
  },
) {
  const {
    immediate = true,
    duration = 1,
  } = options ?? {}
  const showNumber = ref(0)

  watch(
    value,
    (val) => {
      gsap.to(showNumber, {
        duration,
        value: val ?? 0,
      })
    },
    { immediate },
  )

  return {
    value: showNumber,
  }
}

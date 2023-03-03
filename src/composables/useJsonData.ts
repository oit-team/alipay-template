const cache = new Map<string, any>()

export function useJsonData(code?: string) {
  const data = ref<any | null>(null)
  const isLoading = ref(false)

  if (code) {
    const cached = cache.get(code)
    if (cached) {
      data.value = cached
      isLoading.value = false
    }
    else {
      const { data, isLoading } = useAxios(
        '/system/menu/getJsonData',
        {
          method: 'POST',
          data: {
            code,
          },
        },
        {
          immediate: true,
          onError: (error) => {
            Promise.reject(error)
          },
        },
      )

      return {
        data: computed(() => {
          const json = data.value?.body?.jsonData
          const parsed = json ? JSON.parse(json) : null
          parsed && cache.set(code, parsed)
          return parsed
        }),
        isLoading,
      }
    }
  }

  return {
    data,
    isLoading,
  }
}

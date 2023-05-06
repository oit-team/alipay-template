export function useReload() {
  const rendered = ref(true)

  function reload() {
    rendered.value = false
    nextTick(() => {
      rendered.value = true
    })
  }

  return {
    reload,
    rendered,
  }
}

export function useReload() {
  const rendered = ref(true)

  function reload() {
    rendered.value = false
    setTimeout(() => {
      rendered.value = true
    })
  }

  return {
    reload,
    rendered,
  }
}

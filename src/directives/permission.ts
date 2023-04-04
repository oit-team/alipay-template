import type { DirectiveBinding } from 'vue'
import { usePermission } from '@/store/permission'

function checkPermissionDirective(el: HTMLElement, binding: DirectiveBinding) {
  const { arg } = binding
  const { checkPermission } = usePermission()

  if (arg) {
    // 无权限则移除元素
    if (!checkPermission(arg))
      el.parentNode?.removeChild(el)
  }
  else {
    throw new TypeError('need key! Like v-permission:key')
  }
}

export const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermissionDirective(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermissionDirective(el, binding)
  },
}

import { StorageSerializers } from '@vueuse/core'
import { defineStore } from 'pinia'

export type PermissionData = Record<string, boolean>

export const usePermission = defineStore('permission', () => {
  const permissionData = useStorage<PermissionData>('permission', null, undefined, { serializer: StorageSerializers.object })

  function setPermissionData(data: PermissionData) {
    permissionData.value = data
  }

  function checkPermission(key: string) {
    return permissionData.value?.[key] ?? false
  }

  return {
    setPermissionData,
    checkPermission,
  }
})

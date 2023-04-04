import axios from 'axios'
import { defineStore } from 'pinia'
import { setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const profile = ref<{
    userId: number
    userName: string
    orgId: number
    nickName: string
    userRole: number
    phoneNum: number
    sex: string
  }>()

  // 更新用户信息
  const updateUserProfile = async () => {
    const { data } = await axios.post('/system/login/getUserToken')
    profile.value = data
    setToken(data.accessToken)
  }

  // 获取用户信息
  const getUserProfile = async () => {
    !profile.value && await updateUserProfile()
    return profile.value
  }

  // 清除用户信息
  const clearUserProfile = async () => {
    profile.value = undefined
  }

  return {
    profile: readonly(profile),
    updateUserProfile,
    getUserProfile,
    clearUserProfile,
  }
})

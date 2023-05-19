import axios from 'axios'
import { defineStore } from 'pinia'
import { setToken } from '@/utils/auth'

interface UserProfile {
  userId: number
  userName: string
  orgId: number
  nickName: string
  userRole: number
  phoneNum: number
  sex: string
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>()

  const setUserProfile = (data: UserProfile) => {
    profile.value = data
  }

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
    setUserProfile,
    updateUserProfile,
    getUserProfile,
    clearUserProfile,
  }
})

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

  const updateUserProfile = async () => {
    const { data } = await axios.post('/system/login/getUserToken')
    profile.value = data
    setToken(data.accessToken)
  }

  const getUserProfile = async () => {
    !profile.value && await updateUserProfile()
    return profile.value
  }

  return {
    profile,
    updateUserProfile,
    getUserProfile,
  }
})

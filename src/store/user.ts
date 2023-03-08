import axios from 'axios'
import { defineStore } from 'pinia'
import { setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const profile = ref<any>(null)

  const updateUserProfile = async () => {
    const { data } = await axios.post('/system/login/getUserToken')
    profile.value = data.body
    setToken(data.body.accessToken)
  }

  const getUserProfile = async () => {
    !profile.value && await updateUserProfile()
    return profile.value
  }

  return {
    updateUserProfile,
    getUserProfile,
  }
})

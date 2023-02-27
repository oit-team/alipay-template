const TOKEN = 'token'
const storage = sessionStorage

export function isLogin() {
  return !!storage.getItem(TOKEN)
}

export function setToken(newToken: string) {
  storage.setItem(TOKEN, newToken)
}

export function getToken() {
  return storage.getItem(TOKEN)
}

export function clearToken() {
  storage.removeItem(TOKEN)
}

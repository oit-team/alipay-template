import { post } from './index'

export function login(data) {
  return post('appLogin', data)
}

import $axios from '../api/api'
import { IAuthResponse } from '../types/AuthResponse'

export type { AxiosResponse } from 'axios'

export default class AuthService {
  // регистрация
  static async register(username: string, password: string) {
    return $axios.post<IAuthResponse>('/auth/register', { username, password })
  }

  // вход
  static async login(username: string, password: string) {
    return $axios.post<IAuthResponse>('/auth/login', { username, password })
  }

  // выход
  static async logout() {
    return $axios.post('/auth/logout')
  }
}

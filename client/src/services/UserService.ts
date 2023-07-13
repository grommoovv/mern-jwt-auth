import $axios from '../api/api'
import { IUser } from '../types/User'

export default class UserService {
  static fetchUsers() {
    return $axios.get<IUser[]>('/users/get-users')
  }
}

import { FC, ReactNode, createContext, useContext, useState } from 'react'
import { IUser } from '../types/User'
import AuthService from '../services/AuthService'
import axios from 'axios'
import { IAuthResponse } from '../types/AuthResponse'
import { API_URL } from '../api/api'

interface IAuthContext {
  user: IUser | null
  isAuth: boolean
  isLoading: boolean
  checkAuth: () => void
  register: (username: string, password: string) => void
  login: (username: string, password: string) => void
  logout: () => void
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<IAuthContext>({
  user: {} as IUser,
  isAuth: false,
  isLoading: false,
  checkAuth: () => {},
  register: () => {},
  login: () => {},
  logout: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useState<IUser | null>(null)
  const [isAuth, setAuth] = useState(false)

  const checkAuth = async () => {
    setLoading(true)
    try {
      const response = await axios.get<IAuthResponse>(
        `${API_URL}/auth/refresh`,
        {
          withCredentials: true,
        }
      )

      console.log(response)

      localStorage.setItem('token', response.data.accessToken)
      setUser(response.data.user)
      setAuth(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, password: string) => {
    try {
      const response = await AuthService.register(username, password)
      console.log(response)

      localStorage.setItem('token', response.data.accessToken)
      setUser(response.data.user)
      setAuth(true)
    } catch (error) {
      console.log(error)

      // console.log(error.response?.data?.message)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password)
      console.log(response)

      localStorage.setItem('token', response.data.accessToken)
      setUser(response.data.user)
      setAuth(true)
    } catch (error) {
      console.log(error)

      // console.log(error.response?.data?.message)
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('token')
      setUser({} as IUser)
      setAuth(false)
    } catch (error) {
      console.log(error)

      // console.log(error.response?.data?.message)
    }
  }

  const value = { isLoading, user, isAuth, checkAuth, register, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

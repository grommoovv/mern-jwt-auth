import { FC, useEffect, useState } from 'react'
import { Login } from '../components/Login'
import { useAuthContext } from '../context/AuthContext'
import { IUser } from '../types/User'
import UserService from '../services/UserService'

export const App: FC = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const { isLoading, checkAuth, isAuth, user, logout } = useAuthContext()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuth) {
    return <Login />
  }

  return (
    <>
      <div>
        <h1>
          {isAuth
            ? `Пользователь ${user?.username} авторизован`
            : 'пользователь не авторизован'}
        </h1>
        <button onClick={() => logout()}>Выйти</button>

        <button onClick={getUsers}>Получить пользователей</button>
        <ul>
          {users.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

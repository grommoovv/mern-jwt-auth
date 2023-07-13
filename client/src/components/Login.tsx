import { FC, FormEventHandler, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import cls from './Login.module.css'

export const Login: FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { register, login } = useAuthContext()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
  }

  return (
    <>
      <form className={cls.form} onSubmit={handleSubmit}>
        <div className={cls.wrap}>
          <input
            className={cls.input}
            type='text'
            placeholder='Имя пользователя'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={cls.input}
            type='password'
            placeholder='Пароль'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={cls.button}
            onClick={() => login(username, password)}
          >
            Войти
          </button>
          <button
            className={cls.button}
            onClick={() => register(username, password)}
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </>
  )
}

import axios from 'axios'
import dotenv from 'dotenv'

// dotenv.config({ path: '.env.dev' })

export const API_URL = `http://localhost:8080/api`

const $axios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

$axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

export default $axios

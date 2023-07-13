const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const AuthRouter = require('./modules/auth/router/AuthRouter')
const UserRouter = require('./modules/user/router/UserRouter')
const ErrorMiddleware = require('./middlewares/ErrorMiddleware')
const AuthMiddleware = require('./middlewares/AuthMiddleware')
const CorsMiddleware = require('./middlewares/CorsMiddleware')

dotenv.config({ path: '.env.dev' })

const PORT = process.env.PORT || 4000
const CLIENT_URL = process.env.CLIENT_URL
const MONGO_CONNECT = process.env.MONGO_CONNECT

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
// app.use(CorsMiddleware)
// app.use(
//   cors({
//     credentials: true,
//     origin: CLIENT_URL,
//   })
// )
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})
// routes
app.use('/api/auth', AuthRouter)
app.options('/api/users/get-users', (req, res) => {
  res.sendStatus(200)
})
app.use('/api/users', AuthMiddleware, UserRouter)
app.use(ErrorMiddleware)

const start = async () => {
  try {
    // Коннект к базе данных
    await mongoose
      .connect(MONGO_CONNECT)
      .then(() => console.log('Connected To MongoDB'))
      .catch((err) => console.log(`DB Connection Error: ${err}`))
    // Запуск сервера
    app.listen(PORT, () =>
      console.log(`Server started on http://localhost:${PORT}`)
    )
  } catch (e) {
    console.log(e)
  }
}

start()

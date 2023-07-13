const Router = require('express')
const router = new Router()
const { body } = require('express-validator')
const AuthController = require('../controller/AuthController')

const registerValidate = [
  body('username', 'Имя пользователя не может быть пустым').notEmpty(),
  body(
    'password',
    'Пароль должен быть не меньше 8 и не больше 32 символов'
  ).isLength({ min: 8, max: 32 }),
]

router.post('/register', registerValidate, AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/refresh', AuthController.refresh)

module.exports = router

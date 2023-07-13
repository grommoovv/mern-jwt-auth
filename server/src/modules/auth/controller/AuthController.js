const { validationResult } = require('express-validator')
const UserModel = require('../../../models/UserModel')
const AuthService = require('../service/AuthService')
const ApiError = require('../../../errors/ApiError')

class AuthController {
  // регистрация
  async register(req, res, next) {
    try {
      // обработка ошибок при валидации
      const validateErrors = validationResult(req)
      if (!validateErrors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка валидации', validateErrors.array())
        )
      }

      // получение данных и регистрация
      const { username, password } = req.body
      const userData = await AuthService.register(username, password)

      // создание cookie
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }
  // вход
  async login(req, res, next) {
    try {
      const { username, password } = req.body

      const userData = await AuthService.login(username, password)

      // создание cookie
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  // выход
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await AuthService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.status(200).json(token)
    } catch (error) {
      next(error)
    }
  }

  // обновление токена
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const userData = await AuthService.refresh(refreshToken)

      // создание cookie
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }


}

module.exports = new AuthController()

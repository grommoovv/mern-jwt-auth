const bcrypt = require('bcryptjs')
const UserModel = require('../../../models/UserModel')
const UserDto = require('../../../dtos/UserDto')
const TokenService = require('./TokenService')
const ApiError = require('../../../errors/ApiError')

class AuthService {
  // регистрация
  async register(username, password) {
    const candidate = await UserModel.findOne({ username })
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь ${username} уже существует`)
    }

    const hashedPassword = await bcrypt.hash(password, 7)

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    })

    const userDto = new UserDto(newUser)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  // вход
  async login(username, password) {
    const isUserExists = await UserModel.findOne({ username })
    if (!isUserExists) {
      throw ApiError.BadRequest(`Пользователь не найден`)
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isUserExists.password
    )

    if (!isValidPassword) {
      throw ApiError.BadRequest(`Неверный пароль`)
    }

    const userDto = new UserDto(isUserExists)
    const tokens = TokenService.generateTokens({ ...userDto })

    await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  // выход
  async logout(refreshToken) {
    const token = await TokenService.removeRefreshToken(refreshToken)
    return token
  }

  // обновление рефреш токена
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    // валидация токена
    const userData = TokenService.validateRefreshToken(refreshToken)
    // поиск существующего токена
    const isTokenExists = await TokenService.findRefreshToken(refreshToken)

    // проверка валидности токена
    if (!userData || !isTokenExists) {
      throw ApiError.UnauthorizedError()
    }

    // проверка пользователя
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)

    // обновление токена
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }
}

module.exports = new AuthService()

const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const TokenModel = require('../../../models/TokenModel')

dotenv.config({ path: '.env.dev' })

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    })
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '15d',
    })

    return { accessToken, refreshToken }
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  async saveRefreshToken(userId, refreshToken) {
    const isTokenExists = await TokenModel.findOne({ user: userId })

    if (isTokenExists) {
      isTokenExists.refreshToken = refreshToken
      return isTokenExists.save()
    }

    const token = await TokenModel.create({ user: userId, refreshToken })
    return token
  }

  async findRefreshToken(refreshToken) {
    const tokenData = TokenModel.findOne({ refreshToken })
    return tokenData
  }

  async removeRefreshToken(refreshToken) {
    const tokenData = TokenModel.deleteOne({ refreshToken })
    return tokenData
  }
}

module.exports = new TokenService()

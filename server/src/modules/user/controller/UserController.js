const UserService = require('../service/UserService')

class UserController {
  // получение пользователей
  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers()
      return res.json(users)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserController()

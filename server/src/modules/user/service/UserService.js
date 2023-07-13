const UserModel = require("../../../models/UserModel")

class UserService {
  // получение всех пользователей
  async getAllUsers() {
    const users = await UserModel.find()
    return users
  }
}

module.exports = new UserService()

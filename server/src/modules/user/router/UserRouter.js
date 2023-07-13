const Router = require('express')
const router = new Router()
const UserController = require('../controller/UserController')

router.get('/get-users', UserController.getAllUsers)

module.exports = router
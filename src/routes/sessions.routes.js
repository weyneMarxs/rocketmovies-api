const {Router} = require('express')
const SessionsController = require('../controllers/SessionsController')

const sessionsRouter = Router()
const sessionController = new SessionsController()

sessionsRouter.post('/', sessionController.create)

module.exports = sessionsRouter
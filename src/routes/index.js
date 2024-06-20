const { Router } = require('express')
const userRouter = require('./users.routes')
const moviesRouter = require('./movies.routes')
const sessionsRouter = require('./sessions.routes')



const routes = Router()


routes.use('/users', userRouter)
routes.use('/movies', moviesRouter)
routes.use('/sessions', sessionsRouter)
module.exports = routes
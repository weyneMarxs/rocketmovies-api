const { Router } = require('express')
const MoviesController = require('../controllers/MoviesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const moviesRouter = Router()
const moviesController = new MoviesController
moviesRouter.use(ensureAuthenticated)

moviesRouter.post('/', moviesController.create)
moviesRouter.get('/', moviesController.index)
moviesRouter.get('/:id', moviesController.show)
moviesRouter.delete('/:id', moviesController.delete)

module.exports = moviesRouter


const {Router} = require('express')
const multer = require('multer')
const uploadConfig = require('../configs/upload')
const UsersController = require('../controllers/UsersController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const UserAvatarController = require('../controllers/UserAvatarController')
const usersController = new UsersController()
const userAvatarContrtroller = new UserAvatarController()

const userRouter = Router()
const upload = multer(uploadConfig.MULTER)

userRouter.post('/', usersController.create)
userRouter.put('/', ensureAuthenticated, usersController.update)
userRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarContrtroller.update)
userRouter.get('/:user_id', ensureAuthenticated, usersController.index)
// userRouter.delete('/:user_id', ensureAuthenticated, usersController.delete)

module.exports = userRouter
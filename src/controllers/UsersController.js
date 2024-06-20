const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError.js')
const knex = require('../database/knex')

class UsersController {
  async create (req, res) {
    const { name, email, password } = req.body
    const checkUserExists = await knex('users').where({email}).first()
    if(checkUserExists) {
        throw new AppError('Este email já está em uso.')
      }
      
      const hashedPass = await hash(password, 8)
      await knex('users').insert({
        name,
        email,
        password: hashedPass,

      })
    return res.json()
  }


  async index(req, res) {
    const {user_id} = req.params
    
    const {name, email, created_at, avatar } = await knex('users').where('id', user_id).first()

    return res.json({
      name,
      email,
      created_at,
      avatar
    })
  }
  async update(req, res) {
    const {name, email, password, old_password} = req.body
    const user_id = req.user.id

    const user = await knex('users').where({id: user_id}).first()
    const userWithUpdatedEmail = await knex('users').where({email}).first()
    if(!user) {
      throw new AppError('Usuario não encontrado.')
    }
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Esse email está em uso')
    }
    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password) {
      throw new AppError('você precisa informar a senha antiga para definir a nova senha.')
    }
    if(password && old_password) {
      const checkoldPass = await compare(old_password, user.password)
      if(!checkoldPass) {
        throw new AppError('a senha antiga não confere')
      }
      user.password = await hash(password, 8)
    }
    await knex('users').where({id: user_id}).update({
      name: user.name,
      email: user.email,
      password: user.password

    })
    return res.json()
  }

  async delete (req, res) {
    const { user_id } = req.params
    const { password } = req.query
    const user = await knex('users').where('id', user_id).first()
    if(!user) {
      throw new AppError('Usuario não encontrado !')
    }
    const passwordCheck = await compare(password, user.password)
    if(!passwordCheck) {
      throw new AppError('Senha invalida.')
    }
    await knex('users').where('id', user.id).delete()
    res.send('Usuario excluido com sucesso.')
  }
}

module.exports = UsersController
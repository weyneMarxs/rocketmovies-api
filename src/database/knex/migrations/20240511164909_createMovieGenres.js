const knex = require("knex");

exports.up = knex => knex.schema.createTable('genres', table => {
  table.increments('id')
  table.text('name').notNullable()
  table.integer('user_id').references('id').inTable('users')
  table.integer('movie_id').references('id').inTable('movies').onDelete('CASCADE')
})

exports.down = knex => knex.schema.dropTable('genres')
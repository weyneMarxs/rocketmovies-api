const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MoviesController {
  async create (req, res){
    const user_id = req.user.id
    const { title, sinopses, rating, genres } = req.body

    if(rating > 5) {
      throw new AppError('A nota só pode ser de 1 há 5')
    }
    const [movie_id] = await knex('movies').insert({
      title,
      sinopses,
      rating,
      user_id
    })

    const genresInsert = genres.map( name => {
      return {
        movie_id,
        name,
        user_id
      }
    })
    await knex('genres').insert(genresInsert)
    return res.send("Filme cadastrado com sucesso !")
  }

  async show(req, res) {
    const { id } = req.params
    const movie = await knex('movies').where({id}).first() 
    const genres = await knex('genres').where({movie_id: id})
    if(!movie) {
      throw new AppError('Filme não encontrado !', 404)
    }
    return res.json({
      ...movie,
      genres
    })
  }
  async index(req, res) {
    const { title } = req.query
    const user_id  = req.user.id
    let movies

    // if(genres) {
    //   const filterGenres = genres.split(',').map( genre > genre.trim())
    //   movies - await knex('genres')
    //   .select(['movies.id', 'movies.title', 'movies.user_id'])
    //   .where('movies.user_id', user_id).whereLike('movies.title', `%${title}%`).whereIn('name', filterGenres)
    //   .innerJoin('movies', 'movies.id', 'genres.movie_id')
    //   .groupBy('movies.id')
    //   .orderBy('movies.tiles')
    // } else {
    // }
    movies = await knex('movies').where({user_id}).whereLike('title', `%${title}%`).orderBy('created_at')
    const userGenres = await knex('genres').where({user_id})
    const moviesWhithGenres = movies.map(movie => {
      const movieGenres = userGenres.filter(genre => genre.movie_id === movie.id)
      return {
        ...movie,
        genres: movieGenres
      }
    } )
    return res.json(moviesWhithGenres)
  }

  async delete(req, res) {
    const { id } = req.params
    await knex('movies').where({id}).delete()
    return res.json()
  }
}

module.exports = MoviesController
require('express-async-errors')
require('dotenv/config')
const cors = require('cors')
const express = require('express')
const routes = require('./routes/')
const AppError = require('./utils/AppError')
const uploadConfig = require('./configs/upload')

const app = express();
app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)
app.use((error, req, res, next) => {
  if(error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  console.error(error)
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error !'
  })
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`)
})
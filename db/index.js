require('dotenv').config()
const mongoose = require('mongoose')


const url = process.env.MONGO_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(() => {
    console.log('Connection to Mongo DB was successfull')
  })
  .catch((error) => {
    console.log('Error connecting to Mongo DB: ' + error.message)
  })


module.exports = mongoose
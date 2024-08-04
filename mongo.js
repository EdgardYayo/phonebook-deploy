const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
// const password = process.env.PASSWORD


const url =
  `mongodb+srv://allanpazos:${password}@fullstack-helsinki.lpye2sw.mongodb.net/?retryWrites=true&w=majority&appName=fullstack-helsinki`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// if(process.argv.length === 2) {
if(process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log('Phonebook:')
    persons.forEach((person) => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })

  return
}

const person = new Person({
  name: process.argv[2],
  number: process.argv[3],
})


person.save().then(result => {
  console.log('person saved!', result)
  mongoose.connection.close()
})
//const phonebook = require('./db/data')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
morgan.token('body', (req) => Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '')

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let currentPersons = phonebook.phonebook;

// const generateId = () => {
//     const maxId = currentPersons.length > 0 ? Math.max(...currentPersons.map(p => Number(p.id))) : 0;
//     // console.log((Math.random() * maxId).toString());
//     return (Math.random() * maxId).toString();
// }

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const personToFind = await Person.findById(id)
    if(!personToFind) return response.status(404).json({ error: 'Not found' })
    return response.json(personToFind)
  } catch (error) {
    next(error)
  }
})

app.get('/info', (request, response) => {
  let date = new Date()
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'long'
  }

  Person.find({}).then((persons) => {
    response.send(
      `<p>The Phonebook has info for ${persons.length} people</p>
             <br>
             <p>${date.toLocaleString('en-US', options)}</p>
            `
    )
  })
})

app.post('/api/persons', async (request, response, next) => {
  const { body } = request
  try {
    if(!body.name || !body.number) {
      return response.status(400).json({
        error: 'Bad request: name and number are required'
      })
    }

    const personExist = await Person.where({ name: body.name }).findOne()

    if(personExist) {
      return response.status(400).json({
        error: 'Bad request: name must be unique'
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    const savedPerson = await person.save()
    return response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const { id } = request.params
  const { name, number } = request.body

  try {
    const person = {
      name,
      number
    }

    const personUpdated = await Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    return response.json(personUpdated)
  } catch (error) {
    next(error)
  }

})

app.delete('/api/persons/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await Person.findByIdAndDelete(id)
    return response.status(204).end()
  } catch(error) {
    next(error)
  }

})

const erroHandler = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(erroHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log('Server running on ' + PORT + ' port'))

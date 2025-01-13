require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

// Hardcoded data MUST DELETE LATER
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Functions

const idGen = () => {
  let id = Math.floor(Math.random()*1000000000000)

  return String(id)
}

// Middleware
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body-content', function getBodyContent(request, response) {
  const content = JSON.stringify(request.body)
  return content
})
app.use(morgan(':method :url :status :response-time ms - :body-content'))

// Endpoints

app.get('/', (request, response) => {
    response.send("hello!")
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const personsLength = persons.length

    const date = new Date()
  
    const message = `<p>Phonebook has info for ${personsLength} people</p><p>${date}</p>`
    response.send(message)  
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log(id, typeof id)

  Person.findById(id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const {name, number} = request.body
  
  if (!name || !number) {
    return response.status(500).json({error: "invalid format"})
  }

  const person = new Person({
    name,
    number
  })
  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(result => response.status(204).json({message: `id ${id} deleted`}))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const {name, number} = request.body

  Person.findByIdAndUpdate(id, {number: number})
    .then(prevPerson => response.json(prevPerson))
    .catch(error => next(error))
})

// Error handler 
const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({error: "Malformatted id"})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT ? process.env.PORT : 3001

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}. To terminate the server, press Ctrl+C`)
})
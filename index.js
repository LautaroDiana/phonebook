const express = require('express')
const morgan = require('morgan')

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

morgan.token('body-content', function getBodyContent(request, response) {
  const content = JSON.stringify(request.body)
  return content
})
app.use(morgan(':method :url :status :response-time ms - :body-content'))

app.get('/', (request, response) => {
    response.json({
        hello: "World"
    })
})

app.get('/info', (request, response) => {
  const personsLength = persons.length

  const date = new Date()

  const message = `<p>Phonebook has info for ${personsLength} people</p><p>${date}</p>`
  response.send(message)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log(id, typeof id)

  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(400).json({error: "id not found"})
  }
})

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body

  if (!name || !number) {
    response.json({error: "invalid format"})
  } else if (persons.find(person => person.name === name)) {
    response.json({error: `${name} already exists on Phonebook`})
  } else {

    const newPerson = {
      id: idGen(),
      name,
      number: String(number)
    }
  
    persons.push(newPerson)
    response.json(newPerson)  

  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const personToDelete = persons.find(person => person.id === id)

  if (personToDelete) {
    persons = persons.filter(person => person.id !== id)
    response.status(204).json({message: `Person with id=${id} deleted`})
  } else {
    response.status(400).json({error: "id not found"})
  }

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}. To terminate the server, press Ctrl+C`)
})
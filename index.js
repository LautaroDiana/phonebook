const express = require('express')

const app = express()

// Hardcoded data MUST DELETE LATER
const persons = [
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

// Middleware
app.use(express.json())

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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}. To terminate the server, press Ctrl+C`)
})
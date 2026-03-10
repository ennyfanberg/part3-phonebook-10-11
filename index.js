const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 3001


app.use(cors())
app.use(express.json())
//   app.use(morgan('tiny'))
morgan.token('request-body', (req) => {
    if (req.method === 'POST' ){
    return JSON.stringify(req.body)
}
return ''
    })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))


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


  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    response.send('phonebook has info for ' + persons.length + ' people <br><br>' + new Date())
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(typeof id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        return response.status(404).json({ error: 'No person with id ' + id })
        // response.send('No person with id ' + id)
    }
    response.json(person)
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if ((!body.name) || (!body.number)) {
      return response.status(400).json({ 
        error: 'missing name or number ' 
      })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

// delete person with id
app.delete('/api/persons/:id', (request, response) => { 
    const id = request.params.id
    let deletedPerson = persons.filter(person => person.id !== id)
    response.send(deletedPerson)
})

// app.post('/api/persons', (request, response) => {
//     const note = request.body
//     console.log(note)
//     response.json(note)
//   })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Please insert password')
  process.exit(1)
}

const password = process.argv[2]

const baseUrl = `mongodb+srv://lautaro:${password}@cluster0.yvmm2.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(baseUrl)

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<4) {
  // Code to execute if there is no name nor number.
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })

} else {
  // Code to execute if there are name and number given.

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to Phonebook`)
    mongoose.connection.close()
  })
}
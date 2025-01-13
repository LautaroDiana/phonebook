const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')

mongoose.connect(url)
    .then(result => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB: ', error.message))

const personSchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        require: true
    }
    }
)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
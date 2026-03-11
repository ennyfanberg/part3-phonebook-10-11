const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fanny_db_user:${password}@personapp.yv2pty8.mongodb.net/personApp?appName=personApp`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(name && number){
const person = new Person({
  name,
  number,
})

person.save().then(result => {
  console.log(`Added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
}).catch(error => {
  console.log("error saving person", error)
  mongoose.connection.close()
})


}else{
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      }).catch(error => {
          console.log("error fetching person data", error)
          mongoose.connection.close()
        })
}

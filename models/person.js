const mongoose = require('../db')
const { Schema, model } = mongoose
const schemaTransformer = require('../db/schemaUtil')

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(value){
        return /^\d{2,3}-\d{5,}$/.test(value)
      },
      message: (props) => `${props.value} is not a valid phone number! it should be in the format XX-XXXXXX or XXX-XXXXX with at least 8 digits in total`
    },
    required: true
  }
})

schemaTransformer(personSchema)

const Person = model('Person', personSchema)

module.exports = Person
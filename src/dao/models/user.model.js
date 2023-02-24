const mongoose = require('mongoose')

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    githubLogin:{
        type: String,
        unique: true
    }
})

const userModel = mongoose.model(userCollection, userSchema)

module.exports = userModel
const mongoose = require('mongoose')

const messageCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
})

const messageModel = mongoose.model(messageCollection, messageSchema)

module.exports = messageModel
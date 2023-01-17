const mongoose = require('mongoose')
const userScheme = new mongoose.Schema({
    user: {type: String, unigue: true, required: true},
    password: {type: String, required: true}
})
const User = mongoose.model('User',userScheme)

module.exports = User
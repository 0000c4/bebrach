const jwt = require('jsonwebtoken')
const key = require('./key')
module.exports = (token)=>{
    if(!token){return false}
    return jwt.verify(token, key)
}
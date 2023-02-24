const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt')

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.resolve(__dirname, '../public/img'))
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})

const uploader = multer({storage})

//Bcrypt
const createHash = password =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const isValidPassword = (user, password) =>{
    return bcrypt.compareSync(password, user.password)
}

module.exports = {uploader, createHash, isValidPassword}
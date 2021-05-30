const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please Enter a Valid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    role: {
        type: String,
        default: 'customer'
    }
})

userSchema.plugin(uniqueValidator)

//Instance Methods
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken = async function () {

    const token = await jwt.sign(
        {
            _id: this._id.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    )
    return token
}

//Statics Methods
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Email Not Found")
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched) {
        throw new Error("Email or Password is Incorrect")
    }
    return user
}

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
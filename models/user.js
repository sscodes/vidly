const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config'); 


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}


const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(10).max(100).required().email(),
        password: Joi.string().min(7).max(100).required()
    })
    return schema.validate(user);
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validate;

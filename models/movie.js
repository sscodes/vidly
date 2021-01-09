const Joi = require('joi'); 
//required for input validation
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 75,
        trim: true 
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 740
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 740
    }
}));


//validation function
function validate(movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(75).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    })
    return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validate;
const { date } = require('joi');
const Joi = require('joi'); 
//required for input validation
const mongoose = require('mongoose');
const {customerSchema} = require('./customer');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
                isGold: {
                    type: Boolean,
                    required: true
                },
                name: {
                    type: String,
                    required: true,
                    minlength: 3,
                    maxlength: 15,
                    trim: true 
                },
                phone: {
                    type: String,
                    required: true
                }
            }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 75,
                trim: true 
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 740
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));


//validation function
function validate(movie) {
    const schema = Joi.object({
        customerId: Joi.number().required(),
        movieId: Joi.number().required()
    })
    return schema.validate(movie);
}

module.exports.Rental = Rental;
module.exports.validate = validate;
const Joi = require('joi'); 
//required for input validation
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
})

const Customer = mongoose.model('Customer', customerSchema);


//validation function
function validate(customer) {
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(5).required()
    })
    return schema.validate(customer);
}

module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;
module.exports.validate = validate;
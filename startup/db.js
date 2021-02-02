const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
    //the package mongoose returns a Promise
    mongoose.connect("mongodb://localhost/vidly", { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => winston.info('Connected to MongoDB...'));
}
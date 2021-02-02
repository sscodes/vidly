const express = require('express'); 
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app){
    app.use(express.json());

    app.use('/api/genres', genres); //use genres module in place of /api/genres
    app.use('/api/customers', customers);  //use customers module in place of /api/customers
    app.use('/api/movies', movies);  //use movies module in place of /api/movies
    app.use('/api/rentals', rentals);  //use rentals module in place of /api/rentals
    app.use('/api/users', users);  //use users module in place of /api/users
    app.use('/api/auth', auth);  //use auth module in place of /api/auth

    app.use(error);
}

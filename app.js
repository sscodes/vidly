require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('config');
const express = require('express');     //requiring the express framework
const app = express();
const error = require('./middleware/error');

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly'}));

if(!config.get('jwtPrivateKey'))
{
    console.log('FATAL ERROR: jwtPrivateKey is not defined...');
    process.exit(1);
}

//the package mongoose returns a Promise
mongoose.connect("mongodb://localhost/vidly", { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err));

app.use(express.json());

app.use('/api/genres', genres); //use genres module in place of /api/genres
app.use('/api/customers', customers);  //use customers module in place of /api/customers
app.use('/api/movies', movies);  //use movies module in place of /api/movies
app.use('/api/rentals', rentals);  //use rentals module in place of /api/rentals
app.use('/api/users', users);  //use users module in place of /api/users
app.use('/api/auth', auth);  //use auth module in place of /api/auth

app.use(error);


//creating environment variable
const port = process.env.PORT || 4774;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})

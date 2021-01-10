const mongoose = require('mongoose');
const Joi = require('joi');     //required for input validation
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const express = require('express');     //requiring the express framework
const { boolean } = require('joi');
const app = express();



//the package mongoose returns a Promise
mongoose.connect("mongodb://localhost/vidly", { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err));

app.use(express.json());

app.use('/api/genres', genres); //use genres module in place of /api/genres
app.use('/api/customers', customers);  //use customers module in place of /api/customers
app.use('/api/movies', movies);  //use customers module in place of /api/movies
app.use('/api/rentals', rentals);  //use customers module in place of /api/movies


//creating environment variable
const port = process.env.PORT || 4774;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})

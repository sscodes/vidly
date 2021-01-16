const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');     //requiring the express framework
const app = express();



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


//creating environment variable
const port = process.env.PORT || 4774;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})

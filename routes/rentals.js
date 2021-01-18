const express = require('express');     //requiring the express framework
const route = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Movie} = require('../models/movie');
const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');

Fawn.init(mongoose);

//Create a rental
route.post('/', async (req,res) => {
    //input validation
    const result = validate(req.body);
    if (!result)
        return res.status(400).send(result.error.details[0].message);

    //check the validity of objectId of customer and movie
    if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
        return res.status(400).send(`customerId with value "${req.body.customerId}" fails to match the required pattern... `)
    if(!mongoose.Types.ObjectId.isValid(req.body.movieId))
        return res.status(400).send(`movieId with value "${req.body.movieId}" fails to match the required pattern... `)

    //if valid, check presence of movie and customer.

    const customer = await Customer.findById(req.body.customerId);
    if(!customer)
        return res.status(400).send('Invalid Customer');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie)
        return res.status(400).send('Invalid Movie');

    if(movie.numberInStock === 0)
    return res.status(400).send('The movie is out of stock');

    //format it a.c.t. database
    const rental = new Rental({
        customer: {
            _id: customer._id,
            isGold: customer.isGold,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    //add to database
    try     //to handle validation exceptions
    {
        new Fawn.Task()
                .save('rentals', rental)
                .update('movies', { _id: movie._id}, {
                    $inc: { numberInStock: -1 }
                })
                .run();

        //show the added rental
        res.send(rental);
    }
    catch(ex)
    {
        res.status(500).send('Something failed...');
    }
});


//Read the whole rentals
route.get('/', async (req,res) => {
    const rentals = await Rental.find().sort('-dateOut');
    //send the whole rentals database
    res.send(rentals);
});

module.exports = route;

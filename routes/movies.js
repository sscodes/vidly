const express = require('express');     //requiring the express framework
const route = express.Router();
const mongoose = require('mongoose');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const {Movie, validate} = require('../models/movie');

//Create a movie
route.post('/', auth, async (req,res) => {
    //input validation
    const result = validate(req.body);
    if (!result)
        return res.status(400).send(result.error.details[0].message);
        
    //check the validity of objectId of genre
    if(!mongoose.Types.ObjectId.isValid(req.body.genreId))
        return res.status(400).send(`genreId with value "${req.body.genreId}" fails to match the required pattern... `)

    //if valid, check presence of genre.

    const genre = await Genre.findById(req.body.genreId);
    if(!genre)
        return res.status(400).send('Invalid Genre');

    //format it a.c.t. database
    const movie = new Movie({
        title: req.body.title,
        genre: {
            id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    //add to database
    try     //to handle validation exceptions
    {
        await movie.save();   
        //show the added movie
        res.send(movie);
    }
    catch(err)
    {
        for(field in err.errors)
        {
            res.status(400).send(err.errors[field].message);
        }
    }
});


//Read the whole movies
route.get('/', async (req,res) => {
    const movies = await Movie.find().sort({title:1});
    //send the whole movies database
    res.send(movies);
});

//Read a movie
route.get('/:id', async (req, res) => {
    const movie =   await Movie.findById(req.params.id);
    //checking if route parameter === any of the id in movies array.
    //if not found
    if(!movie)   
    return res.status(404).send('The Movie was unavailable.');    //send error
    
    //else
    res.send(movie);  //send object
});


//Update a movie
route.put('/:id', auth, async (req, res) => {
    //input validation
    if (!validate(req.body))
    {
        res.status(400).send(results.error.details[0].message);
        return;
    }

    //if valid, check presence of genre.

    const genre = await Genre.findById(req.body.genreId);
    if(!genre)
        return res.status(400).send('Invalid Genre');

    //check existense
    const movie = await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title, genre: { id: genre._id, name: genre.name } }, { new: true });
    
    if(!movie)    //if not found
    return res.status(404).send('The Movie was unavailable.');

    //show the updated movie
    res.send(movie)
});


//Delete a movie
route.delete('/:id', auth, async (req,res) => {
    //check existence
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie)    //if not found
    return res.status(404).send('The Movie was unavailable.');

    //if exists

    //send the deleted movie
    res.send(movie);
});

module.exports = route;

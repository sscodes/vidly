/*
route to CRUD a collection of all the sign ups to our service.
*/

const express = require('express');     //requiring the express framework
const route = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const { Genre, validate} = require('../models/genre');

//Create a genre
route.post('/', auth, async (req,res) => {
    //input validation
    const result = validate(req.body);
    if (!result)
        return res.status(400).send(result.error.details[0].message);

    //if valid

    //format it a.c.t. database
    const genre = new Genre({
        name: req.body.name
    });

    //add to database
    try     //to handle validation exceptions
    {
        await genre.save();   
        //show the added genre
        res.send(genre);
    }
    catch(err)
    {
        for(field in err.errors)
        {
            res.status(400).send(err.errors[field].message);
        }
    }
});


//Read the whole genres
route.get('/', async (req, res) => {
    throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort({name:1});
    //send the whole genres database
    res.send(genres);
});

//Read a genre
route.get('/:id', async (req, res) => {
    const genre =   await Genre.findById(req.params.id);
    //checking if route parameter === any of the id in genres array.
    //if not found
    if(!genre)   
    return res.status(404).send('The Genre was unavailable.');    //send error
    
    //else
    res.send(genre.name);  //send object
});


//Update a genre
route.put('/:id', auth, async (req, res) => {
    //input validation
    if (!validate(req.body))
    {
        res.status(400).send(results.error.details[0].message);
        return;
    }

    //check existense
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    
    if(!genre)    //if not found
    return res.status(404).send('The Genre was unavailable.');

    //show the updated genre
    res.send(genre)
});


//Delete a genre
route.delete('/:id', [auth, admin], async (req,res) => {
    //check existence
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre)    //if not found
    return res.status(404).send('The Genre was unavailable.');

    //if exists

    //send the deleted genre
    res.send(genre);
});

module.exports = route;

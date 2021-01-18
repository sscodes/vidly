/*
route to create a collection of all the sign ups to our service.
*/

const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { User, validate } = require('../models/user');

route.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

route.post('/', async (req, res) => {
    const result = validate(req.body);  //valdating the request a.c.t. user.js
    if (!result)
        return res.status(400).send(result.error.details[0].message);

    //checking if email exists
    let userSearch = await User.findOne({ email: req.body.email }); 
    if(userSearch)
        return res.status(400).send('Email already registered...');

    //creating a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });

    //crypting the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try
    {
        //saving the user to the database
        await user.save();

        //logging in after user signed up
        const token = user.generateAuthToken(); //creating a token

        //assigning the token to header and sending response
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
    }
    catch(err)
    {
        for(field in err.errors)
        {
            res.status(400).send(err.errors[field].message);
        }
    }
});

module.exports = route;

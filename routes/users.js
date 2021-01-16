const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

route.post('/', async (req, res) => {
    const result = validate(req.body);
    if (!result)
        return res.status(400).send(result.error.details[0].message);

    let userSearch = await User.findOne({ email: req.body.email });
    if(userSearch)
        return res.status(400).send('Email already registered...');

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try
    {
        await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(err)
    {
        for(field in err.errors)
        {
            res.status(400).send(err.errors[field].message);
        }
    }
});

route.get('/', async (req, res) => {
    const users = await User.find();

    res.send(users);
});

module.exports = route;

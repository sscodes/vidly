const Joi = require('joi');
const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

route.post('/', async (req, res) => {
    const result = validate(req.body);
    if (!result)
        return res.status(400).send(result.error.details[0].message);

    let userSearch = await User.findOne({ email: req.body.email });
    if(!userSearch)
        return res.status(400).send('Invalid email or password...');

    const validPassword = await bcrypt.compare(req.body.password, userSearch.password);
    if(!validPassword)
        return res.status(400).send('Invalid email or password...');

    res.send(true);
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(10).max(100).required().email(),
        password: Joi.string().min(7).max(100).required()
    })
    return schema.validate(user);
}

module.exports = route;
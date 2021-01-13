const express = require('express');     //requiring the express framework
const route = express.Router();
const mongoose = require('mongoose');
const { Customer , validate} = require('../models/customer');

//Create a customer
route.post('/', async (req,res) => {
    //input validation
    const result = validate(req.body);
    if (!result)
        return res.status(400).send(result.error.details[0].message);

    //if valid

    //format it a.c.t. database
    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    //add to database
    try     //to handle validation exceptions
    {
        await customer.save();   
        //show the added customer
        res.send(customer);
    }
    catch(err)
    {
        for(field in err.errors)
        {
            res.status(400).send(err.errors[field].message);
        }
    }
});


//Read the whole customers
route.get('/', async (req,res) => {
    const customers = await Customer.find().sort({name:1});
    //send the whole customers database
    res.send(customers);
});

//Read a customer
route.get('/:id', async (req, res) => {
    const customer =   await Customer.findById(req.params.id);
    //checking if route parameter === any of the id in customers array.
    //if not found
    if(!customer)   
    return res.status(404).send('The Customer was unavailable.');    //send error
    
    //else
    res.send(customer.name);  //send object
});


//Update a customer
route.put('/:id', async (req, res) => {
    //input validation
    if (!validate(req.body))
    {
        res.status(400).send(results.error.details[0].message);
        return;
    }

    //check existense
    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    
    if(!customer)    //if not found
    return res.status(404).send('The Customers was unavailable.');

    //show the updated customer
    res.send(customer)
});


//Delete a customer
route.delete('/:id', async (req,res) => {
    //check existence
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer)    //if not found
    return res.status(404).send('The Customer was unavailable.');

    //if exists

    //send the deleted customer
    res.send(customer);
});

module.exports = route;

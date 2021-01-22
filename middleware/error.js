const winston = require('winston');

function error(err, req, res, next) 
{
    winston.error(err.message, {metadata: err});

    //error
    //warn
    //info
    //verbose
    //debug
    //silly

    res.status(500).send('Something Happened...');  
}

module.exports = error;
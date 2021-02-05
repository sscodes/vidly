const winston = require('winston');
const express = require('express');     //requiring the express framework
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

//creating environment variable
const port = process.env.PORT || 4774;

app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
})

winston.add(new winston.transports.File({ filename: 'logfile.log' }));

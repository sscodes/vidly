/*
To enforce the authorisation of particular operations to only specific people, 
this module is made. After a user is authenticated, and when he calls a api, the token
is verified to allow or  deny access.
*/

const jwt = require('jsonwebtoken');
const config = require('config'); 

function auth(req, res, next) 
{
    const token = req.header('x-auth-token');
    if(!token)
        return res.status(401).send('Access denied. No token provided...');

    try 
    {
        const decodedPyaload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedPyaload;
        next();
    }
    catch(ex)
    {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;
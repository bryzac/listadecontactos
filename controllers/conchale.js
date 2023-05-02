const conchaleRouter = require('express').Router();
const User = require('../models/user');
const Contact = require('../models/contact');
const { default: axios } = require('axios');

conchaleRouter.get('/', async (request, response) => {
    const cookies = request.cookies;
    if (!cookies?.accessToken) {
        await axios.get('/api/logout');
        window.location.pathname = '/login';
        return response.sendStatus(401);
    }
    console.log('Conchale');
    return response.sendStatus(200);
});

module.exports = conchaleRouter;
const contactRouter = require('express').Router();
const User = require('../models/user');
const Contact = require('../models/contact');

contactRouter.get('/', async (request, response) => {
    const cookies = request.cookies;
    if (!cookies?.accessToken) {
        await axios.get('/api/logout');
        window.location.pathname = '/login';
        return response.sendStatus(401);
    }
});


contactRouter.get('/', async (request, response) => {
    const user = request.user;
    const contacts = await Contact.find({ user: user.id });
    return response.status(200).json(contacts);
});


contactRouter.post('/', async (request, response) => {
    const user = request.user;
    const { name, number } = request.body;
    const newContact = new Contact({
        name,
        number,
        user: user._id,
    });
    const savedContact = await newContact.save();
    user.contacts = user.contacts.concat(savedContact._id);
    await user.save();

    return response.status(201).json(savedContact);
});


contactRouter.patch('/:id', async (request, response) => {
    const user = request.user;
    const { name, number } = request.body;

    await Contact.findByIdAndUpdate(request.params.id, { name, number });

    return response.sendStatus(200);
});

contactRouter.delete('/:id', async (request, response) => {
    const user = request.user;
    await Contact.findByIdAndDelete(request.params.id);
    user.contacts = user.contacts.pull(request.params.id);

    await user.save();
    return response.sendStatus(200);
});



module.exports = contactRouter;